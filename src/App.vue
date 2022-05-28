<template>
  <div id="app">
    <div id="left-header" v-if="isAuth" class="float-right">
      <span class="float-left pl-3 pt-1">Olá, {{this.$store.state.auth.user.firstName}} {{this.$store.state.auth.user.lastName}}</span>
      <span id="spLogout" class="float-right" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-box-arrow-right logoutIcon" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
          <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
        </svg>
      </span>
      <b-tooltip target="spLogout" title="Tooltip title" triggers="hover">
        Encerrar Sessão.
      </b-tooltip>
    </div>
    <div id="header" @click="goHome">
      <img id="letra" alt="Safi Letra" src="./assets/safiLetra.png">
      <router-link to="/"></router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import './assets/main.css'

export default {
  name: 'App',
  components: {
  },
  computed: {
    isAuth() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
  },
  methods: {
    goHome () {
      this.$router.push("/").catch(err => {
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) {
          console.log(err);
        }
      });
    },
    logout() {
      this.$store.dispatch('auth/logout').then(
        () => {
          this.$router.push('/');
        }
      );
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#header {
  width: 100%;
  display: block;
  min-height: 7.5rem;
  background-color: #F2F2F2;
  width: 7.5rem;
  border-radius: 10rem;
  border-start-end-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

#left-header {
  width: 100%;
  display: block;
  min-height: 1.75rem;
  background-color: #2c3e50;
  color: #F2F2F2;
  width: 20rem;
  border-radius: 1rem;
  margin-top: 2px;
  margin-right: 2px;
  max-width: 15rem;
}

#body {
  background-color: #93FF9D;
}

#letra {
  position: absolute;
  width: 7rem;
  top: 0;
  left: 0;
}

#loading {
    position: fixed;
    box-sizing: border-box;
    inset: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    color: rgb(232, 232, 232);
    font-family: Menlo, Consolas, monospace;
    font-size: large;
    padding: 2rem;
    line-height: 1.2;
    white-space: pre-wrap;
    overflow: auto;
}

.logoutIcon {
  padding-right: 5px;
}

.logoutIcon:hover {
  padding-right: 5px;
  color: #111111;
  cursor: pointer;
}

</style>
