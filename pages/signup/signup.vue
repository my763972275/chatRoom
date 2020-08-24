<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/back.png"></image>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/logo.png" mode="widthFix"></image>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" @blur="matchUser" placeholder="请输入用户名" class="user" placeholder-style="color:#aaa;font-weight:400;" />
					<view class="employ" v-if="useremploy">已占用</view>
					<image src="../../static/images/checked.png" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" @blur="isEmail" placeholder="请输入邮箱" class="email" placeholder-style="color:#aaa;font-weight:400;" />
					<view class="employ" v-if="emailemploy">已占用</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
					<image src="../../static/images/checked.png" class="ok"  v-if="isemail"></image>
				</view>
				<view class="inputs-div">
					<input :type="type" @input="getPsw" placeholder="请输入密码" class="psw" placeholder-style="color:#aaa;font-weight:400;" />
					<image :src="lookurl" class="look" @tap="looks()"></image>
				</view>
			</view>
		</view>
		<view :class="[{submit:isok},{submit1:!isok}]" @tap="signUp()">注册</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type:'password',
			isuser:false,  // 用户名是否可用
			isemail:false, // 邮箱是否被占用
			look:false,     // 是否显示密码
			invalid:false, // 邮箱是否符合
			useremploy:false,  // 是否被占用
			emailemploy:false, // 邮箱是否被占用
			lookurl:'../../static/images/unlook.png',
			email:'',      // 邮箱
			user:'',       // 用户名
			psw:'',        // 密码			
			isok:false,
		};
	},
	methods:{
		//密码显示隐藏
		looks:function(){
			if(this.look){
				this.type = 'password';
				this.lookurl = '../../static/images/unlook.png'
			}else{
				this.type = "text";
				this.lookurl = '../../static/images/look.png'
			}
			this.look = !this.look;
		},
		
		//判断是否是邮箱格式
		isEmail:function(e){
			this.email = e.detail.value;
			let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			if(this.email.length > 0){
				if(reg.test(this.email)){
					this.invalid = false;
					// 验证邮箱是否已存在
					this.matchEmail()
				}else{
					this.invalid = true;
					this.emailemploy = false;
					this.isemail = false;
				}
			}else{
				this.invalid = false;
				this.emailemploy = false;
				this.isemail = false;
				this.isOk();
			}
		},
		matchEmail(){
				uni.request({
					url:this.serverUrl+'/signup/judge',
					data:{
						data:this.email,
						type:"email"
					},
					method:'POST',
					success:(data) => {
						let status = data.data.status;
						//访问后端成功
						if(status == 200){
							let res = data.data.result;
							if(res>0){
								//表示邮箱已存在
								this.emailemploy = true;
								this.isemail = false;
							}else{
								this.emailemploy = false;
								this.isemail = true;
							}
							this.isOk();
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:1500
							})
						}
					}
				})
		},
		//匹配用户名
		matchUser:function(e){
			this.user = e.detail.value;
			if(this.user.length>0){
				uni.request({
					url:this.serverUrl+'/signup/judge',
					data:{
						data:this.user,
						type:"name"
					},
					method:'POST',
					success:(data) => {
						let status = data.data.status;
						//访问后端成功
						if(status == 200){
							let res = data.data.result;
							if(res>0){
								//表示用户名已存在
								this.useremploy = true;
								this.isuser = false;
							}else{
								this.useremploy = false;
								this.isuser = true;
							}
							this.isOk();
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}
					}
				})
			}else{
				this.useremploy = false;
				this.isuser = false;
				this.isOk();
			}
		},
		getPsw:function(e){
			this.psw = e.detail.value
			this.isOk();
		},
		//判断是否可以注册了
		isOk:function(){
			if(this.isuser && this.isemail && this.psw.length>5){
				this.isok = true;
			}else{
				this.isok = false;
			}
		},
		//返回登录页面
		backOne:function(){
			uni.navigateBack({
				delta:1 // 返回一层
			})
		},
		// 注册提交
		signUp(){
			if(this.isok){
				uni.request({
					url:this.serverUrl + '/signup/add',
					data:{
						name:this.user,
						mail:this.email,
						pwd:this.psw
					},
					method:'POST',
					success:(data) => {
						let status = data.data.status;
						if(status == 200){
							// 注册成功跳转到登录页面
							uni.navigateTo({
								url:'../signin/signin?user='+this.user
							})
						}else{
							uni.showToast({
								title:'服务器错误',
								icon:'none',
								duration:2000
							})
						}
					}
				})
			}
		}
	}
};
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
.content {
	padding-top: var(--status-bar-height);
}
.main {
	padding: 54rpx $uni-spacing-row-lg 120rpx;
	.title {
		font-size: 56rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
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
	.inputs-div{
		position:relative;
	}
	.employ,.invalid{
		position:absolute;
		right:0;
		top:40rpx;
		font-size:$uni-font-size-base;
		font-weight: 500;
		color:$uni-color-warning;
		line-height:88rpx;
	}
	.ok{
		width:38rpx;
		height:30rpx;
		position:absolute;
		right:0;
		top:76rpx;
	}
	.look{
		width:40rpx;
		height:40rpx;
		position:absolute;
		right:10rpx;
		top:76rpx;
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
.submit1 {
	width: 520rpx;
	height: 96rpx;
	background: rgba(39,40,50,0.2);
	// box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
	border-radius: 48rpx;
	text-align: center;
	font-weight: 500;
	font-size: $uni-font-size-lg;
	color: #fff;
	line-height: 96rpx;
	margin: 0 auto;
}
</style>
