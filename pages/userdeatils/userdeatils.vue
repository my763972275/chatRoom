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
					<view class="user-head" v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
					<image :src="cropFilePath" class="user-img" v-if="id != uid"></image>
				</view>

				<view class="row" @tap="modify('签名', 'explain', dataarr.explain, false)" v-if="id == uid">
					<view class="title">签名</view>
					<view class="cont">{{ dataarr.explain }}</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">签名</view>
					<view class="cont">{{ dataarr.explain }}</view>
				</view>
				<view class="row">
					<view class="title">注册时间</view>
					<view class="cont">{{ changeTime(dataarr.time) }}</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('昵称', 'name', dataarr.name, false)" v-if="id == uid">
					<view class="title">昵称</view>
					<view class="cont">{{ dataarr.name }}</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('昵称', 'markname', dataarr.name, false)" v-if="id != uid">
					<view class="title">昵称</view>
					<view class="cont">{{ markname }}</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker :range="array" @change="bindPickerChange" :value="index" v-if="id == uid">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{ array[index] }}</view>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/detail.png" mode="aspectFit" v-if="id == uid"></image></view>
				</view>
				<view class="row" v-if="id == uid">
					<view class="title">生日</view>
					<view class="cont">
						<picker :start="startDate" :end="endDate" @change="bindDateChange" :value="date" mode="date" v-if="id == uid">
							<view class="uni-input">{{ date }}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{ date }}</view>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('电话', 'phone', dataarr.phone, false)" v-if="id == uid">
					<view class="title">电话</view>
					<view class="cont">{{ dataarr.phone }}</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">电话</view>
					<view class="cont">{{ dataarr.phone }}</view>
				</view>
				<view class="row" @tap="modify('邮箱', 'email', dataarr.email, false)" v-if="id == uid">
					<view class="title">邮箱</view>
					<view class="cont">{{ dataarr.email }}</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">邮箱</view>
					<view class="cont">{{ dataarr.email }}</view>
				</view>
			</view>
			<view class="column" v-if="id == uid">
				<view class="row" @tap="modify('密码', 'psw', '', true)">
					<view class="title">密码</view>
					<view class="cont">******</view>
					<view class="more"><image src="../../static/images/detail.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="bt2" v-if="id == uid" @tap="quit">退出登录</view>
			<view class="bt2" v-if="id != uid" @tap="deleteFriend">删除好友</view>
		</view>
		<view class="modify" :style="{ bottom: -modifyHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify('', '', '', false)">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa" :style="{ display: ispwd }" />
				<textarea v-model="data" class="modify-content" />
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import myfun from '../../commons/js/myfun.js';
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			id: '',
			uid: '',
			token: '',
			myname: '',
			markname: '',
			dataarr: {}, //表单数组
			array: ['男', '女'],
			index: 0, //性别数组下标
			date: currentDate, //生日日期
			tempFilePath: '',
			headimg: '',
			data: '修改的内容',
			oldData: '',
			modifyTitle: '',
			ispwd: 'none', //是否显示密码项
			pwd: undefined,
			type: '', //修改项
			cropFilePath: '../../static/images/user1.jpg',
			animationData: {},
			isModify: false,
			modifyHeight: '1000'
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
	onLoad(e) {
		this.id = e.id;
		this.getStorages();
		this.getUser();
		this.getMarkName();
	},
	methods: {
		// 获取缓存数据
		getStorages() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.token = value.token;
					this.myname = value.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		// 获取用户信息
		getUser() {
			uni.request({
				url: this.serverUrl + '/user/detail',
				data: {
					id: this.id,
					token: this.token
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						console.log(res)
						// 处理头像链接
						this.cropFilePath = this.serverUrl + res.imgurl;
						// 处理简介
						if (res.explain == undefined) {
							res.explain = '这个人很懒，什么都没有留下~';
						}
						// 处理生日
						if (res.birth == undefined) {
							this.date = '0000-00-00';
						} else {
							this.date = myfun.detailTime1(res.birth);
						}
						// 处理电话
						if (res.phone == undefined) {
							res.phone = '未知';
						}
						if (this.markname.length == 0) {
							this.markname = res.name;
						}
						this.sexJudge(res.sex);
						this.dataarr = res;
					} else if (status == 300) {
						// token过期跳回到登录页面
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
		// 性别判断
		sexJudge(e) {
			if (e == 'female') {
				this.index = 1;
			} else {
				this.index = 0;
			}
		},
		// 获取好友昵称
		getMarkName() {
			if (this.id != this.uid) {
				uni.request({
					url: this.serverUrl + '/user/getmarkname',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						if (status == 200) {
							let res = data.data.result;
							if (res.markname != undefined) {
								this.markname = res.markname;
							}
						} else {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			}
		},
		// 时间处理
		changeTime(date) {
			return myfun.detailTime(date);
		},
		//性别选择器
		bindPickerChange: function(e) {
			let oldIndex = this.index;
			this.index = e.target.value;
			if (this.index != oldIndex) {
				var sex = '';
				if (this.index == 0) {
					sex = 'male';
				} else {
					sex = 'female';
				}
				this.update(sex, 'sex', undefined);
			}
		},
		//日期选择器
		bindDateChange: function(e) {
			let oldDate = this.date;
			this.date = e.target.value;
			if (this.date != oldDate) {
				this.update(this.date, 'birth', undefined);
			}
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
			this.headimg = e.detail.tempFilePath;
			uni.uploadFile({
				url: this.serverUrl + '/files/upload',
				filePath: this.headimg,
				name: 'file',
				fileType: 'images',
				formData: {
					url: 'images',
					name: this.uid,
					token: this.token
				},
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					// 本地存储用户信息修改
					try {
						uni.setStorageSync('user', { id: this.uid, name: this.myname, imgurl: backstr, token: this.token });
					} catch (e) {
						console.log('数据库存储出错！');
					}
					// 修改头像保存到数据库
					this.update(backstr, 'imgurl', undefined);
				},
				complete() {},
				fail(e) {
					console.log('this is errormsg:' + e.message);
				}
			});
		},
		// 修改数据
		update(e, t, p) {
			uni.request({
				url: this.serverUrl + '/user/update',
				data: {
					id: this.uid,
					data: e,
					type: t,
					token: this.token,
					pwd: p
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					// console.log(data.data)
					if (status == 200) {
						// this.dataarr[type] = e;
						if (t == 'psw') {
							uni.removeStorage({
								key: 'user'
							});
							// 用户需要重新登录
							uni.navigateTo({
								url: '../signin/signin?cgpwd=' + this.myname
							});
						}
					} else if (status == 300) {
						uni.navigateTo({
							url: '../signin/signin?name=' + this.myname
						});
					} else if (status == 400) {
						uni.showToast({
							title: '原始密码输入错误！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 201) {
						uni.showToast({
							title: '已占用！',
							icon: 'none',
							duration: 2000
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
		// 退出登录
		quit() {
			uni.removeStorage({
				key: 'user'
			});
			// 用户需要重新登录
			uni.navigateTo({
				url: '../signin/signin'
			});
		},
		//取消函数
		cancel() {
			this.tempFilePath = '';
		},
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取页面高度
		getElementStyle() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.modify')
				.boundingClientRect(data => {
					this.modifyHeight = data.height;
				})
				.exec();
		},
		//修改项弹框
		modify(title, type, data, ispwd) {
			if (ispwd) {
				this.ispwd = 'block';
				this.pwd = '';
			} else {
				this.ispwd = 'none';
				this.pwd = undefined;
			}
			this.type = type;
			this.modifyTitle = title;
			this.oldData = data;
			this.data = data;
			this.isModify = !this.isModify;
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			if (this.isModify) {
				animation.bottom(0).step();
			} else {
				animation.bottom(-this.modifyHeight).step();
			}
			this.animationData = animation.export();
		},
		modifySubmit() {
			if (this.data.length > 0 && this.oldData != this.data) {
				if (this.type == 'markname') {
					this.updateFriendName();
					this.markname = this.data;
				} else if (this.type == 'email') {
					let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if (reg.test(this.data)) {
						this.update(this.data, this.type, this.pwd);
					} else {
						uni.showToast({
							title: '邮箱格式错误！',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					this.update(this.data, this.type, this.pwd);
					// this.dataarr[this.type] = this.data;
				}
				// this.getUser()
			}
			this.modify();
		},
		// 好友昵称修改
		updateFriendName() {
			if (this.data.length > 0 && this.data != this.oldData) {
				uni.request({
					url: this.serverUrl + '/user/markname',
					data: {
						token: this.token,
						uid: this.uid,
						fid: this.id,
						name: this.data
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						if (status == 200) {
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
			}
		},
		// 删除好友
		deleteFriend(){
			uni.showModal({
				title:'提示',
				content:'确定删除该好友吗？',
				success: (res) => {
					if(res.confirm){
						uni.request({
							url:this.serverUrl + '/friend/deletefriend',
							data:{
								uid:this.uid,
								fid:this.id,
								token:this.token
							},
							method:'POST',
							success: (data) => {
								let status = data.data.result;
								if(status == 200){
									uni.navigateTo({
										url:'../index/index'
									})
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
					}else if(res.cancel){
						
					}
				}
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
.modify {
	position: fixed;
	z-index: 1002;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: white;
	.modify-header {
		width: 100%;
		height: 88rpx;
		padding-top: val(--status-bar-height);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1rpx solid $uni-border-color;
		.close {
			padding-left: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
		.title {
			flex: auto;
			text-align: center;
			font-size: 40rpx;
			color: $uni-text-color;
			line-height: 88rpx;
		}
		.define {
			padding-right: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-color-success;
			line-height: 44rpx;
		}
	}
	.modify-main {
		display: flex;
		padding: $uni-spacing-col-base;
		flex-direction: column;
		.modify-pwd {
			margin-bottom: $uni-spacing-col-base;
			padding: 0 20rpx;
			box-sizing: border-box;
			flex: auto;
			width: 100%;
			height: 88rpx;
			background: $uni-bg-color-grey;
			border-radius: 20rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 88rpx;
		}
		.modify-content {
			padding: 16rpx 20rpx;
			box-sizing: border-box;
			flex: auto;
			width: 100%;
			height: 386rpx;
			background: $uni-bg-color-grey;
			border-radius: 20rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
}
</style>
