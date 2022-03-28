const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const DB_PATH = "./data.js";
const TIMEOUT = 10000;

//Init BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const createAndSaveUser = require(DB_PATH).createAndSaveUser;
const addExerciseByUserID = require(DB_PATH).addExerciseByUserID;

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


app.post('/api/users', function(req, res, next){
  let username = req.body['username'];
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  createAndSaveUser(username, function(err, data){
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }
    res.json({"username": req.body['username'], "_id": data._id})
  });
});


app.post('/api/users/:_id?/exercises', function(req, res, next){
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  
  sendedDate = String(req.body['date']);
  sendedDate.length == 0 ? sendedDate = Date.now() : sendedDate = new Date(sendDate); 

  const exercise = {description: req.body['description'], duration: req.body['duration'], date: sendedDate};

  addExerciseByUserID(req.body[':_id'], exercise, function(err, data) {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }
    res.json({'_id': req._id, 'username': data.username, 'date': exercise.date
      , 'duration': exercise.duration, 'description': exercise.description});
  });


});
