require('dotenv').config();

//Init MongoDB connection
let mongoose;
try {
  mongoose = require("mongoose");
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (e) {
  console.log(e);
}

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  exercises: [{description: String, duration: Number, date: Date}]
});
  
let UserModel = mongoose.model('Users', userSchema)


const createAndSaveUser = (userName, done) => {
  let user = UserModel({
    username: userName,
    exercises: []
  });

  user.save(function(err, data){
    if (err) return done(err);
    done(null, data);
  });
}

const findUserByID = (userId, done) => {
  UserModel.findById(userId, function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
}

const addExerciseByUserID = (userId, exercise, done) => {
  findUserByID(userId, function(err, findedUser){
    console.log(userId);
    
    findedUser.exercises.push(exercise);

    findedUser.save(function(err, data) {
      if (err) return done(err);
      done(null, data);
    });

    // Нужна обработка ошибки при кривом айдишнике и недостаточных полях
  });

}

exports.UserModel = UserModel;
exports.createAndSaveUser = createAndSaveUser;
exports.addExerciseByUserID = addExerciseByUserID;