<template>
  <div id="app">
    <Home/>
    <RoomList />
    <Game />
  </div>
</template>

<script>
import Home from './components/Home.vue'
import RoomList from './components/RoomList.vue'
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Home, RoomList, Game
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
  margin-top: 60px;
}
</style>
