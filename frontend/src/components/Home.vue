<template>
  <div id="home">
    <input v-model="username" placeholder="Name">
    <input value="Jouer" type="button" v-on:click="send_username" />
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
    
  },
  data: function(){
    return {
      username: ""
    }
  },

  methods: {
    send_username: function () {
      this.$socket.emit('username', this.username)
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
  margin-top: 60px;
}
</style>
