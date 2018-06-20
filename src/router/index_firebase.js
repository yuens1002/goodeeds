import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'
import firebase from 'firebase'

const routerOptions = [
  { path: '*', component: 'NotFound' },
  { path: '/', name: 'landing', component: 'Landing' },
  { path: '/signin', name: 'signin', component: 'Signin' },
  { path: '/signup', name: 'signup', component: 'Signup' },
  { path: '/home', name: 'home', component: 'Home', meta: {requiresAuth: true} }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  }
})

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser
  if (requiresAuth && !isAuthenticated) {
    next('/signin'
      // query: { redirect: to.fullPath }
    )
  } else if (to.path === '/signin' && isAuthenticated) {
    next('/home')
  } else next()
})

export default router

// Vue.use(Router)
//
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
