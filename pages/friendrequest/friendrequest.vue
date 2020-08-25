<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" >
				<image src="../../static/images/back.png" mode="widthFix" @tap="backOne"></image>
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
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl"></image>
					</view>
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.lastTime)}}</view>
				</view>
				<view class="notic">
					<text>留言:&nbsp;&nbsp;{{item.msg}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js'
	export default {
		data() {
			return {
				requesters:[],
				uid:'',
				token:'',
				myname:'',
			}
		},
		onLoad(){
			this.getStorages();
			this.friendRequest();
		},
		methods: {
			// 获取缓存数据
			getStorages(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						this.uid = value.id;
						this.token =value.token;
						this.myname = value.name
					}else{
						uni.navigateTo({
							url:'../signin/signin'
						})
					}
				}catch(e){
					
				}
			},
			// 好友申请
			friendRequest(){
				uni.request({
					url:this.serverUrl + '/index/getfriend',
					data:{
						uid:this.uid,
						state:2,
						token:this.token
					},
					method:'POST',
					success:(data) => {
						let status = data.data.status;
						if(status == 200){
							let res = data.data.result;
							for(let i = 0;i<res.length;i++){
								res[i].imgurl = this.serverUrl + res[i].imgurl
								this.getLeave(res,i)
							}
							this.requesters = res
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}else if(status == 300){
							uni.navigateTo({
								url:'../signin/signin?name='+this.myname
							})
						}
					}
				})
				
			},
			// 获取留言
			getLeave(arr,i){
				uni.request({
					url:this.serverUrl + '/index/getlastmsg',
					data:{
						uid:this.uid,
						fid:arr[i].id,
						token:this.token
					},
					method:'POST',
					success:(data) => {
						let status = data.data.status;
						if(status == 200){
							let res = data.data.result;
							let e = arr[i];
							e.msg = res.message
							arr.splice(i,1,e);
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}else if(status == 300){
							uni.navigateTo({
								url:'../signin/signin?name='+this.myname
							})
						}
					}
				})
				
			},
			backOne:function(){
				uni.navigateBack({
					delta:1
				})
			},
			changeTime:function(date){
				return myfun.dateTime(date)
			},
			// 拒绝好友申请
			refuse(fid){
				uni.request({
					url:this.serverUrl + '/friend/deletefriend',
					data:{
						uid:this.uid,
						fid:fid,
						token:this.token
					},
					method:'POST',
					success: (data) => {
						let status = data.data.status;
						if(status == 200){
							for(let i = 0;i<this.requesters.length;i++){
								if(this.requesters[i].id == fid){
									this.requesters.splice(i,1)
								}
							}
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}else if(status == 300){
							uni.navigateTo({
								url:'../signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 同意好友申请
		    agree(fid){
				uni.request({
					url:this.serverUrl + '/friend/updateFriendState',
					data:{
						uid:this.uid,
						fid:fid,
						token:this.token
					},
					method:'POST',
					success: (data) => {
						let status = data.data.status;
						if(status == 200){
							for(let i = 0;i<this.requesters.length;i++){
								if(this.requesters[i].id == fid){
									this.requesters.splice(i,1)
								}
							}
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}else if(status == 300){
							uni.navigateTo({
								url:'../signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 同意好友申请
			// getRequesters(){
			// 	this.requesters = datas.friends();
			// 	for(let i=0;i<this.requesters.length;i++){
			// 		this.requesters[i].imgurl = '../../static/images/' + this.requesters[i].imgurl
			// 	}
			// }
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
		background-color: #ebebeb;
		line-height:30rpx;
		letter-spacing: 1rpx;
	}
}
</style>