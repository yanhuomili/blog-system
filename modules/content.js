const mongoose=require('mongoose');
const contentSchema=require('../schema/content.js');
module.exports=mongoose.model('content',contentSchema);
