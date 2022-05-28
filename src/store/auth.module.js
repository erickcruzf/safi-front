import AuthService from '../services/auth.service';
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };
export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    register({ commit }, user) {
      return AuthService.register(user).then(
          response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
          },
          error => {
          commit('registerFailure');
          return Promise.reject(error);
          }
      );
    },
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    // eslint-disable-next-line
    forgot({ commit }, data) {
      return AuthService.forgot(data).then(
          response => {
          return Promise.resolve(response.data);
          },
          error => {
          return Promise.reject(error);
          }
      );
    },
    // eslint-disable-next-line
    recovery({ commit }, data) {
      return AuthService.login(data).then(
          response => {
          return Promise.resolve(response.data);
          },
          error => {
          return Promise.reject(error);
          }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    }
  }
};