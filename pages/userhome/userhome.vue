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
			<view class="bg-bai"></view>
			<image src="../../static/images/user1.jpg" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background:sexBg}">
					<image src="../../static/images/female.png"></image>
				</view>
				<image src="../../static/images/user1.jpg" mode="aspectFill" class="user-img"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{user.name}}</view>
				<view class="nick">昵称：{{user.nick}}</view>
				<view class="intr">{{user.intr}}</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn">加为好友</view>
		</view>
		<view class="add-misg">
			<view class="name">{{user.name}}</view>
			<textarea :value="myname+'请求加为好友~'" maxlength="120" class="add-main"/>
		</view>
		<view class="add-bt">
			<view class="close">取消</view>
			<view class="send">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexBg:'rgba(255,93,91,1)',
				myname:'春雨',
				user:{
					name:'qiu',
					nick:'哈哈哈',
					intr:'你好啊是代购i阿萨的鬼泣我国对其的'
				}
			};
		},
		methods:{
			backOne:function(){
				uni.navigateBack({
					delta:1
				})
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
	padding-top:148rpx;
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
			width:400rpx;
			height:400rpx;
			border-radius: 48rpx;
			border:6rpx solid rgba(255,255,255,1);
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
	position:fixed;
	bottom:0;
	width:100%;
	height:104rpx;
	box-sizing: border-box;
	padding:12rpx $uni-spacing-col-base;
	.bottom-btn{
		text-align:center;
		line-height:80rpx;
		font-size: $uni-font-size-lg;
		color:$uni-text-color;
		height:80rpx;
		background:$uni-color-primary;
		border-radius:$uni-border-radius-sm;
	}
}
.add-misg{
	position: fixed;
	bottom:0;
	width:100%;
	box-sizing: border-box;
	padding:0 56rpx;
	height:1252rpx;
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
		// width:100%;
		height:420rpx;
		background:rgba(243,244,246,1);
		border-radius:20rpx;
		font-size:$uni-font-size-lg;
		font-weight:400;
		color:$uni-text-color;
		line-height: 44rpx;
	}
}
.add-bt{
	position:fixed;
	z-index:100;
	bottom:0;
	width:100%;
	height:104rpx;
	display:flex;
	padding:12rpx $uni-spacing-col-base;
	.close{
		width:172rpx;
		text-align:center;
		line-height:80rpx;
		font-size: $uni-font-size-lg;
		color:$uni-text-color;
		width:684rpx;
		height:80rpx;
		background:$uni-bg-color-hover;
		border-radius:$uni-border-radius-sm;
	}
	.send{
		flex:auto;
		text-align:center;
		line-height:80rpx;
		font-size: $uni-font-size-lg;
		color:$uni-text-color;
		height:80rpx;
		background:$uni-color-primary;
		border-radius:$uni-border-radius-sm;
	}
}
</style>
