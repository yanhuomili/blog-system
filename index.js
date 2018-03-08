const express=require('express');
const mongoose=require('mongoose');
const swig=require('swig');
const bodyParser=require('body-parser');
const Cookies=require('cookies');
const app=express();
const apiRouter=require('./routers/api');
const mainRouter=require('./routers/main');
const userRouter=require('./routers/user');
//静态文件的处理
app.use('/public',express.static(__dirname+'/public'));


//定义模板引擎
app.engine('html',swig.renderFile);
//设置模板引擎的目录,第一个参数必须是views
app.set('views','./pages');
//设置模板渲染的文件
app.set('view engine','html');

//清除缓存
swig.setDefaults({cache:false});
//设置post请求中间件,在req请求对象中自动加入body对象
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies
app.use(function(req,res,next){
	req.cookies=new Cookies(req,res);
//	解析用户的登录信息
	req.userInfo={};
	if(req.cookies.get('UserInfo')){
		try{
			req.userInfo=JSON.parse(req.cookies.get('UserInfo'));
			//获取当前用户的 登录类型,实时查询登录用是否为管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
				next();
			})
		}catch(e){next();}
	}else{
		next();
	}
	
	
})



//app.use('/',userRouter);
//app.use('/user',userRouter);
app.use('/',mainRouter);
app.use('/api',apiRouter);
app.use('/user',userRouter);
//
//app.use(function(req,res,next){
//	console.log('sfsdfsdfs');
//	next();
//})
//app.get('/user',function(req,res){
//	console.log('服务器开启成功');
//	res.send('hello world');
//})

mongoose.connect('mongodb://localhost:27017/blog',function(err){
	if(err){
		console.log(err);
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		app.listen(8080);
	}
});

