const express=require('express');
const userRouter=express.Router();
//加载user数据模型，通过模型来操作数据库。
var User=require('../modules/users.js');
//加载分类数据模型
var Category=require('../modules/category.js');
//加载内容数据模型
var Content=require('../modules/content.js');

const appData={
	code:200,
	msg:'默认数据'
}
//userRouter.use(function(	req,res,next){
//	res.send(appData);
//})
userRouter.use(function(req,res,next){
	appData.code=300,
	appData.msg='user 中的user接口返回的数据';
	next();
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
	
	var page=Number(req.query.page||1);
	var limit=3;
	var pages=0;
	User.count().then(function(count){
		//计算总页数
		pages=Math.ceil(count/limit);
		//页数不能超过总页数
		page=Math.min(page,pages);
		//取值不能小于1
		page=Math.max(page,1);
		//查询忽略的条数，根据页数来查询
		var skip=(page-1)*limit;
		
		User.find().limit(limit).skip(skip).then(function(users){
			console.log(users);//返回用户数据库的数组
			res.render('admin/user_index',{
				userInfo:req.userInfo,
				users:users,//将数据库中的数据传到页面上去
				count:count,//总条数
				pages:pages,//总页数
				page:page,//当前页数
				limit:limit,//每页显示的条数
			})
			
		})
	})
	
	
	
	
})


//分类首页
userRouter.get('/category',function(req,res){
	var page=Number(req.query.page||1);
	var limit=3;
	var pages=0;
	Category.count().then(function(count){
		//计算总页数
		pages=Math.ceil(count/limit);
		//页数不能超过总页数
		page=Math.min(page,pages);
		//取值不能小于1
		page=Math.max(page,1);
		//查询忽略的条数，根据页数来查询
		var skip=(page-1)*limit;
		
		/*sort({})
		 升序 1
		 降序 -1
		 * */
		Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categorys){
			console.log(categorys);//返回用户数据库的数组
			res.render('admin/category_index',{
				userInfo:req.userInfo,
				categorys:categorys,//将数据库中的数据传到页面上去
				count:count,//总条数
				pages:pages,//总页数
				page:page,//当前页数
				limit:limit,//每页显示的条数
			})
			
		})
	})
})

//分类添加,get方式访问的时候返回一个页面
userRouter.get('/category/add',function(req,res){
	res.render('admin/category_add',{
			userInfo:req.userInfo,
		})
})
//分类的保存，post方式提交的时候返回数据
userRouter.post('/category/add',function(req,res){
//	这里接受的数据不是ajax提交过来的,所以我们使用跳转页面的方式来向用户展示操作结果信息
	console.log(req.body.name)
	var name=req.body.name ||'';
	if(name==""){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'名称不能为空',
		})
		return;
	}
	//数据库中是否已经存在同名的分类
	Category.findOne({name:name}).then(function(result){
		if(result){
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'该分类已经存在'
			})
			return Promise.reject();
		}else{
			//数据库中不存在该分类，可以保存
			return new Category({
				name:name
			}).save();
		}
	}).then(function(newCategory){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'分类保存成功',
			url:'/user/category'
		})
	})
})

//分类的列表的编辑，以get请求方式来跳转到一个页面
userRouter.get('/category/edit',function(req,res){
	//获取要修改的分类的信息
	var id=req.query.id||'';
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			req.render('admin/error',{
				userInfo:req.userInfo,
				message:'分类信息不存在'
			});
			return;
		}else{
			res.render('admin/category_edit',{
				userInfo:req.userInfo,
				category:category
			})
		}
	})
})

//分类的修改保存
userRouter.post('/category/edit',function(req,res){
	//获取要修改的分类的信息
	var id=req.query.id||'';
	//获取post提交过来的新的分类的名称
	var name=req.body.name||'';
	
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			req.render('admin/error',{
				userInfo:req.userInfo,
				message:'分类信息不存在'
			});
			return Promise.reject();
		}else{
			//当用户没有修改过就提交
			if(name==category.name){
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'修改成功',
					url:'/user/category'
				})
				return Promise.reject();
			}else{
				return	Category.findOne({
					_id:{$ne:id},
					name:name
				})
			}
			
		}
	}).then(function(sameCategory){
		if(sameCategory){
			//要修改的分类名称是否在数据库中已经存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'数据库中已经存在同名的分类'
			})
			return Promise.reject();
		}else{
			return Category.update({
				_id:id
			},{
				name:name
			});
		}
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改成功',
			url:'/user/category'
		})
	})
})


//删除分类
userRouter.get('/category/del',function(req,res){
	//获取需要删除的id
	var id=req.query.id||'';
	Category.remove({
		_id:id
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除成功',
			url:'/user/category'
		})
	})
})



/*内容首页*/
userRouter.get('/content',function(req,res){
	var page=Number(req.query.page||1);
	var limit=3;
	var pages=0;
	Content.count().then(function(count){
		//计算总页数
		pages=Math.ceil(count/limit);
		//页数不能超过总页数
		page=Math.min(page,pages);
		//取值不能小于1
		page=Math.max(page,1);
		//查询忽略的条数，根据页数来查询
		var skip=(page-1)*limit;
		
		/*.populate('category')里面的'category'对应的是Content表结构中的category字段，
		 * Content表结构中category字段关联的是模型category表结构中的name字段，这里的关系有点复杂。
		 * 在查询中如果有多个关联的字段populate(['category','user']),使用数组的方式
		 */
		
		Content.find().limit(limit).skip(skip).populate(['category','users']).sort({
			addTime:-1
		}).then(function(contents){
			console.log(contents);//返回用户数据库的数组
			res.render('admin/content_index',{
				userInfo:req.userInfo,
				contents:contents,//将数据库中的数据传到页面上去
				
				count:count,//总条数
				pages:pages,//总页数
				page:page,//当前页数
				limit:limit,//每页显示的条数
			})
			
		})
	})
	
})

/*内容添加*/
userRouter.get('/content/add',function(req,res){
	
	Category.find().sort({_id:-1}).then(function(categorys){
		console.log(categorys)
		res.render('admin/content_add',{
			userInfo:req.userInfo,
			categorys:categorys
		})
	})
	
})

//内容保存
userRouter.post('/content/add',function(req,res){
	console.log(req.body)
	if(req.body.category==""){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'分类内容不能为空'
		})
		return;
	}
	if(req.body.title==""){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'分类标题不能为空'
		})
		return;
	}
	new Content({
		category:req.body.category,
		title:req.body.title,
		user:req.userInfo._id.toString(),//当前登录用户的id
		description:req.body.description,
		content:req.body.content,
	}).save().then(function(rs){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'内容保存成功',
			url:'/user/content'
		})
	});
		
})

//删除内容
userRouter.get('/content/del',function(req,res){
	//获取需要删除的id
	var id=req.query.id||'';
	Content.remove({
		_id:id
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除成功',
			url:'/user/content'
		})
	})
})





//内容修改页面
userRouter.get('/content/edit',function(req,res){
	//获取需要删除的id
	var id=req.query.id||'';
	var categorys=[]
	Category.find().sort({_id:-1}).then(function(rs){
		categorys=rs;
		return Content.findOne({
			_id:id
		}).populate('category')
	}).then(function(content){
			if(!content){
				res.render('admin/error',{
					userInfo:req.userInfo,
					message:'指定内容不存在'
				})
			}else{
				res.render('admin/content_edit',{
					userInfo:req.userInfo,
					categorys:categorys,
					content:content
				})
			}
		})
	
	
})

//内容修改保存
userRouter.post('/content/edit',function(req,res){
	//获取需要删除的id
	var id=req.query.id||'';
	if(req.body.category==''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'内容分类不能为空'
		})
		return;
	}
	if(req.body.title==""){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'内容标题不能为空'
		})
		return;
	}
	Content.update({
		_id:id
	},{
		category:req.body.category,
		title:req.body.title,
		description:req.body.description,
		content:req.body.content,
	}).then(function(contents){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'内容保存',
			url:'/user/content'
		})
	})
})




module.exports=userRouter;