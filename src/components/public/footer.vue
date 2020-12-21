<template>
	<div class="foot_nav">
		<router-link to="/">
		<dl>
			<dt v-if="$route.name=='home'"><img src="../../assets/home-1.png"/></dt>
			<dt v-else><img src="../../assets/home-0.png"/></dt>
			<dd :class="$route.name=='home'?'active':''">首页</dd>
		</dl>
		</router-link>
		<router-link to="/discover">
		<dl>
			<dt v-if="$route.name=='discover'"><img src="../../assets/discover-1.png"/></dt>
			<dt v-else><img src="../../assets/discover-0.png"/></dt>
			<dd :class="$route.name=='discover'?'active':''">发现</dd>
		</dl>
		</router-link>
		<router-link to="/order">
		<dl>
			<dt v-if="$route.name=='order'"><img src="../../assets/order-1.png"/></dt>
			<dt v-else><img src="../../assets/order-0.png"/></dt>
			<dd :class="$route.name=='order'?'active':''">订单</dd>
		</dl>
		</router-link>
		<router-link to="/mine">
		<dl>
			<dt v-if="$route.name=='mine'"><img src="../../assets/mine-1.png"/></dt>
			<dt v-else><img src="../../assets/mine-0.png"/></dt>
			<dd :class="$route.name=='mine'?'active':''">我的</dd>
		</dl>
		</router-link>
	</div>
</template>
<script type="text/javascript">
	export default {
		name:"foot_nav",
		mounted(){
			console.log(this.$route)
		}
	}
</script>
<style type="text/css">
	.foot_nav {
		height: 1rem;
		display: flex;
		font-size: 12px;
		justify-content: space-around;
		align-items: center;
		text-align: center;
		position: fixed;
		bottom: 0;
		width: 100%;
		box-shadow: 0px -1px 1px #ccc;
		
	}
	.foot_nav a{
		color: #CCCCCC;
	}
	.foot_nav dl img {
		width: 0.4rem;
		height: 0.4rem;
	}
	.foot_nav .active{
		color: #0085FF;
	}
</style>