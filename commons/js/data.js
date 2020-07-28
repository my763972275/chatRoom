export default{
	friends:function(){
		let friendarr = [
			{
				id:1,
				name:'大海',
				email:'763972275@qq.com',
				imgurl:'user1.jpg',
				tip:2234,
				time:new Date(),
				news:'TOP 常常遇到文章标题列表布局排版时候，有的标题哈哈哈哈哈'
			},
			{
				id:2,
				name:'春暖花开',
				email:'763972275@qq.com',
				imgurl:'user10.jpg',
				tip:34,
				time:new Date(),
				news:'TOP 常常遇到文章标题列表布局排版时候，有的标题哈哈哈哈哈'
			},
			{
				id:3,
				name:'大海',
				email:'763972275@qq.com',
				imgurl:'user2.jfif',
				tip:22,
				time:new Date(),
				news:'TOP 常常遇到文章标题列表布局排版时候，有的标题哈哈哈哈哈'
			},
			{
				id:4,
				name:'哈喽',
				email:'huohu@163.com',
				imgurl:'user10.jpg',
				tip:24,
				time:new Date(),
				news:'TOP 常常遇到文章标题列表布局排版时候，有的标题哈哈哈哈哈'
			},
		]
		return friendarr;
	},
	//好友关系
	isFriend:function(){
		let isfriend = [
			{
				userid:1,
				friend:2
			},
			{
				userid:1,
				friend:5
			},
			{
				userid:1,
				friend:6
			},
			{
				userid:1,
				friend:8
			}
		]
		return isfriend;
	}
}