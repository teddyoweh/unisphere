const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstname: {
        type: String,
     
    },
    lastname:{
        type:String
    },
    username:{
        type:String
    },
    email: {
        type: String,
        required: true,
 
 
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    
    

});
    
const User = mongoose.model('User', userSchema);

module.exports = User;