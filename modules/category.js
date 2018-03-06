const mongoose=require('mongoose');
const categorySchema=require('../schema/category.js');
module.exports=mongoose.model('category',categorySchema);
