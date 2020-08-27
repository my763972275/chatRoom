<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="records">
					<image :src="toc"></image>
				</view>
				<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}" @focus="focus" @input="inputs" v-model="msg"/>
				<view class="record btn" :class="{displaynone:!isrecord}" @touchmove="touchmove" @touchstart="touchstart" @touchend="touchend">按住说话</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/faces.png"></image>
				</view>
				<view class="bt-img" @tap="moreFun">
					<image src="../../static/images/menu.png"></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoji}">
				<view class="emoji-send">
					<view class="emoji-send-det" @tap="emojiBack">
						<image src="../../static/images/del.png" mode=""></image>
					</view>
					<view class="emoji-send-bt" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			<view class="more" :class="{displaynone:ismore}">
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/images/photo.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<image src="../../static/images/camera.png"></image>
					<view class="more-list-title">拍照</view>
				</view>
				<view class="more-list"  @tap="chooseLocation">
					<image src="../../static/images/location.png"></image>
					<view class="more-list-title">定位</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/video.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/file.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>
		</view>
		<view class="voice-bg" :class="{displaynone:voiceBg}">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:vlength/0.6+'%'}">{{vlength}}″</view>
			</view>
			<view class="voice-del">上滑取消录音</view>
		</view>
	</view>
</template>

<script>
	import emoji from '../emoji/emoji.vue';
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				isrecord:false,
				isemoji:true,
				ismore:true,
				voiceBg:true,
				msg:'',
				timer:'',
				vlength:0,
				pageY:0,
				toc:'../../static/images/voice.png'
			};
		},
		components:{
			emoji
		},
		methods:{
			//获取表情
			emotion(e){
				this.msg = this.msg + e
			},
			//获取模块高度
			getElementHeight(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data=>{
					this.$emit('heights',data.height)
				}).exec();
			},
			//切换音频
			records(){
				this.isemoji = true;
				this.ismore = true;
				setTimeout(()=>{
					this.getElementHeight();
				},10)
				if(this.isrecord){
					this.isrecord = false;
					this.toc = '../../static/images/voice.png'
				}else{
					this.isrecord = true;
					this.toc = '../../static/images/keybord.png'
				}
			},
			emoji(){
				this.isemoji = !this.isemoji;
				this.ismore = true;
				this.isrecord = false;
				this.toc = '../../static/images/voice.png'
				setTimeout(()=>{
					this.getElementHeight();
				},10)
				
			},
			//文字发送
			inputs(e){
				var chatmsg = e.detail.value;
				var pos = chatmsg.indexOf('\n');
				if(pos!=-1 && chatmsg.length >1){
					this.send(this.msg,0)
				}
			},
			//图片发送
			sendImg(e){
				let count = 9;
				if(e == 'album'){
					count = 9;
				}else{
					count = 1
				}
				uni.chooseImage({
					count:count,
					sizeType:['original','compressed'],
					sourceType:[e],
					success:(res) => {
						const filePaths = res.tempFilePaths;
						for( let i =0;i<filePaths.length;i++){
							this.send(filePaths[i],1);
						}
					}
				})
			},
			//音频处理
			//开始录音
			touchstart(){
				this.pageY = e.changedTouches[0].pageY;
				this.voiceBg = false;
				let i = 1;
				this.timer = setInterval(()=>{
					this.vlength = i;
					i++;
					if(i>60){
						clearInterval(this.timer);
						this.touchend();
					}
				},1000)
				recorderManager.start();
			},
			touchmove(e){
				if((this.pageY - e,changedTouches[0].pageY)>100){
					this.voiceBg = true;
				}
			},
			//结束录音
			touchend(){
				clearInterval(this.timer);
				recorderManager.stop();
				recorderManager.onStop((res) => {
					let data = {
						voice:res.tempFilePath,
						time:this.vlength
					}
					if(!this.voiceBg){
						this.send(data,2);
					}
					this.vlength = 0;
					this.voiceBg = true;
				})
			},
			//选择定位
			chooseLocation(){
				uni.chooseLocation({
					success:res => {
						let data = {
							name:res.name,
							address:res.address,
							latitude:res.latitude,
							longitude:res.longitude
						}
						// json转成字符串
						let stringData = JSON.stringify(data)
						this.send(stringData,3)
					}
				})
			},
			//发送
			send(msg,type){
				let data = {
					message:msg,
					types:type
				}
				this.$emit('inputs',data);
				setTimeout(()=>{
					this.msg = '';
				},10)
			},
			//表情内发送
			emojiSend(e){
				if(this.msg.length >0){
					this.send(this.msg,0)
				}
			},
			//表情内退格
			emojiBack(){
				if(this.msg.length >0){
					this.msg = this.msg.substring(0,this.msg.length-2)
				}
			},
			focus(){
				this.isemoji = true;
				this.ismore = true;
				setTimeout(()=>{
					this.getElementHeight();
				},0)
			},
			moreFun(){
				this.ismore = !this.ismore;
				this.isemoji = true;
				this.isrecord = false;
				this.toc = '../../static/images/voice.png'
				setTimeout(()=>{
					this.getElementHeight()
				},10)
			}
		}
	}
</script>

<style lang="scss">
	.submit{
		background:rgba(244,244,244,0.96);
		border-top:1rpx solid $uni-border-color;
		width:100%;
		position:fixed;
		bottom:0;
		z-index:1002;
		padding-bottom:env(safe-area-inset-bottom);
		.displaynone{
			display:none;
		}
		.submit-chat{
			width:100%;
			display:flex;
			align-items: flex-end;
			box-sizing:border-box;
			padding:14rpx 14rpx;
			image{
				width:56rpx;
				height:56rpx;
				margin:0 10rpx;
				flex:auto;
			}
			.btn{
				flex:auto;
				background-color: white;
				border-radius: 10rpx;
				padding:20rpx;
				max-height:160rpx;
				margin: 0 10rpx;
			}
			.record{
				line-height:44rpx;
				text-align: center;
				font-size:$uni-font-size-lg;
				color:$uni-text-color-grey;
			}
			.chat-send{
				line-height:44rpx;
			}
		}
		.emoji{
			width:100%;
			height:460rpx;
			background: rgba(236,237,238,1);
			box-shadow:0rpx -1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		.emoji-send{
			width:300rpx;
			height:104rpx;
			padding-top:24rpx;
			background-color:rgba(236,237,238,0.9);
			position:fixed;
			bottom:env(safe-area-inset-bottom);
			right:0;
			display:flex;
			.emoji-send-bt{
				flex:1;
				margin:0 32rpx 0 20rpx;
				height:88rpx;
				background:rgba(255,228,49,1);
				font-size:32rpx;
				text-align: center;
				line-height:88rpx;
				border-radius:12rpx;
			}
			.emoji-send-det{
				flex:1;
				margin-left:24rpx;
				height:88rpx;
				background:white;
				font-size:32rpx;
				text-align: center;
				line-height:88rpx;
				border-radius:12rpx;
				image{
					width:50rpx;
					height:50rpx;
					padding-top:20rpx;
				}
			}
		 }
		}
		.more{
			width:100%;
			height:460rpx;
			background:rgba(236,237,238,1);
			box-shadow: 0rpx -1rpx 0rpx 0rpx rgba(0,0,0,0.1);
			bottom:env(safe-area-inset-bottom);
			box-sizing: border-box;
			padding:8rpx 20rpx;
			.more-list{
				width:25%;
				text-align: center;
				float:left;
				padding-top:32rpx;
				image{
					width:102rpx;
					height:102rpx;
					padding:20rpx;
					background:rgba(255,255,255,1);
					border-radius:24rpx;
				}
				.more-list-title{
					font-size:24rpx;
					color:rgba(39,40,50,0.5);
					line-height:34rpx;
				}
			}
		}
		
	}
	
</style>
