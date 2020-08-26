<template>
	<view>
		<view class="upload" @tap="upload">上传图片</view>
		<image v-for="(item,index) in img" :key="index" :src="item"></image>
		<button @tap="searchUser">获取</button>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				id:'',
				img:[]
			};
		},
		methods:{
			upload(){
				//获取当前日期文件夹
				let url = myfun.fileName(new Date())
				uni.chooseImage({
					count:9,
					sizeType:['original','compressed'],
					sourceType:['album','camera'],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						for(let i = 0; i < tempFilePaths.length; i++){
							const uploadTask = uni.uploadFile({
								url:this.serverUrl + '/files/upload',
								filePath:tempFilePaths[i],
								name:'file',
								formData:{
									url:url,
									name:new Date().getTime()+this.id+i
								},
								success:(uploadFileRes) => {
									let path = this.serverUrl+uploadFileRes.data;
									this.img.push(path)
								}
							});
						}
					}
				})
			},
			searchUser(){
				uni.request({
					url:this.serverUrl + '',
					data:{
						// uid:
					},
					method:'POST',
					success: (data) => {
						let status = data.data.status;
						// 访问后端成功
						if(status == 200){
							// 
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
