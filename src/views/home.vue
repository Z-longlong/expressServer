<template>
	<div>
		<home-head></home-head>
		<home-type></home-type>
		<home-ad></home-ad>
		<home-foot></home-foot>
	</div>
</template>
<script type="text/javascript">
	import homeHead from "@/components/home/homeHead";
	import homeType from "@/components/home/type";
	import homeAd from "@/components/home/ad";
	import homeFoot from "@/components/public/footer";
	export default {
		name:"home",
		components:{
			homeHead,
			homeType,
			homeAd,
			homeFoot
		}
	}
</script>