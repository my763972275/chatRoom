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
	},
	//聊天消息
	message:function(){
		let msgs = [
			{
				id:'b',
				imgurl:'user3.jpg',
				message:{
					name:'天安门城楼售票处',
					address:'东长安街天安门城楼内',
					latitude:'39.909473',
					longitude:'116.397308999999'
				},
				types:3,
				time:new Date(),
				tip:12
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:{
					name:'天安门城楼售票处',
					address:'东长安街天安门城楼内',
					latitude:'39.909473',
					longitude:'116.397308999999'
				},
				types:3,
				time:new Date(),
				tip:13
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:{
					voice:'a',
					time:60
				},
				types:2,
				time:new Date(),
				tip:10
			},
			{
				id:'b',
				imgurl:'user3.jpg',
				message:{
					voice:'a',
					time:20
				},
				types:2,
				time:new Date(),
				tip:11
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:'怀化公司对公i大广赛u购物i归队啊是对啊公对公五i去，改善帝国五i给',
				types:0,
				time:new Date()-1000,
				tip:0
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:'怀化公司对公i大广赛u购物i归队啊是对啊公对公五i去，改善帝国五i给',
				types:0,
				time:new Date()-1000*16,
				tip:1
			},
			{
				id:'b',
				imgurl:'user3.jpg',
				message:'怀化公司对公i大广赛u购物i归队啊是对啊公对公五i去，改善帝国五i给',
				types:0,
				time:new Date()-1000*60,
				tip:2
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:'怀化公司对',
				types:0,
				time:new Date()-1000*60*36,
				tip:3
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:'user6.jpg',
				types:1,
				time:new Date()-1000*60*40,
				tip:4
			},
			{
				id:'b',
				imgurl:'user3.jpg',
				message:'怀化公司对公i大广赛u购物i归队啊是对啊公对公五i去，改善帝国五i给',
				types:0,
				time:new Date()-1000*60*57,
				tip:5
			},
			{
				id:'a',
				imgurl:'user1.jpg',
				message:'怀化公司对公i大广赛u购物i归队啊是对啊公对公五i去，改善帝国五i给',
				types:0,
				time:new Date()-1000*60*58,
				tip:5
			},
			{
				id:'b',
				imgurl:'user3.jpg',
				message:'怀化公司对公i大广赛u购物i归队啊是对啊公对公五i去，改善帝国五i给',
				types:0,
				time:new Date()-1000*60*60,
				tip:7
			},
			{
				id:'b',
				imgurl:'user3.jpg',
				message:'user10.jpg',
				types:1,
				time:new Date()-1000*60*60*24,
				tip:8
			},
		]
		return msgs;
	}
}