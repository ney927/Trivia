import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();

app.listen(3000);
app.use('/', express.static('public'));
app.use(express.json());

let score = 0;
app.post('/score', function(req, res){
  score += req.body.ans;
  res.json({'score': score});
  res.end();
});

app.post('/profile', function(req, res){
  console.log(req.body);
  // if (req.body.score > await db.collection('profiles').get().highscore){
  //   //high score = req.body.score
  // }
})

app.get('/stats', function(req, res){
  res.json({'score': score});
  score = 0;
  res.end();
});

app.get('*', function(req, res){
  res.sendFile(process.cwd()+'/public/404.html');
});

