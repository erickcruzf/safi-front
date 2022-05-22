import Vue from 'vue'
import Router from 'vue-router'
import AreaLogada from './views/AreaLogada.vue'
import ValidateEmail from './views/ValidateEmail.vue'
import LoginView from './views/LoginView.vue'
import CarteiraAberta from './views/CarteiraAberta.vue'
// eslint-disable-next-line
import globalstore from './store/';

const store = globalstore;

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
        },
        {
            path: '/wallet/:walletId',
            name: 'wallet',
            component: CarteiraAberta
        }
    ],
    mode: 'history'
})

// eslint-disable-next-line
router.beforeEach((to, from, next) => {
    console.log("To: " + to.name);
    if (to.name !== 'login' && to.name !== 'validate' && !store.state.auth.status.loggedIn) next({ name: 'login' })
    if (to.name === 'login' && store.state.auth.status.loggedIn) next({ name: 'home' })
    else next()
    next();
})

export default router