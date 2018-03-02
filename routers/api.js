const express=require('express');
const mongoose=require('mongoose');
const apiRouter=express.Router();
const User=require('../modules/users.js');
var appData;
apiRouter.use(function(req,res,next){
	 appData={
		code:200,
		msg:'默认数据'
	}
	next();
})
//注册API
apiRouter.post('/user/register',function(req,res){
	console.log(req.body)
	var userN=req.body.username;
	var passW=req.body.password;
	
	//数据库查询
	User.findOne({
		username:userN
	}).then(function(userInfo){
		//如果数据库没有该记录返回null
		if(userInfo){
			appData.code=0;
			appData.msg='该用户已经被注册';
			res.json(appData);
			return;
		}
		//保存用户注册的信息到数据库
		var user=new User({
			username:userN,
			password:passW
		});
		return user.save();
		console.log(userInfo);
	}).then(function(newuserInfo){//返回保存的对象
		appData.code=1;
		appData.msg='注册成功';
		appData.userinfo={
			username:newuserInfo.username
		}
		res.json(appData);
	})
})

//登录api
apiRouter.post('/user/login',function(req,res){
	console.log(req.body)
	var userN=req.body.username;
	var passW=req.body.password;
	
	//数据库查询
	User.findOne({
		username:userN,
		password:passW
	}).then(function(userInfo){
		//如果数据库没有该记录返回null
		if(userInfo){
			appData.code=1;
			appData.msg='登录成功';
			appData.userInfo={
				username:userInfo.username,
				password:userInfo.password
			}
			//登录成功后发送一个cookie给客户端
			console.log(userInfo._id);
			req.cookies.set('UserInfo',JSON.stringify({
				_id:userInfo._id,
				username:userInfo.username
			}))
		}else{
			appData.code=0;
			appData.msg='用户名或密码错误';
			
		}
		
		res.json(appData);
		
	})
})

//登出API
apiRouter.post('/user/logout',function(req,res){
	req.cookies.set('UserInfo',null);
	res.json(appData);
})

module.exports=apiRouter;