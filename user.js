const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {type :String ,
         required: true},
    email: {type: String},
     id: {type: String},
      
});

const user_model = mongoose.model('User',userSchema);

module.exports =user_model
