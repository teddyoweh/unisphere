const mongoose = require('mongoose');

 
const threadSchema = new mongoose.Schema({
    receiver_id: {

    },
    sender_id: {

    },
    message: {

    },
    date: {
        type:Date,
        default: Date.now()
    },
    receiver_type:{
        type:String
    
    },
    isai:{
        type:Boolean,
        default:false
    },
    receiver_name:{
        type:String

    },

});

const Threads = mongoose.model('Threads', threadSchema);

module.exports = Threads;