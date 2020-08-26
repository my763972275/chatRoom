<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/search.png" class="search-img"></image>
				<input type="search" placeholder="搜索用户/群" class="search" placeholder-style="color:#aaa;font-weight:400;" @input="search" />
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length > 0">用户</view>
				<view class="list user" v-for="(item, index) in userarr" :key="index">
					<navigator :url="'../userhome/userhome?id='+ item._id">
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip == 1" @tap="toChatRoom(item)">发消息</view>
					<view class="right-bt add" v-if="item.tip == 0" @tap="addFriendBtn(item._id)">加好友</view>
				</view>
			</view>
		</view>
		<!-- 添加好友弹出层 -->
		<view class="modify" :style="{bottom:-modifyHeight + 'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">添加好友</view>
				<view class="define"  @tap="addSubmit">确定</view>
			</view>
			<view class="modify-main">
				<!-- <input type="text"  v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa"/> -->
				<textarea v-model="msg" class="modify-content"/>
			</view>
		</view>
	</view>
</template>

<script>
import data from '../../commons/js/data.js';
import myfun from '../../commons/js/myfun.js'
export default {
	data() {
		return {
			msg:'',
			userarr: [],
			token:'',
			uid:'',
			fid:'',
			myname:'',
			animationData:{},
			isModify:false,
			modifyHeight:''
		};
	},
	onLoad() {
		this.getStorages();
	},
	onReady() {
		this.getElementStyle();
	},
	methods: {
		// 跳转到聊天页面
		toChatRoom(data) {
			console.log(data)
			// uni.navigateTo({
			// 	url: '../chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&imgurl=' + data.imgurl + '&type=' + data.type
			// });
		},
		//获取页面高度
		getElementStyle(){
			const query = uni.createSelectorQuery().in(this);
			query.select('.modify').boundingClientRect(data => {
				this.modifyHeight = data.height;
			}).exec()
		},
		//修改项弹框
		modify(){
			this.isModify = !this.isModify;
			var animation = uni.createAnimation({
				duration:300,
				timingFunction:'ease'
			})
			if(this.isModify){
				animation.bottom(0).step()
			}else{
				animation.bottom(-this.modifyHeight).step()
			}
			this.animationData = animation.export()
		},
		// 添加好友按钮
		addFriendBtn(fid){
			this.fid = fid
			this.msg = this.myname + '请求添加好友~'
			this.modify()
		},
		// 确定添加好友
		addSubmit(){
			if(this.msg.length > 0){
				this.modify();
				uni.request({
				   url:this.serverUrl + '/friend/applyfriend',
				   data:{
					   uid:this.uid,
					   fid:this.fid,
					   token:this.token,
					   msg:this.msg
				   },
				   method:'POST',
				   success: (data) => {
						let status = data.data.status;
						if(status == 200){
							uni.showToast({
								title:'好友请求发送成功!',
								icon:'none',
								duration:2000
							})
						}else{
							uni.showToast({
								title:'服务器出错了!',
								icon:'none',
								duration:2000
							})
						}
				   }
			    })
			}
		},
		getStorages(){
			try{
				const value = uni.getStorageSync('user');
				if(value){
					this.uid = value.id;
					this.myname = value.name;
					// this.imgurl = this.serverUrl + value.imgurl;
					this.token =value.token;
				}else{
					uni.navigateTo({
						url:'../signin/signin'
					})
				}
			}catch(e){
				
			}
		},
		search:myfun.debounce(function(e){
			this.userarr = [];
			let searchval = e.detail.value;
			if (searchval.length > 0) {
				this.searchUser(searchval);
			}
		},500),
		
		//寻找关键词匹配的用户
		searchUser: function(e) {
			uni.request({
				url:this.serverUrl + '/search/user',
				data:{
					data:e,
					token:this.token
				},
				method:'POST',
				success: (data) => {
					let status = data.data.status;
					if(status == 200){
						let arr = data.data.result;
						let exp = eval('/' + e + '/g');
						for (let i = 0; i < arr.length; i++) {
							// if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
								this.isFriend(arr[i],e);
							// }
						}
					}else if(status == 300){
						// token过期跳回到登录页面
						uni.navigateTo({
							url:'../signin/signin?name=' + this.myname
						})
					}else{
						uni.showToast({
							title:'服务器出错了!',
							icon:'none',
							duration:2000
						})
					}
				}
			})
		},
		//判断是否为好友
		isFriend: function(arr,e) {
			let exp = eval('/' + e + '/g');
			let tip = 0;
			if(arr._id == this.uid){
				tip = 2;
				arr.imgurl = this.serverUrl + arr.imgurl;
				arr.name = arr.name.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
				arr.email = arr.email.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
				this.userarr.push(arr);
				arr.tip = tip;
			}else{
				uni.request({
					url:this.serverUrl + '/search/isfriend',
					data:{
						uid:this.uid,
						fid:arr._id,
						token:this.token
					},
					method:'POST',
					success: (data) => {
						let status = data.data.status;
						if(status == 200){
							let arr = data.data.result;
							// 是好友
							tip = 1;
						}else if(status == 300){
							// token过期跳回到登录页面
							uni.navigateTo({
								url:'../signin/signin?name=' + this.myname
							})
						}
						else if(status == 400){
						}else{
							uni.showToast({
								title:'服务器出错了!',
								icon:'none',
								duration:2000
							})
						}
						arr.imgurl = this.serverUrl + arr.imgurl;
						arr.name = arr.name.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
						arr.email = arr.email.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
						this.userarr.push(arr);
						arr.tip = tip;
					}
				})
			}
		},
		//返回首页
		//返回登录页面
		backOne:function(){
			uni.navigateBack({
				delta:1 // 返回一层
			})
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';
.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1rpx solid $uni-border-color;
	.search-div {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		z-index: -1;
		float: left;
		padding: 14rpx 118rpx 14rpx 32rpx;
		box-sizing: border-box;
		background: #eee;
	}
	.search {
		height: 60rpx;
		background: $uni-bg-color-grey;
		border-radius: 10rpx;
		padding: 0 60rpx 0 12rpx;
	}
	.search-img {
		position: absolute;
		right: 130rpx;
		top: 22rpx;
		width: 40rpx;
		height: 40rpx;
	}
}
.main {
	padding: 88rpx $uni-spacing-col-base;
	.result {
		padding-top: $uni-spacing-col-base;
		.title {
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}
		.list {
			width: 100%;
			height: 80rpx;
			// border:1rpx solid red;
			padding: 20rpx 0;
			image {
				float: left;
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
		}
		.names {
			float: left;
			padding-left: $uni-spacing-col-base;
		}
		.name {
			font-size: 36rpx;
			font-weight: 400;
			color: $uni-text-color;
			line-height: 50rpx;
		}
		.email {
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			line-height: 28rpx;
		}
		.right-bt {
			float: right;
			width: 120rpx;
			height: 48rpx;
			border-radius: 24rpx;
			font-size: $uni-font-size-sm;
			line-height: 48rpx;
			text-align: center;
			margin-top: 16rpx;
		}
		.send {
			background: $uni-color-primary;
			color: $uni-text-color;
		}
		.add {
			background: rgba(74, 170, 255, 0.1);
			color: $uni-color-success;
		}
	}
}
.modify{
	position:fixed;
	z-index:1002;
	left:0;
	height:100%;
	width:100%;
	background-color:white;
	.modify-header{
		width:100%;
		height:88rpx;
		padding-top:val(--status-bar-height);
		display:flex;
		flex-direction: row;
		align-items: center;
		border-bottom:1rpx solid $uni-border-color;
		.close{
			padding-left:$uni-spacing-col-base;
			font-size:$uni-font-size-lg;
			color:$uni-text-color;
			line-height:44rpx;
		}
		.title{
			flex:auto;
			text-align: center;
			font-size:40rpx;
			color:$uni-text-color;
			line-height:88rpx;
		}
		.define{
			padding-right:$uni-spacing-col-base;
			font-size:$uni-font-size-lg;
			color:$uni-color-success;
			line-height:44rpx;
		}
	}
	.modify-main{
		display:flex;
		padding:$uni-spacing-col-base;
		flex-direction: column;
		.modify-pwd{
			margin-bottom:$uni-spacing-col-base;
			padding:0 20rpx;
			box-sizing: border-box;
			flex:auto;
			width:100%;
			height:88rpx;
			background:$uni-bg-color-grey;
			border-radius:20rpx;
			font-size:$uni-font-size-lg;
			color:$uni-text-color;
			line-height:88rpx;
		}
		.modify-content{
			padding:16rpx 20rpx;
			box-sizing: border-box;
			flex:auto;
			width:100%;
			height:386rpx;
			background:$uni-bg-color-grey;
			border-radius:20rpx;
			font-size:$uni-font-size-lg;
			color:$uni-text-color;
			line-height:44rpx;
		}
	}
}
</style>
