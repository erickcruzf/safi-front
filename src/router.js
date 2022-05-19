import Vue from 'vue'
import Router from 'vue-router'
import AreaLogada from './views/AreaLogada.vue'
import ValidateEmail from './views/ValidateEmail.vue'
import LoginView from './views/LoginView.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/home',
            name: 'home',
            component: AreaLogada
        },
        {
            path: '/validate/:verifyCode',
            name: 'validate',
            component: ValidateEmail
        }
    ],
    mode: 'history'
})

// eslint-disable-next-line
router.beforeEach((to, from, next) => {
    console.log("To: " + to.name);
    // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    // else next()
    next();
})

export default router