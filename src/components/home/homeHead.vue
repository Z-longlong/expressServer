<template>
	<div class="homeHead">
		<h2>北京市昌平区吉利大学</h2>
		<div>
			<router-link to="/">
				<p><span class="el-icon-search"></span>搜索饿了么商家、商品名称</p>
			</router-link>
		</div>
	</div>
</template>
<style type="text/css">
	.homeHead{
		height: 1.91rem;
		width: 100%;
		background-image: linear-gradient(90deg,#0af,#0085ff);
	}
	.homeHead h2{
		padding: 10px 14px 0px 14px;
		color: white;
		font-weight: 700;
		font-size:16px;
		line-height: 0.69rem;
	}
	.homeHead div{
		padding: 7.5px 14px;
		height: 0.72rem;
	}
	.homeHead p {
		height: 0.72rem;
		background: white;
		text-align: center;
		color: #ccc;
		font-size: 16px;
		line-height: 0.72rem;
	}
</style>