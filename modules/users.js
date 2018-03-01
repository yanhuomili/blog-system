const mongoose=require('mongoose');
const userSchema=require('../schema/users.js');
module.exports=mongoose.model('user',userSchema);
