<template>
	<div class="type">
	    <el-carousel height="3.54rem" :autoplay="false" :trigger="'swiper'">
	      <el-carousel-item v-for="item in pages" :key="item">
	        <dl v-for="value in typeList[item-1]">
	        	<dt><img :src="value.typeLogo"/></dt>
	        	<dd>{{value.typeName}}</dd>
	        </dl>
	      </el-carousel-item>
	    </el-carousel>
  </div>
</template>
<script type="text/javascript">
	export default {
		name:"type",
		data(){
			return {
				typeList:[],
				pages:1
			}
		},
		methods:{
			_getType(res){
				console.log(res);
				let arr = res.data.data;
				let time = new Date()
				let h = time.getHours();
				let m = time.getMinutes();
				h = h+m/60;
				
				let typeList = arr.filter((item,index)=>{
					let startArr = item.typeStart.split(":")
					let typeStart = startArr[0]*1+startArr[1]/60;
					let endArr = item.typeEnd.split(":")
					let typeEnd = endArr[0]*1+endArr[1]/60;
					if(h>=typeStart && h<=typeEnd){
						return true;
					}else{
						return false;
					}
				})
				
				//类别走马灯效果分页数量  
				this.pages = Math.ceil(typeList.length/10);
				for(var i = 0 ; i < this.pages ; i++){
					this.typeList.push(typeList.splice(0,10))
				}
			}
		},
		mounted(){
			this.$api.getType()
			.then(this._getType);
		}
	}
</script>
<style type="text/css">
	.type .el-carousel__item{
		display: flex;
		flex-wrap: wrap;
	}
	.type dl {
		width: 1.5rem;
		text-align: center;
		padding-top: 10px;
	}
	.type dl img{
		width: 0.9rem;
		height: 0.9rem;
	}
</style>