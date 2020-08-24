<template>
	<view class="content">
		<view class="top-bar" @tap="toSignUp">
			<view class="top-bar-right"><view class="text">注册</view></view>
		</view>
		<view class="logo"><image src="../../static/images/logo.png" mode="widthFix"></image></view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到yike!</view>
			<view class="inputs">
				<input type="text"  placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" v-model="user"/>
				<input type="password"  placeholder="密码" class="psw" placeholder-style="color:#aaa;font-weight:400;" v-model="psw"/>
			</view>
			<view class="tips" :style="{display:mon}">输入用户名或密码错误！</view>
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
			mon:'none'
		};
	},
	onLoad(e) {
		if(e.user){
			this.user = e.user;
			uni.showToast({
				title:'注册成功请登录',
				icon:'none',
				duration:2000
			})
		}else if(e.name){
			this.user = e.name;
			uni.showToast({
				title:'token过期，请重新登录',
				icon:'none',
				duration:2000
			})
		}
	},
	methods: {
		//登录
		login: function() {
			if (this.user && this.psw) {
				uni.request({
					url: this.serverUrl + '/signin/match',
					data: {
						data:this.user,
						pwd:this.psw
					},
					method:'POST',
					success:(data) => {
						let status = data.data.status;
						if(status == 200){
							this.mon = 'none';
							// 登录成功
							let res = data.data.back;
							console.log(res)
							// 本地存储用户信息
							try{
								uni.setStorageSync('user',{'token':res.token,'id':res.id,'name':res.name,'imgurl':res.imgurl})
							}catch(e){
								console.log('数据库存储错误')
							}
							uni.navigateTo({
								url:'../index/index'
							})
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错！',
								icon:'none',
								duration:2000
							})
						}else{
							this.mon = 'block';
							this.psw = ''
						}
					}
				});
			}
		},
		//跳转到注册界面
		toSignUp: function() {
			uni.navigateTo({
				url: '../signup/signup'
			});
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
