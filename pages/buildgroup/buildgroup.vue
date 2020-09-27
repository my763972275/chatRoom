<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left"><view class="text" @tap="backOne">取消</view></view>
			<view class="top-bar-center"><view class="title">创建群聊</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image src="../../static/images/edit.png" class="pen" @tap="upload"></image>
					<image :src="cropFilePath" @tap="upload"></image>
				</view>
				<!-- 群名字 -->
				<view class="group-name">
					<input v-model="name" class="group-name-input" type="text" placeholder="为群取个名字"/>
				</view>
				<view class="title">用户</view>
			</view>
			<!-- 选择用户 -->
			<view class="friends">
				<view class="user" v-for="(item,index) in user" :key="index" @tap="selectFriend(index)">
					<view class="selected" :class="{isselected:item.selected}">
						<image src="../../static/images/selected.png" v-if="item.selected" class="selected-img"></image>
					</view>
					<image class="user-img" :src="item.imgurl"></image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" :class="{noselect:(select && name.length > 0)}">创建({{selectNum}})</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from '../../components/ling-imgcropper/ling-imgcropper.vue'
	export default {
		components:{
			ImageCropper
		},
		data() {
			return {
				selectNum:0,
				name:'',
				headimg:'',
				tempFilePath: '',
				cropFilePath: '../../static/images/group.png',
				user:[
					{
						selected:false,
						imgurl:'../../static/images/user1.jpg',
						name:'这里哪里'
					},
					{
						selected:false,
						imgurl:'../../static/images/user3.jpg',
						name:'这里哪里'
					},
					{
						selected:true,
						imgurl:'../../static/images/user1.jpg',
						name:'这里哪里'
					},
					{
						selected:false,
						imgurl:'../../static/images/user1.jpg',
						name:'这里哪里'
					},
					{
						selected:false,
						imgurl:'../../static/images/user3.jpg',
						name:'这里哪里'
					},
					{
						selected:true,
						imgurl:'../../static/images/user1.jpg',
						name:'这里哪里'
					},
					{
						selected:false,
						imgurl:'../../static/images/user1.jpg',
						name:'这里哪里'
					},
					{
						selected:false,
						imgurl:'../../static/images/user3.jpg',
						name:'这里哪里'
					},
					{
						selected:true,
						imgurl:'../../static/images/user1.jpg',
						name:'这里哪里'
					},
				]
			}
		},
		onLoad() {
			this.selectNumber();
		},
		computed:{
			select(){
				if(this.selectNum>0){
					return true;
				}else{
					return false;
				}
			}
		},
		methods: {
			// 获取已经选择个数
			selectNumber(){
				for(let i=0;i<this.user.length;i++){
					if(this.user[i].selected){
						this.selectNum++;
					}
				}
			},
			//头像裁剪上传函数
			upload() {
				uni.chooseImage({
					count: 1, //
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: res => {
						this.tempFilePath = res.tempFilePaths.shift();
					}
				});
			},
			//确认函数
			confirm(e) {
				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = this.cropFilePath;
				console.log(e)
			},
			backOne(){
				uni.navigateBack({
					delta:1
				})
			},
			// 动态选择好友
			selectFriend(e){
				this.user[e].selected = !this.user[e].selected;
				if(this.user[e].selected){
					this.selectNum++
				}else{
					this.selectNum--;
				}
			}
		}
	}
</script>

<style lang = "scss">
@import '../../commons/css/mycss.scss';
	.top-bar{
		background:rgba(255,255,255,1);
		border-bottom:1px solid $uni-border-color;
	}
	.main{
		display:flex;
		flex-direction: column;
		.top{
			padding-top:148rpx;
			position:fixed;
			background:white;
			width:100%;
			z-index:100;
			.group-img{
				margin:0 auto;
				width:196rpx;
				height:196rpx;
				background: $uni-color-primary;
				box-shadow:0rpx 18rpx 20rpx 0rpx rgba(39,40,50,0.1);
				border-radius: 20rpx;
				position:relative;
				image{
					width:100%;
					height:100%;
				}
				.pen{
					position:absolute;
					left:0;
					right:0;
					top:0;
					bottom:0;
					margin:auto;
					width:56rpx;
					height:56rpx;
					z-index:10;
				}
			}
			.group-name{
				padding:62rpx $uni-spacing-col-base 0;
				.group-name-input{
					text-align: center;
					color:$uni-text-color;
					line-height:92rpx;
					font-size:32rpx;
					height:92rpx;
					background:$uni-bg-color-grey;
					border-radius:46rpx;
				}
			}
			.title{
				padding:$uni-spacing-row-base $uni-spacing-col-base 20rpx;
				font-size:44rpx;
				font-weight: 600;
				color:$uni-text-color;
				line-height: 60rpx;
			}
		}
		.friends{
			padding:600rpx $uni-spacing-col-base 100rpx;
			.user{
				display:flex;
				flex-direction: row;
				height:120rpx;
				align-items: center;
				.selected{
				    flex:none;
					margin-right:30rpx;
					width:48rpx;
					height:48rpx;
					border-radius: 24rpx;
					background:rgba(255,228,49,0.5);
					position:relative;
					.selected-img{
						width:30rpx;
						height:20rpx;
						position:absolute;
						left:10rpx;
						top:16rpx;
					}
				}
				.isselected{
					background:rgba(255,228,49,1);
				}
				.user-img{
					width:80rpx;
					height:80rpx;
					flex:none;
					border-radius:$uni-border-radius-base;
				}
				.name{
					padding-left:32rpx;
					font-size:36rpx;
					color: $uni-text-color;
					display:-webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:1;
					overflow:hidden;
				}
			}
		}
	}
	.bottom-bar{
		background:rgba(250,250,250,0.9);
		box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.25);
		.bottom-btn{
			background:$uni-bg-color-grey;
			margin:0 $uni-spacing-col-base;
		}
		.noselect{
			background:$uni-color-primary;
			
		}
	}
	
</style>
