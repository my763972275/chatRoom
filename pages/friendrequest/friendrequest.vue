<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/back.png" mode=""></image>
			</view>
			<view class="top-bar-center">
				<view class="title">好友请求</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in requesters" :key="index">
				<view class="request-top">
					<view class="reject btn">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl"></image>
					</view>
					<view class="agree btn">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.time)}}</view>
				</view>
				<view class="notic">
					<text>{{item.news}}</text>
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
				requesters:[]
			}
		},
		onLoad(){
			this.getRequesters();
		},
		methods: {
			backOne:function(){
				uni.navigateBack({
					delta:1
				})
			},
			changeTime:function(date){
				return myfun.dateTime(date)
			},
			getRequesters(){
				this.requesters = datas.friends();
				for(let i=0;i<this.requesters.length;i++){
					this.requesters[i].imgurl = '../../static/images/' + this.requesters[i].imgurl
				}
			}
		}
	}
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.top-bar{
	background:rgba(255,255,255,0.96);
	border-bottom:1rpx solid $uni-border-color;
}
.main{
	padding:108rpx $uni-spacing-col-base;
	.requester{
		margin-top:112rpx;
		padding:$uni-spacing-col-base;
		background:rgba(255,255,255,1);
		box-shadow: 0rpx 24rpx 64rpx -8rpx rgba(0,0,0,0.1);
		border-radius:20rpx;
	}
	.request-top{
		display:flex;
		flex-direction: row;
		.btn{
			flex:auto;
			width:160rpx;
			height:64rpx;
			background:rgba(255,93,91,0.1);
			border-radius:40rpx;
			text-align:center;
			font-size:$uni-font-size-lg;
			line-height:64rpx;
		}
		.reject{
			color:$uni-color-warning;
			background-color:rgba(255,93,91,0.1);
		}
		.agree{
			color:$uni-text-color;
			background-color:$uni-color-primary;
		}
		.header-img{
			margin-top:-104rpx;
			flex:auto;
			text-align: center;
			image{
				width:144rpx;
			    height:144rpx;
			    border-radius:$uni-border-radius-circle;
				background-color: $uni-color-primary;
			}
			
		}
	}
	.request-center{
		text-align: center;
		padding-top:20rpx;
		padding-bottom:40rpx;
		.title{
			font-size:36rpx;
			color:$uni-text-color;
			font-weight:500;
			line-height:50rpx;
		}
		.time{
			font-size:$uni-font-size-sm;
			color:$uni-text-color-disable;
			line-height: 34rpx;
		}
	}
	.notic{
		padding:$uni-spacing-row-sm $uni-spacing-col-base;
		border-radius:$uni-border-radius-base;
		font-size:$uni-font-size-base;
		color:$uni-text-color;
		line-height:40rpx;
	}
}
</style>