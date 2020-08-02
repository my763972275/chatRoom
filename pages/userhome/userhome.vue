<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/back.png" mode=""></image>
			</view>
			<view class="top-bar-right">
				<view class="more-img">
					<image src="../../static/images/more.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai" :animation = "animationData4"></view>
			<image src="../../static/images/user1.jpg" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background:sexBg}" :animation="animationData3">
					<image src="../../static/images/female.png"></image>
				</view>
				<image src="../../static/images/user1.jpg" mode="aspectFill" class="user-img" :animation="animationData2"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{user.name}}</view>
				<view class="nick">昵称：{{user.nick}}</view>
				<view class="intr">{{user.intr}}</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" @tap="addFriendAnimat">加为好友</view>
		</view>
		<view class="add-misg" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}" :animation = "animationData">
			<view class="name">{{user.name}}</view>
			<textarea :value="myname+'请求加为好友~'" maxlength="120" class="add-main"/>
		</view>
		<view class="add-bt bottom-bar" :animation = "animationData1">
			<view class="close btn1" @tap="addFriendAnimat">取消</view>
			<view class="send btn1">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexBg:'rgba(255,93,91,1)',
				addHeight:'', //页面高度
				myname:'春雨',
				isAdd:false,
				animationData:{}, // 动画
				animationData1:{}, // 动画
				animationData2:{}, // 动画
				animationData3:{}, // 动画
				animationData4:{}, // 动画
				user:{
					name:'qiu',
					nick:'哈哈哈',
					intr:'你好啊是代购i阿萨的鬼泣我国对其的'
				}
			};
		},
		onReady() {
			this.getElementStyle();
		},
		methods:{
			backOne:function(){
				uni.navigateBack({
					delta:1
				})
			},
			// 获取背景高度
			getElementStyle:function(){
				//注：uni.createSelectorQuery() 需在生命周期mounted后进行调用
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
					console.log('得到布局位置信息' + JSON.stringify(data));
					console.log('节点离页面顶部的距离为' + data.top);
					this.addHeight = data.height - 186 ;
				}).exec();
			},
			//添加好友动画
			addFriendAnimat:function(){
				this.isAdd = !this.isAdd;
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'ease'
				})
				var animation1 = uni.createAnimation({
					duration:300,
					timingFunction:'ease'
				})
				var animation2 = uni.createAnimation({
					duration:300,
					timingFunction:'ease'
				})
				var animation3 = uni.createAnimation({
					duration:300,
					timingFunction:'ease'
				})
				var animation4 = uni.createAnimation({
					duration:300,
					timingFunction:'ease'
				})
				if(this.isAdd){
					animation.bottom(0).step()
					animation1.bottom(0).step()
					animation2.width(120).height(120).step()
					animation3.opacity(0).step()
					animation4.backgroundColor('rgba(255,228,49,0.6)').step()
				}else{
					animation.bottom(-this.addHeight).step()
					animation1.bottom(-100).step()
					animation2.width().height().step()
					animation3.opacity(1).step()
					animation4.backgroundColor('rgba(255,228,49,0)').step()
				}
				
				this.animationData = animation.export()
				this.animationData1 = animation1.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
				this.animationData4 = animation4.export()
			}
		}
	}
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';
.bg{
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	z-index:-2;
	.bg-bai{
		width:100%;
		height:100%;
		// background-color:#eee;
	}
	.bg-img{
		opacity: 0.4;
		position:absolute;
		z-index:-1;
		left:-10rpx;
		top:-10rpx;
		width:110%;
		height:110%;
		filter:blur(16px); //模糊程度
	}
}
.main{
	text-align: center;
	padding-top:240rpx;
	.user-header{
		position:relative;
		margin: 0 auto;
		width:412rpx;
		height:412rpx;
		.sex{
			position:absolute;
			z-index:11;
			bottom:22rpx;
			right:22rpx;
			width:64rpx;
			height:64rpx;
			border-radius:$uni-border-radius-circle;
			image{
				width:32rpx;
				height: 32rpx;
				padding:16rpx;
			}
		}
		.user-img{
			z-index:10;
			top:0;
			width:400rpx;
			height:400rpx;
			border-radius: 48rpx;
			border:6rpx solid rgba(255,255,255,1);
			box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39,40,50,0.1);
		}
	}
	.user-imf{
		padding-top:42rpx;
		text-align: center;
		.name{
			font-size:52rpx;
			color:$uni-text-color;
			line-height:74rpx;
		}
		.nick{
			font-size:$uni-font-size-base;
			line-height: 40rpx;
			color:$uni-text-color;
		}
		.intr{
			padding:20rpx 100rpx;
			width:552rpx;
			font-size:$uni-font-size-base;
			font-weight:300;
			color:$uni-text-color;
			line-height:48rpx;
		}
	}
}
.bottom-bar{
	.bottom-btn{
		background:$uni-color-primary;
		margin:0 $uni-spacing-col-base;
	}
	
}
.add-misg{
	position: fixed;
	bottom:0;
	width:100%;
	box-sizing: border-box;
	padding:0 56rpx;
	background:rgba(255,255,255,1);
	border-radius:40rpx 40rpx 0rpx 0rpx;
	.name{
		padding:168rpx 0 40rpx;
		font-size:52rpx;
		color:$uni-text-color;
		line-height:74rpx;
	}
	.add-main{
		padding:18rpx 22rpx;
		box-sizing: border-box;
		width:100%;
		height:420rpx;
		background:$uni-bg-color-grey;
		border-radius:$uni-border-radius-base;
		font-size:$uni-font-size-lg;
		color:$uni-text-color;
		line-height: 44rpx;
	}
}
.add-bt{
	z-index:100;
	bottom:-114rpx;
	display:flex;
	.close{
		width:172rpx;
		background:$uni-bg-color-hover;
		margin-left:$uni-spacing-col-base;
	}
	.send{
		margin:0 $uni-spacing-col-base;
		flex:auto;
		background:$uni-color-primary;
	}
}
</style>
