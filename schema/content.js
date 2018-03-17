const mongoose=require('mongoose');
//内容的表结构
module.exports=new mongoose.Schema({
	//这是是个关联字，是根据去他表单取来的数据
	//分类的id
	category:{
		//类型
		type:mongoose.Schema.Types.ObjectId,
		//引用,关联的是category表结构
		ref:'category'
	},
	//内容标题
	title:String,
	//简介
	description:{
		type:String,
		default:''
	},
	//内容
	content:{
		type:String,
		default:''
	},
	
	//用户
	user:{
		//类型
		type:mongoose.Schema.Types.ObjectId,
		//引用,关联的是category表结构
		ref:'users'
	},
	
	//添加时间
	addTime:{
		type:Date,
		default:new Date()
	},
	
	//阅读量
	views:{
		type:Number,
		default:0
	},
	comments:{
		type:Array,
		default:[]
	}
	
})
