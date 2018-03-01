const express=require('express');
const mainRouter=express.Router();
const appData={
	code:200,
	msg:'默认数据'
}
//mainRouter.use(function(	req,res,next){
//	res.send(appData);
//})
mainRouter.get('/',function(req,res){
	console.log('main api');
	appData.code=300,
	appData.msg='main 接口返回的数据';
//	res.send(appData);
	res.render('index',{
		userInfo:req.userInfo
	});
})
module.exports=mainRouter;