import Vue from 'vue'
import Router from 'vue-router'
//@  代表src的根目录
import home from '@/views/home.vue';
//将router挂载至vue 
Vue.use(Router);

export default new Router({
	routes: [
		{
			path:"/",
			name:"home",
			component:home
		}
	]
})
