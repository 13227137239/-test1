import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/users.vue'
Vue.use(VueRouter)
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },
  {
    path:"/users",
    component:Users
  }]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  //to是要访问的路径
  //form是从哪来
  //next是一个函数，表示放行
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router