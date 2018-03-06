const express=require('express');
const mainRouter=express.Router();
var Category=require('../modules/category.js');
const appData={
	code:200,
	msg:'默认数据'
}
//mainRouter.use(function(	req,res,next){
//	res.send(appData);
//})
mainRouter.get('/',function(req,res){
	//读取所有的信息
	Category.find().then(function(categorys){
		res.render('index',{
			userInfo:req.userInfo,
			categorys:categorys
		});
	})
})
module.exports=mainRouter;