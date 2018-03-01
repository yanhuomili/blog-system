//$(function(){
//	$('#register').on('click',function(){
//		var username=$('.register #username').val();
//		var password=$('.register #password').val();
//		console.log('注册');
//		$.ajax({
//			type:'post',
//			url:'/api/user/register',
//			dataType:'json',
//			data:{
//				username:username,
//				password:password
//			},
//			success:function(result){
//				console.log(result);
//				if(result.code==0){
//					console.log('用户已经被注册');
//				}else{
//					$('h3').text(result.result.username);
//				}
//			}
//		})
//	})
//	
//	//登录
//	$('#login').on('click',function(){
//		var username=$('.login #lo-username').val();
//		var password=$('.login #lo-password').val();
//		console.log('注册');
//		$.ajax({
//			type:'post',
//			url:'/api/user/login',
//			dataType:'json',
//			data:{
//				username:username,
//				password:password
//			},
//			success:function(result){
//				if(result.code==2){
//					$('h3').text(result.userInfo.username);
//				}
//				console.log(result);
//			}
//		})
//	})
//})
