<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id=' + uid" class="top-bar-left">
				<view class="top-bar-left"><image :src="imgurl" mode="widthFix"></image></view>
			</navigator>
			<view class="top-bar-center"><image src="../../static/images/logo.png" mode="widthFix" class="logo"></image></view>
			<view class="top-bar-right">
				<view class="icon"><image src="../../static/images/search.png" mode="widthFix" @tap="toSearch"></image></view>
				<view class="icon"><image src="../../static/images/add.png" mode="widthFix" @tap="buildGroup"></image></view>
			</view>
		</view>
		<view class="main">
			<view class="refresh" v-if="!refresh">
				<image src="../../static/images/load.png"></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<!-- 没有好友 -->
			<view class="noone" v-if="!noone && requestData == 0 && friends.length == 0">
				<image src="../../static/images/nodatas.png" mode="aspectFill"></image>
				<view class="no-title">一个好友都没有</view>
				<view class="search-bt" @tap="toSearch">搜索好友</view>
			</view>
			<view class="friends" >
				<view class="friend-list" @tap="goRequest" v-if="requestData > 0">
					<view class="friend-list-l">
						<text class="tip">{{ requestData }}</text>
						<image src="../../static/images/apply.png" style="width:50px;height:50px;"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{ changeTime(requestTime) }}</view>
						</view>
						<view class="info">茫茫人海，相遇便是缘分</view>
					</view>
				</view>
				<view class="friend-list" v-for="(item, index) in friends" :key="item.id" @tap="toChatRoom(item)">
					<view class="friend-list-l">
						<text class="tip" v-if="item.tip > 0">{{ item.tip }}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="time">{{ changeTime(item.lastTime) }}</view>
						</view>
						<view class="info">{{ item.msg }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import myfun from '../../commons/js/myfun.js';
export default {
	data() {
		return {
			friends: [],
			uid: '',
			imgurl: '',
			token: '',
			myname: '',
			requestData: 0, //申请数
			requestTime: '', //最后申请时间
			refresh: false,
			noone:false, // 是否没有好友
		};
	},
	onLoad() {
		this.getStorages();
		this.getFriends();
		this.friendRequest();
		this.join(this.uid);
		this.receiveSocketMsg();
	},
	onPullDownRefresh() {
	    this.friends = [];
	    this.getStorages();
	    this.getFriends();
	    this.friendRequest();
	    setTimeout(function () {
	        uni.stopPullDownRefresh();
	    }, 1000);
	},
	methods: {
		changeTime: function(date) {
			return myfun.dateTime(date);
		},
		// 获取缓存数据
		getStorages() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.imgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
					this.myname = value.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		// 获取好友列表
		getFriends() {
			uni.request({
				url: this.serverUrl + '/index/getfriend',
				data: {
					uid: this.uid,
					state: 0,
					token: this.token
				},
				method: 'POST',
				success: data => {
					this.refresh = true;
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						if (res.length > 0) {
							this.noone = true;
							for (let i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + res[i].imgurl;
								if (res[i].markname) {
									res[i].name = res[i].markname;
								}
								this.friends.push(res[i]);
							}
							this.friends = myfun.sort(this.friends, 'lastTime', 0);
						    // 获取好友内信息
						    for (let i = 0; i < this.friends.length; i++) {
							    this.getLastMsg(this.friends, i);
							    this.getUnread(this.friends, i);
						    }
						}else{
							this.noone = false;
						}
						// this.getGroup();
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin?name=' + this.myname
						});
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错了！',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},
		// 获取群列表
		getGroup(){
			uni.request({
				url: this.serverUrl + '/index/getgroup',
				data: {
					uid: this.uid,
					token: this.token
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						if (res.length > 0) {
							for (let i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + res[i].imgurl;
								this.friends.push(res[i]);
							}
						}
						this.friends = myfun.sort(this.friends, 'lastTime', 0);
						// 获取好友内信息
						for (let i = 0; i < this.friends.length; i++) {
							this.getLastMsg(this.friends, i);
						}
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin?name=' + this.myname
						});
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错了！',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},
		// 好友申请
		friendRequest() {
			uni.request({
				url: this.serverUrl + '/index/getfriend',
				data: {
					uid: this.uid,
					state: 1,
					token: this.token
				},
				method: 'POST',
				success: data => {
					this.refresh = true;
					let status = data.data.status;
					if (status == 200) {
						this.noone = true;
						let res = data.data.result;
						this.requestData = res.length;
						if (res.length > 0) {
							this.requestTime = res[0].lastTime;
							for (let i = 0; i < res.length; i++) {
								if (this.requestTime < res[i].lastTime) {
									this.requestTime = res[i].lastTime;
								}
							}
						}else{
							this.noone = false
						}
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错了！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin?name=' + this.myname
						});
					}
				}
			});
		},
		// 获取最后消息
		getLastMsg(arr, i) {
			uni.request({
				url: this.serverUrl + '/index/getlastmsg',
				data: {
					uid: this.uid,
					fid: arr[i].id,
					token: this.token
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					// console.log(data.data)
					if (status == 200) {
						let res = data.data.result;
						if (res.types == 0) {
							// 文字
						} else if (res.types == 1) {
							// 图片
							res.message = '[图片]';
						} else if (res.types == 2) {
							// 音频
							res.message = '[语音]';
						} else if (res.types == 3) {
							// 定位
							res.message = '[位置]';
						}
						let e = arr[i];
						e.msg = res.message;
						arr.splice(i, 1, e);
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin?name=' + this.myname
						});
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错了！',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},
		// 获取未读消息数
		getUnread(arr, i) {
			uni.request({
				url: this.serverUrl + '/index/unreadmsg',
				data: {
					uid: this.uid,
					fid: arr[i].id,
					token: this.token
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					// console.log(data.data)
					if (status == 200) {
						let res = data.data.result;
						let e = arr[i];
						e.tip = res;
						arr.splice(i, 1, e);
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin?name=' + this.myname
						});
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错了！',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},
		goRequest() {
			uni.navigateTo({
				url: '../friendrequest/friendrequest'
			});
		},
		// 跳转到聊天页面
		toChatRoom(data) {
			console.log(data)
			uni.navigateTo({
				url: '../chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&imgurl=' + data.imgurl + '&type=' + data.type
			});
		},
		// 跳转到搜索页面
		toSearch(){
			uni.navigateTo({
				url: '../search/search'
			});
		},
		// 跳转到新建群页面
		buildGroup(){
			uni.navigateTo({
				url:'../buildgroup/buildgroup'
			})
		},
		//socket 模块
		//用户登录socket注册
		join(uid) {
			this.socket.emit('login', uid);
		},
		// socket聊天数据接收
		receiveSocketMsg(){
			this.socket.on('msg',(msg,fromid) => {
				let nmsg = '';
				if(msg.types == 0){
					nmsg = msg.message
				}else if(msg.types == 1){
					nmsg = '[图片]'
				}else if(msg.types == 2){
					nmsg = '[音频]'
				}else{
					nmsg = '[位置]'
				}
				for(let i = 0; i < this.friends.length; i++){
					if(this.friends[i].id == fromid){
						let e = this.friends[i];
						e.lastTime = new Date();
						e.msg = nmsg;
						e.tip++;
						// 删除原来数据项
						this.friends.splice(i,1,e)
						// 新消息插入到最顶部
						this.friends.unshift(e)
					}
				}
			})
		}
	}
};
</script>

<style lang="scss">
// @import  '../../commons/css/mycss.scss';
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: var(--status-bar-height);
	padding-bottom: $uni-spacing-col-base;
}
.top-bar {
	position: fixed;
	z-index: 1001;
	top: 0;
	left: 0;
	height: 80rpx;
	width: 100%;
	margin-top: var(--status-bar-height);
	background: $uni-bg-color;
	border-bottom: $uni-border-color;
	.top-bar-left {
		float: left;
		padding-left: 20rpx;
		image {
			margin-top: 10rpx;
			width: 80rpx;
			height: 80rpx;
			border-radius: 16rpx;
		}
	}
	.top-bar-center {
		position: absolute;
		text-align: center;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		.logo {
			padding-top: 19rpx;
			width: 88rpx;
			height: 42rpx;
		}
	}
	.top-bar-right {
		float: right;
		padding-right: 14rpx;
		.icon {
			width: 88rpx;
			height: 88rpx;
			display: inline-block;
		}
		image {
			padding: 18rpx 0 0 18rpx;
			width: 52rpx;
			height: 52rpx;
		}
	}
}
.main {
	padding-top: 104rpx;
	width: 90%;
}
.refresh {
	text-align: center;
	padding-top: 480rpx;
	image {
		width: 32rpx;
		height: 32rpx;
	}
	.ref-title {
		padding-top: 10rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		color: rgba(39,40,50,0.4);
		line-height: 40rpx;
	}
}
.noone{
	text-align: center;
	padding-top:400rpx;
	image{
		height:250rpx;
		width:158rpx;
	}
	.no-title {
		padding: 32rpx 0;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		color: rgba(39,40,50,0.4);
		line-height: 40rpx;
	}
	.search-bt{
		display:inline-block;
		width:240rpx;
		height:96rpx;
		background:$uni-color-primary;
		box-shadow: 0px 52rpx 36rpx -32rpx rgba(255,228,49,0.4);
		border-radius: 48rpx;
		font-size:$uni-font-size-base;
		font-family: PingFangSC-Regular,PingFang SC;
		color:$uni-text-color;
		line-height:96rpx;
	}
}
.friend-list {
	height: 96rpx;
	padding: 16rpx 0;
	&:active {
		background-color: $uni-bg-color-grey;
	}
	.friend-list-l {
		position: relative;
		float: left;
		image {
			width: 96rpx;
			height: 96rpx;
			border-radius: $uni-border-radius-base;
			background-color: $uni-color-primary;
		}
		.tip {
			position: absolute;
			top: -6rpx;
			z-index: 100;
			left: 68rpx;
			min-width:22rpx;
			// max-width: 36rpx;
			height: 36rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-inverse;
			line-height: 36rpx;
			text-align: center;
			border-radius: 18rpx;
			background: $uni-color-warning;
			padding: 0 8rpx;
		}
	}
	.friend-list-r {
		padding-left: 128rpx;
		.top {
			height: 50rpx;
			.name {
				float: left;
				font-size: 36rpx;
				font-weight: 400;
				line-height: 50rpx;
				color: $uni-text-color;
			}
			.time {
				float: right;
				font-size: $uni-font-size-sm;
				line-height: 50rpx;
				color: $uni-text-color-disable;
			}
		}
	}
	.info {
		font-size: $uni-font-size-base;
		color: $uni-text-color-grey;
		line-height: 40rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
}
</style>
