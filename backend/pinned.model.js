const mongoose = require('mongoose');

 
const PinnedSchema = new mongoose.Schema({
   obj_id:{

   },
    obj_type:{
    
    },

});

const Pinned = mongoose.model('Pinned', PinnedSchema);

module.exports = Pinned;