<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/back.png" class="back-img"></image></view>
			<view class="top-bar-center"><view class="title">详情</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
						<!-- <image :src="imgUrl" class="user-img"></image> -->
					</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify">
					<view class="title">签名</view>
					<view class="cont">hahahhahahhahahhhahahhahaha</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">2020-04-20 23:23:32</view>
				</view>
			</view>
			<view class="column">
				<view class="row">
					<view class="title">昵称</view>
					<view class="cont">栾树懊悔废弃</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker :range="array" @change="bindPickerChange" :value="index">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
					</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker :start="startDate" :end="endDate" @change="bindDateChange" :value="date" mode="date">
							<view class="uni-input">{{ date }}</view>
						</picker>
					</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">电话</view>
					<view class="cont">15850645842</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">邮箱</view>
					<view class="cont">763972275@qq.com</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="column">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">***********</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="bt2">退出登录</view>
		</view>
		<view class="modify" :style="{bottom:modifyHeight + 'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close"  @tap="modify">取消</view>
				<view class="title">签名</view>
				<view class="define"  @tap="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="text"  v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa"/>
				<textarea v-model="data" class="modify-content"/>
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			dataarr:{},
			array: ['男', '女', '未知'],
			index: 0,
			date: currentDate,
			tempFilePath: '',
			headimg:'',
			data:'heeelo',
			pwd:'',
			cropFilePath: '../../static/images/user1.jpg',
			animationData:{},
			isModify:false,
			modifyHeight:''
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	components: { ImageCropper },
	onReady() {
		this.getElementStyle();
	},
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//性别选择器
		bindPickerChange: function(e) {
			this.index = e.target.value;
		},
		//日期选择器
		bindDateChange: function(e) {
			this.date = e.target.value;
		},
		//获取日期
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year} - ${month} - ${day}`;
		},
		//头像裁剪上传函数
		upload() {
			uni.chooseImage({
				count: 1, //
				sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: res => {
					this.tempFilePath = res.tempFilePaths.shift();
				}
			});
		},
		//确认函数
		confirm(e) {
			this.tempFilePath = '';
			this.cropFilePath = e.detail.tempFilePath;
		},
		//取消函数
		cancel() {
			this.tempFilePath="";
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
			// if(ispwd){
			// 	this.ispwd = 'block'
			// }else{
			// 	this.ispwd = 'none'
			// }
			// this.modifyTitle = type;
			// this.data = data;
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
		modifySubmit(){
			this.modify()
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';
.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1rpx solid $uni-border-color;
}
.main {
	padding-top: 118rpx;
	display: flex;
	flex-direction: column;
	.column {
		display: flex;
		flex-direction: column;
		padding-top: 12rpx;
		width: 100%;
		border-bottom: 1rpx solid $uni-border-color;
		.row {
			display: flex;
			flex-direction: row;
		}
		.title {
			flex: none;
			padding: 0 $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 112rpx;
		}
		.head {
			height: 148rpx;
			display: flex;
			align-items: center;
		}
		.user-head {
			flex: auto;
		}
		.user-img {
			width: $uni-img-size-lg;
			height: $uni-img-size-lg;
			border-radius: $uni-border-radius-base;
		}
		.cont {
			flex: auto;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
			line-height: 112rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.more {
			flex: none;
			height: 112rpx;
			align-items: center;
			display: flex;
			image {
				width: 80rpx;
				height: 28rpx;
			}
		}
	}
	.bt2 {
		margin-top: 160rpx;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
		text-align: center;
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
