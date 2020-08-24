<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id='+uid" class="top-bar-left">
			    <view class="top-bar-left">
				    <image :src="imgurl" mode="widthFix"></image>
			     </view>
			</navigator>
			<view class="top-bar-center">
				<image src="../../static/images/logo.png" mode="widthFix" class="logo"></image>
			</view>
			<view class="top-bar-right">
				<view class="icon">
					<image src="../../static/images/search.png" mode="widthFix" @tap="toSearch"></image>
				</view>
				<view class="icon">
					<image src="../../static/images/add.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="friends">
				<view class="friend-list" v-for="(item,index) in friends" :key="item.id">
					<view class="friend-list-l">
						<text class="tip">{{item.tip}}</text>
						<image :src="'../../static/images/'+item.imgurl"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.time)}}</view>
						</view>
						<view class="info">{{item.news}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import myfun from '../../commons/js/myfun.js'
	export default {
		data() {
			return {
				friends:[],
				uid:'',
				imgurl:'',
				token:'',
			}
		},
		onLoad() {
            this.getFriends();
			this.getStorages();
			this.join(this.uid);
			this.sockettest();
		},
		methods: {
			changeTime:function(date){
				return myfun.dateTime(date)
			},
			// 获取缓存数据
			getStorages(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						this.uid = value.id;
						this.imgurl = this.serverUrl + value.imgurl;
						this.token =value.token;
					}else{
						uni.navigateTo({
							url:'../signin/signin'
						})
					}
				}catch(e){
					
				}
			},
			getFriends:function(){
				this.friends = datas.friends();
			},
			// 跳转到搜索页面
			toSearch:function(){
				uni.navigateTo({
					url:'../search/search'
				})
			},
			//socket 模块
			//用户登录socket注册
			join:function(uid){
				this.socket.emit('login',uid);
			},
			//服务器消息接收测试
			sockettest:function(){
				this.socket.on('msg',id =>{
					console.log('后端发送的消息为：' + id)
				})
			}
		}
	}
</script>

<style lang="scss">
	// @import  '../../commons/css/mycss.scss';
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top:var(--status-bar-height);
		padding-bottom:$uni-spacing-col-base;
	}
    .top-bar{
		position:fixed;
		z-index:1001;
		top:0;
		left:0;
		height:80rpx;
		width:100%;
		margin-top:var(--status-bar-height);
		background:$uni-bg-color;
		border-bottom:$uni-border-color;
		.top-bar-left{
			float:left;
			padding-left:20rpx;
			image{
				margin-top:10rpx;
				width:60rpx;
				height:60rpx;
				border-radius:16rpx;
			}
		}
		.top-bar-center{
			position:absolute;
			text-align: center;
			top:0;
			left:0;
			right:0;
			bottom:0;
			margin:auto;
			.logo{
				padding-top:19rpx;
				width:88rpx;
				height:42rpx;
				
			}
		}
		.top-bar-right{
			float:right;
			padding-right:14rpx;
			.icon{
				width:88rpx;
				height:88rpx;
				display:inline-block;
			}
			image{
				padding:18rpx 0 0 18rpx;
				width:52rpx;
				height:52rpx;
			}
		}
	}
	.main{
		padding-top:104rpx;
		width:90%;
	}
	.friend-list{
		height:96rpx;
		padding:16rpx 0;
		&:active{
			background-color:$uni-bg-color-grey;
		}
		.friend-list-l{
			position:relative;
			float:left;
			image{
				width:96rpx;
				height:96rpx;
				border-radius:$uni-border-radius-base;
				background-color:$uni-color-primary;
			}
			.tip{
				position:absolute;
				top:-6rpx;
				z-index:100;
				left:68rpx;
				min-width:36rpx;
				height:36rpx;
				font-size:$uni-font-size-sm;
				color:$uni-text-color-inverse;
				line-height:36rpx;
				text-align: center;
				border-radius:18rpx;
				background:$uni-color-warning;
				padding:0 8rpx;
			}
		}
		.friend-list-r{
			padding-left:128rpx;
			.top{
				height:50rpx;
				.name{
					float:left;
					font-size:36rpx;
					font-weight: 400;
					line-height:50rpx;
					color:$uni-text-color;
				}
				.time{
					float: right;
					font-size:$uni-font-size-sm;
					line-height:50rpx;
					color:$uni-text-color-disable;
				}
			}
		}
		.info{
			font-size:$uni-font-size-base;
		    color:$uni-text-color-grey ;
			line-height:40rpx;
			display:-webkit-box;
			overflow:hidden;
			-webkit-box-orient:vertical;
			-webkit-line-clamp:1;
		}
	}
</style>