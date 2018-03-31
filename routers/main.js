const express=require('express');
const mainRouter=express.Router();
var Category=require('../modules/category.js');
var Content=require('../modules/content.js');
const appData={
	code:200,
	msg:'默认数据'
}
//mainRouter.use(function(	req,res,next){
//	res.send(appData);
//})
var data;
mainRouter.use(function(req,res,next){
	data={
		userInfo:req.userInfo,
		categorys:[],
	}
	Category.find().then(function(categorys){
		data.categorys=categorys;
		next();
	})
	
	
	/////////
})
//首页
mainRouter.get('/',function(req,res){

	data.category=req.query.category||'',
	data.count=0,
	data.page=Number(req.query.page||1),
	data.limit=3,
	data.pages=0,
	console.log(data)
	
	//读取所有的分类信息
	//是否需要条件查询
	var where={};
	if(data.category){
		where.category=data.category
	}
	//读取栏目分类
	Content.where(where).count().then(function(count){
		data.count=count;
		//计算总页数
		data.pages=Math.ceil(data.count/data.limit);
		//页数不能超过总页数
		data.page=Math.min(data.page,data.pages);
		//取值不能小于1
		data.page=Math.max(data.page,1);
		//查询忽略的条数，根据页数来查询
		var skip=(data.page-1)*data.limit;
		return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','users']).sort({
			addTime:-1
		})
	}).then(function(contents){
		//这里的contents是一个数组，在页面渲染的时候要用for循环
		data.contents=contents;
		console.log(data);
		res.render('index',data);
	})
})
//查看详情
mainRouter.get('/view',function(req,res){
	var contentId=req.query.contentId||'';
	Content.findOne({
		_id:contentId
	}).then(function(content){
		//这里的content不是一个数组，仅仅是一个对象，所以在页面渲染的时候不用for循环
		data.content=content;
		content.views++;//阅读数量
		content.save();//保存阅读数量
		res.render('view',data);
	})
})


module.exports=mainRouter;


//2018-3-8  21:00 提交
//2018-3-17 22:11 提交，已经算是完成了该项目
