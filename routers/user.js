const express=require('express');
const userRouter=express.Router();
const appData={
	code:200,
	msg:'默认数据'
}
//userRouter.use(function(	req,res,next){
//	res.send(appData);
//})
userRouter.get('/user',function(req,res){
	appData.code=300,
	appData.msg='user 中的user接口返回的数据';
	res.send(appData);
})
module.exports=userRouter;