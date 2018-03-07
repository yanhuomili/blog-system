const mongoose=require('mongoose');
//内容的表结构
module.exports=new mongoose.Schema({
	//这是是个关联字，是根据去他表单取来的数据
	//分类的id
	category:{
		//类型
		type:mongoose.Schema.Types.ObjectId,
		//引用,关联的是Category模型
		ref:'Category'
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
	}
	
})
