<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backTo">
				<image src="../../static/images/back.png" mode=""></image>
			</view>
			<view class="top-bar-center">
				<view class="title">{{fname}}</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<!-- v-if="type == 1" -->
				<view class="group-img" >
					<image :src="fimgurl" mode=""></image>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="chat" :scroll-with-animation="animate" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="loading" :class="{displaynone:isloading}">
					<image src="../../static/images/loading.png" class="loading-img" :animation="animationData"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.time != ''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.fromId != uid">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types == 0">
							<!-- 文字 -->
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-else-if="item.types == 1">
							<!-- 图片 -->
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<view class="message" v-else-if="item.types == 3">
							<!-- 定位 -->
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<map :latitude="item.message.latitude" :longitude="item.message.longitude" class="map" :markers="covers(item.message)"></map>
							</view>
						</view>
						<view class="message" v-else>
							<!-- 音频 -->
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
							<image class="voice-img" src="../../static/images/yy.png"></image>
							{{item.message.time}}″</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-else>
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-else-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<view class="message" v-else-if="item.types == 3">
							<!-- 定位 -->
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<map :latitude="item.message.latitude" :longitude="item.message.longitude" class="map" :markers="covers(item.message)"></map>
							</view>
						</view>
						<view class="message" v-else>
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
							   {{item.message.time}}″
							   <image class="voice-img" src="../../static/images/yy.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit  @inputs = 'inputs' @heights = "heights"></submit>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js';
	import submit from '../../components/submit/submit.vue';
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		components:{
			submit
		},
		data() {
			return {
				msgs:[],
				imgMsg:[],
				scrollToView:'',
				inputh:'72',
				oldTime:0,
				animationData:{},
				nowpage:0,
				pagesize:10,
				loading:'',
				isloading:true,
				animate:false,
				beginloading:true,
				uid:'',
				type:'',  //0为好友  1为群
				fid:'',
				uimgurl:'',
				fimgurl:'',
				fname:'',
				uname:''
			};
		},
		onLoad(e) {
			this.fid = e.id;
			this.fname = e.name;
			this.type = e.type;
			this.fimgurl = e.imgurl
			this.getStorages();
			this.getChatMsg(this.nowpage);
			this.receiveSocketMsg();
		},
		methods:{
			// 获取缓存数据
			getStorages(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						this.uid = value.id;
						this.uimgurl = this.serverUrl + value.imgurl;
						this.token =value.token;
						this.uname = value.name
					}else{
						uni.navigateTo({
							url:'../signin/signin'
						})
					}
				}catch(e){
					
				}
			},
			// 返回上一页
			backTo(){
				uni.navigateBack({
				    delta: 1
				});
			},
			//滚动到底部
			goBottom(){
				this.animate = true;
				this.scrollToView = '';
				this.$nextTick(function(){
					let len = this.msgs.length -1;
					this.scrollToView = 'msg'+this.msgs[len].id;
				})
			},
			//处理时间
			changeTime(date){
				return myfun.dateTime(date)
			},
			//滚动顶部加载下一页
			nextPage(){
				if(this.nowpage>0 && this.beginloading){
					this.isloading = false;
					this.beginloading = false;
					var animation = uni.createAnimation({
						duration:1000,
						timingFunction:'ease'
					})
					this.animation = animation
					let i = 1
					this.loading = setInterval(function(){
						animation.rotate(i*30).step()
						this.animationData = animation.export()
						i++;
						if(i>40){
							this.getChatMsg(this.nowpage)
						}
					}.bind(this),200)
				}
			},
			// 获取聊天消息
			getChatMsg(page){
				uni.request({
					url:this.serverUrl + '/chat/msg',
					data:{
						uid:this.uid,
						fid:this.fid,
						nowPage:this.nowpage,
						pageSize:this.pagesize,
						token:this.token
					},
					method:'POST',
					success: (data) => {
						let status = data.data.status
						if(status == 200){
							let msg = data.data.result
							// 将获得数据倒序
							msg.reverse();
							if(msg.length > 0){
								let oldtime = msg[0].time;
								let imgarr =[]
								for(var i = 1; i < msg.length; i++){
									msg[i].imgurl = this.serverUrl + msg[i].imgurl;
									//时间间隔
									if(i < msg.length-1){
										let t = myfun.spaceTime(oldtime,msg[i].time)
										if(t){
											oldtime = t;
										}
										msg[i].time = t;
									}
									// 匹配最大时间
									if(this.nowpage == 0){
										if(msg[i].time > this.oldTime){
											this.oldTime = msg[i].time;
										}
									}
								    //补充图片地址
								    if(msg[i].types == 1){
									    msg[i].message = this.serverUrl + msg[i].message
										imgarr.push(msg[i].message)
								    }
									// json字符串还原
									if(msg[i].types == 3){
										msg[i].message = JSON.parse(msg[i].message)
									}
									// this.msgs.unshift(msg[i])
								}
								this.msgs = msg.concat(this.msgs)
								this.imgMsg = imgarr.concat(this.imgMsg);
							}
							if(msg.length == 10){
								this.nowpage++;
							}else{
								// 数据获取完毕
								this.nowpage = -1;
							}
							//自动定位到底部
							this.$nextTick(function(){
								this.animate = false
								this.scrollToView = 'msg'+this.msgs[msg.length-1].id
							})
							clearInterval(this.loading)
							this.isloading = true;
							this.beginloading = true;
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}else if(status == 300){
							uni.navigateTo({
								url:'../signin/signin?name='+this.uname
							})
						}
					}
				})
				// 
			},
			//音频播放
			playVoice(e){
				innerAudioContext.src = e;
				innerAudioContext.play();
			},
			//地图定位
			covers(e){
				let map = [
					{
						latitude:e.latitude,
						longitude:e.longitude,
						iconPath:'../../static/images/map.png'
					}
				]
				return (map);
			},
			//导航
			openLocation(e){
				uni.openLocation({
					latitude:e.latitude,
					longitude:e.longitude,
					name:e.name,
					address:e.address,
					success:res => {
								
					}
				})
			},
			//预览图片
			previewImg:function(e){
				let index = 0;
				for(let i = 0;i<this.imgMsg.length;i++){
					if(this.imgMsg[i] == e){
						index = i
					}
				}
				uni.previewImage({
					current:index,
					urls:this.imgMsg,
					longPressActions:{
						itemList:['发送给朋友','保存图片','收藏'],
						success:function(data){
							
						},
						fail:function(err){
							
						}
					}
				})
			},
			inputs(e){
				this.receiveMsg(e,this.uid,this.uimgurl,0)
			},
			// 接受消息
			receiveMsg(e,id,img,tip){
				// socket提交
				if(e.types == 0 || e.types == 3){
					// 发送给后端
					this.sendSocket(e)
				}
				// 上传图片
				if(e.types == 1){
					//获取当前日期文件夹
					let url = myfun.fileName(new Date())
					this.imgMsg.push(e.message)
					// 提交图片
						const uploadTask = uni.uploadFile({
							url:this.serverUrl + '/files/upload',
							filePath:e.message,
							name:'file',
							formData:{
								url:url,
								name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10)
							},
							success:(uploadFileRes) => {
								let data = {
									message:uploadFileRes,
									types:e.types
								}
								this.sendSocket(data)
							}
					    });
				}
				// 上传音频
				if(e.types == 2){
					//获取当前日期文件夹
					let url = myfun.fileName(new Date())
					// 提交音频
						const uploadTask = uni.uploadFile({
							url:this.serverUrl + '/files/upload',
							filePath:e.message.voice,
							name:'file',
							formData:{
								url:url,
								name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10)
							},
							success:(uploadFileRes) => {
								let data = {
									message:uploadFileRes,
									types:e.types
								}
								this.sendSocket(data)
							}
					    });
				}
				// tip=0 表示自己发的 tip=1
				this.animate = true;
				let len = this.msgs.length;
				let nowTime = new Date();
				//时间间隔
				let t = myfun.spaceTime(this.oldTime,nowTime)
				if(t){
					this.oldTime = t;
				}
				nowTime = t;
				if(e.types == 3){
					e.message = JSON.parse(e.message)
				}
				let data = {
					fromId:id,   //发送者ID
					imgurl:img,
					message:e.message,
					types:e.types,
					time:nowTime,
					id:len
				}
				this.msgs.push(data)
				this.$nextTick(function(){
					this.scrollToView = 'msg' + len;
				})
				
				
			},
			heights(e){
				this.inputh = e;
				this.goBottom();
			},
			//聊天数据发送后端
			sendSocket(e){
				if(this.type == 0){
					//一对一聊天
					this.socket.emit('msg',e,this.uid,this.fid)
				}else{
					//群发
					this.socket.emit('groupmsg',e,this.uid,this.fid)
				}
			},
			// socket聊天数据接收
			receiveSocketMsg(){
				this.socket.on('msg',(msg,fromid,tip) => {
					// console.log(msg)
					if(fromid == this.fid && tip == 0){
						this.animate = true;
						let len = this.msgs.length;
						let nowTime = new Date();
						// 时间间隔
						let t = myfun.spaceTime(this.oldTime,nowTime);
						if(t){
							this.oldTime = t;
						}
						if(msg.types == 1 || msg.types == 2){
							msg.message = this.serverUrl + msg.message
						}
						nowTime = t;
						let data = {
							fromId:fromid,
							imgurl:this.fimgurl,
							message:msg.message,
							types:msg.types,
							time:nowTime,
							id:len
						}
						this.msgs.push(data)
						if(msg.types == 1){
							this.imgMsg.push(msg.message);
						}
						this.$nextTick(function(){
							this.scrollToView = 'msg' + len;
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
   @import '../../commons/css/mycss.scss';
   page{
	   height:100%;
   }
   .content{
	   height:100%;
	   background:rgba(244,244,244,1)
   }
   .top-bar{
	   background:rgba(244,244,244,0.96);
	   border-bottom:1rpx solid $uni-border-color;
	   .group-img{
		   position:absolute;
		   bottom:10rpx;
		   right:$uni-spacing-col-base;
		   width:68rpx;
		   height:68rpx;
		   image{
			   width:68rpx;
			   height:68rpx;
			   border-radius: 16rpx;
		   }
	   }
   }
   .displaynone{
	   display:none;
   }
   .chat{
	   height:100%;
	   .padbt{
		   height:var(--status-bar-height);
		   wwidth:100%;
	   }
	   .loading{
		   text-align: center;
		   .loading-img{
			   width:60rpx;
			   height:60rpx;
		   }
	   }
	   .chat-main{
		   padding-left:$uni-spacing-col-base;
		   padding-right: $uni-spacing-col-base;
		   padding-top:100rpx;
		   display:flex;
		   flex-direction: column;
	   }
	   .chat-ls{
		   .chat-time{
			   font-size:24rpx;
			   color:rgba(39,40,50,0.3);
			   line-height:34rpx;
			   padding:20rpx 0;
			   text-align: center;
		   }
		   .msg-m{
			   display:flex;
			   // flex-direction: row;
			   padding:20rpx 0;
			   .user-img{
				   flex:none;
				   width:80rpx;
				   height:80rpx;
				   border-radius: 20rpx;
			   }
			   .message{
				   flex:none;
				   max-width:500rpx;
			   }
			   .msg-text{
				  font-size:32rpx;
				   color:$uni-text-color;
				   line-height:44rpx;
				   padding:18rpx 24rpx;
			   }
			   .msg-img{
				   max-width:400rpx;
				   border-radius: 20rpx;
			   }
			   .msg-map{
				   background:white;
				   width:464rpx;
				   height:284rpx;
				   overflow: hidden;
				   .map-name{
					   font-size:$uni-font-size-lg;
					   color:$uni-text-color;
					   line-height:44rpx;
					   padding:18rpx 24rpx 0 24rpx;
					   display:-webkit-box;
					   -webkit-box-orient:vertical;
					   -webkit-line-clamp:1;
					   overflow:hidden;
				   }
				   .map-address{
					   font-size:$uni-font-size-sm;
					   color:$uni-text-color-disable;
					   padding:0rpx 24rpx;
					   display:-webkit-box;
					   -webkit-box-orient:vertical;
					   -webkit-line-clamp:1;
					   overflow:hidden;
				   }
				   .map{
					   padding-top:8rpx;
					   width:464rpx;
					   height:190rpx;
				   }
			   }
			   .voice{
				   min-width: 80rpx;
				   max-width:400rpx;
			   }
			   .voice-img{
				   width:40rpx;
				   height:36rpx;
			   }
		   }
		   .msg-left{
			   flex-direction: row;
			   .msg-text{
				   margin-left: 16rpx;
				   background-color: white;
				   border-radius: 0px 20rpx 20rpx 20rpx;
			   }
			   .msg-img{
				   margin-left:16rpx;
			   }
			   .voice{
			   		text-align: right;
			   }
			   .msg-map{
				   margin-left: 16rpx;
				   border-radius: 0px 20rpx 20rpx 20rpx;
			   }
			   .voice-img{
				   float:left;
				   transform: rotate(180deg);
			   	   width:40rpx;
			   	   height:36rpx;
				   padding-bottom:4rpx;
			   }
		   }
		   .msg-right{
		   	   flex-direction: row-reverse;
		   	   .msg-text{
		   		   margin-right: 16rpx;
		   		   background-color: #fff260;
		   		   border-radius: 20px 0rpx 20rpx 20rpx;
		   	   }
			   .msg-img{
				   margin-right:16rpx;
			   }
			   .msg-map{
				   margin-right: 16rpx;
				   border-radius: 20px 0rpx 20rpx 20rpx;
			   }
			   .voice{
				   text-align: left;
			   }
			   .voice-img{
				    float:right;
					padding-top:4rpx;
			   	    width:40rpx;
			   	    height:36rpx;
			   }
		   }
	   }
   }
</style>
