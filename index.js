import { profile } from "console";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();

app.listen(3000);
app.use('/', express.static('public'));
//to get POST request body
app.use(express.json());

//to use POST forms
const parseUrl = require('body-parser')
const encodeUrl = parseUrl.urlencoded({ extended: false })

//firebase
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const admin = require("firebase-admin");
const serviceAccount = require("/Users/neyhabilling/Desktop/VS/JS/node/trivia/secret.json");
const firebaseConfig = {
  apiKey: "AIzaSyDM3u7JYwnDL9zl76VtzKd-5PyAlUBoYUQ",
  authDomain: "trivia-2e4ad.firebaseapp.com",
  databaseURL: "https://trivia-2e4ad-default-rtdb.firebaseio.com",
  projectId: "trivia-2e4ad",
  storageBucket: "trivia-2e4ad.appspot.com",
  messagingSenderId: "271333948213",
  appId: "1:271333948213:web:1d8020a25868b4542cea7c",
  credential: admin.credential.cert(serviceAccount)
};
initializeApp(firebaseConfig);
// initializeApp({
//   databaseURL: "https://trivia-2e4ad-default-rtdb.firebaseio.com/",
//   serviceAccount: serviceAccount, 
// });
const db = getFirestore();

let score = 2;
app.post('/score', function(req, res){
  score += req.body.ans;
  res.json({'score': score, 'name': username});
  res.end();
});

let username = 'anon';
app.post('/newprofile', encodeUrl, async function(req, res){
  const dbData = {
    name: req.body.name,
    highscore: 0
  }
  const ref = await db.collection('profiles').add(dbData);
  username = req.body.name;
  res.sendFile(process.cwd()+'/public/question.html');
});

app.post('/start', function(req, res){
  username = req.body.name;
  res.end();
});

const path = require('path');
app.get('/incorrect/:ans', function(req, res){
  res.sendFile(path.join(process.cwd()+'/public/incorrect.html'));
  // console.log(process.cwd()+'/public/incorrect.html');
  // res.redirect('/incorrect.html');
});

app.get('/allprofiles', async function(req, res){
  const docs = await db.collection('profiles').get();
  let profiles = [];
  docs.forEach(doc => {
    profiles.push(doc.data().name);
  });
  res.json({profs: profiles});
  res.end();
});

import { doc, updateDoc } from "firebase/firestore";
app.get('/stats', async function(req, res){
  const prof = await db.collection('profiles').where('name', '==', username).get();
  let hscore = '';
  prof.forEach(doc=>{
    hscore = doc._fieldsProto.highscore.integerValue;
    if (score > hscore){
      const ref = db.collection('profiles').doc(username);
      // const ref = doc(db, 'profiles', username);
      // updateScore(ref, score);
      hscore = score;
    };

    console.log(doc._fieldsProto.highscore.integerValue, hscore, username);
  });
  res.json({
    'score': score,
    'name': username,
    'highscore': hscore
  });
  score = 0;
  res.end();
});

async function updateScore(ref, newScore){
  // const ref = await db.collection('profiles').doc(name).update({highscore: newScore});
  // const ref = await db.collection('profiles').doc(name);
  // const ref = await doc.ref.update({highscore: newScore});
  // const newref = await doc.delete();
  // const newref = await updateDoc(ref, {highscore: newScore});
  console.log(ref);
}

app.get('*', function(req, res){ 
  res.sendFile(process.cwd()+'/public/404.html');
});

