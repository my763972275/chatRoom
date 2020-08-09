<template>
	<view class="content">
		<view class="top-bar-left" @tap="backOne">
			<image src="../../static/images/back.png"></image>
		</view>
		<view class="top-bar" @tap="toSignUp">
			<view class="top-bar-right"><view class="text">注册</view></view>
		</view>
		<view class="logo"><image src="../../static/images/logo.png" mode="widthFix"></image></view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到yike!</view>
			<view class="inputs">
				<input type="text" @input="getUser()" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" />
				<input type="password" @input="getPassword()" placeholder="密码" class="psw" placeholder-style="color:#aaa;font-weight:400;" />
			</view>
			<view class="tips" v-if="isshow">输入用户名或密码错误！</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: '',
			psw: '',
			token:'',
			isshow:false
		};
	},
	methods: {
		//登录
		login: function() {
			if (this.user && this.psw) {
				uni.request({
					url: '',
					data: {},
					method:'POST',
					success:(data) => {
						this.token = data.data.back.token;
					}
				});
			}else{
				this.isshow = true;
			}
		},
		//跳转到注册界面
		toSignUp: function() {
			uni.navigateTo({
				url: '../signup/signup'
			});
		},
		//获取用户名/邮箱
		getUser: function(e) {
			this.user = e.detail.value;
		},
		//获取密码
		getPassword: function(e) {
			this.psw = e.detail.value;
		},
		backOne:function(){
			uni.navigateBack({
				delta:1
			})
		}
	}
};
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
.content {
	padding-top:var(--status-bar-height);
	.top-bar-left{
		image{
			margin-top:10rpx;
			margin-left:30rpx;
			width:60rpx;
			height:60rpx;
			border-radius:16rpx;
		}
	}
}
.main {
	padding: 54rpx $uni-spacing-row-lg 120rpx;
	.title {
		font-size: 56rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
	}
	.slogan {
		font-size: 40rpx;
		color: $uni-text-color-grey;
		line-height: 56rpx;
	}
	.inputs {
		padding-top: 48rpx;
		input {
			padding-top: 40rpx;
			height: 88rpx;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 88rpx;
			border-bottom: 1rpx solid $uni-border-color;
		}
	}
	.tips {
		float: left;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 56rpx;
	}
}
.submit {
	width: 520rpx;
	height: 96rpx;
	background: $uni-color-primary;
	box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
	border-radius: 48rpx;
	text-align: center;
	font-weight: 500;
	font-size: $uni-font-size-lg;
	color: $uni-text-color;
	line-height: 96rpx;
	margin: 0 auto;
}
</style>
