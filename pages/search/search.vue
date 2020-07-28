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
					<image :src="item.imgurl"></image>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip == 1">发消息</view>
					<view class="right-bt add" v-else>加好友</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import data from '../../commons/js/data.js';
export default {
	data() {
		return {
			userarr: []
		};
	},
	methods: {
		//获取关键词
		search: function(e) {
			this.userarr = [];
			let searchval = e.detail.value;
			if (searchval.length > 0) {
				this.searchUser(searchval);
			}
		},
		//寻找关键词匹配的用户
		searchUser: function(e) {
			let arr = data.friends();
			let exp = eval('/' + e + '/g');
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
					this.isFriend(arr[i]);
					arr[i].imgurl = '../../static/images/' + arr[i].imgurl;
					arr[i].name = arr[i].name.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
					arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
					this.userarr.push(arr[i]);
				}
			}
		},
		//判断是否为好友
		isFriend: function(e) {
			let tip = 0;
			let arr = data.isFriend();
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].friend == e.id) {
					tip = 1;
				}
			}
			e.tip = tip;
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
</style>
