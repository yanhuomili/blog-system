const express=require('express');
const userRouter=express.Router();
var User=require('../modules/users.js');

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

//后台用户首页
userRouter.get('/',function(req,res){
	res.render('admin/admin',{
		userInfo:req.userInfo
	})
})

//后台用户管理
userRouter.get('/user',function(req,res){
	/*从后台数据库中拿去数据
	 * limit(Number):限制后去的条数
	 * skip(3):忽略数据的条数
	 * 每页显示3条
	 * 1 1-3 skip:0 ->  (当前页-1)*limit
	 * 2 4-6 skip:3 ->  (当前页-1)*limit
	 * */
	
	var page=req.query.page||1;
	var limit=3;
	var skip=(page-1)*limit
	User.find().limit(limit).skip(skip).then(function(users){
		console.log(users);//返回用户数据库的数组
		res.render('admin/user_index',{
			userInfo:req.userInfo,
			users:users//将数据库中的数据传到页面上去
		})
		
	})
	
	
})


//分类首页
userRouter.get('/category',function(req,res){
	res.render('admin/category_index',{
			userInfo:req.userInfo,
		})
})

//分类添加
userRouter.get('/category/add',function(req,res){
	res.render('admin/category_add',{
			userInfo:req.userInfo,
		})
})

module.exports=userRouter;