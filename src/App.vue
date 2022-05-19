<template>
  <div id="app">
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
</style>
