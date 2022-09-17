const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const app = express();

const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const db = require('./config/db.json');
const { randomInt } = require('crypto');

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//open read only route

app.get('/api/scoreboard', (req, res) => {
  res.status(200).json(db.teams);
});

app.get('/api/events', (req, res) => {
  res.status(200).json(db.events);
});

app.get('/api/quests', (req, res) => {
  res.status(200).json(db.quest);
});

// private route

app.post('/api/scoreboard', auth.verifyAuth, (req, res) => {
  const teamid = req.body.teamid;
  const teamname = req.body.teamname;
  const score = req.body.score;
  const event = req.body.event;
  const user = req.body.user;

  if (teamid != undefined && score != undefined && event != undefined && user != undefined && teamname != undefined) {
    console.log('teamid:', teamid, 'score:', score, 'event:', event, 'user:', user, 'teamname:', teamname);
    db.teams.find(team => team.id === teamid).score += score;
    db.events.push({name: event, team: teamname, score: score, user: user});
    console.log(db.events);
    updateJson();
    res.status(200).json({ "msg": "score added" });
  } else {
    res.status(400).json({ "msg": "bad request" });
  }
});

app.post('/api/quests', auth.verifyAuth, (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const score = req.body.score;

  if (name != undefined && description != undefined && score != undefined) {
    console.log('name:', name, 'description:', description, 'score:', score);
    db.quest.push({name: name, description: description, score: score, team: []});
    console.log(db.quest);
    updateJson();
    res.status(200).json({ "msg": "quest added" });
  } else {
    res.status(400).json({ "msg": "bad request" });
  }
});

app.put('/api/quests', auth.verifyAuth, (req, res) => {
  const name = req.body.name;
  const teamid = req.body.teamid;

  if (name != undefined && teamid != undefined) {
    console.log('name:', name, 'teamid:', teamid);
    db.quest.forEach((quest, index) => {
      if (quest.name == name) {
        db.quest[index].team.push(teamid);
      }
    });
    console.log(db.quest);
    updateJson();
    res.status(200).json({ "msg": "quest updated" });
  } else {
    res.status(400).json({ "msg": "bad request" });
  }
});

// route secret flag

app.get('/api/flag', (req, res) => {
  //random flag
  randomInt(0,15, (err, flag) => {
    if (err) {
      console.log(err);
      res.status(500).json({ "msg": "internal server error" });
    } else {
      console.log('flag:', flag);
      if (flag == 10) {
        res.status(200).sendFile('flag.txt', { root: __dirname });
        return;
      }
      var random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      res.status(200).send(random);
    }
  });
});

app.use(notFound.notFound);

//update json file
function updateJson() {
 const fs = require('fs');
 fs.writeFile('src/config/db.json', JSON.stringify(db), function (err) {
   if (err) throw err;
   console.log('DB Saved!');
 });
}

// generate JWT token for bot on server startup
function generateToken() {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: 'bot' }, process.env.JWT_TOKEN_SECRET, { expiresIn: "360d" });
  console.log('JWT token generated:', token);
}

// starting the server
app.listen(process.env.API_PORT, () => {
  console.log(`listening on port ${process.env.API_PORT}`);
  generateToken();
});
