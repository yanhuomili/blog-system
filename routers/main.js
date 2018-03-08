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

//首页
mainRouter.get('/',function(req,res){
	var data={
		userInfo:req.userInfo,
		categorys:[],
		count:0,
		contents:[],
		page:Number(req.query.page||1),
		limit:3,
		pages:0,
	};
	//读取所有的分类信息
	Category.find().then(function(categorys){
		data.categorys=categorys;
		return Content.count();
	}).then(function(count){
		data.count=count;
		//计算总页数
		data.pages=Math.ceil(data.count/data.limit);
		//页数不能超过总页数
		data.page=Math.min(data.page,data.pages);
		//取值不能小于1
		data.page=Math.max(data.page,1);
		//查询忽略的条数，根据页数来查询
		var skip=(data.page-1)*data.limit;
		return Content.find().limit(data.limit).skip(skip).populate(['category','users']).sort({
			addTime:-1
		})
	}).then(function(contents){
		data.contents=contents;
		console.log(data);
		res.render('index',data);
	})
})
module.exports=mainRouter;


//2018-3-8  21:00 提交
