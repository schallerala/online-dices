<template>
  <div id="rooms_list">

    <input type="button" value="Refresh" v-on:click="refresh_rooms">
    <ul id="rooms">
      <li class="room" 
          v-for="room in rooms_list" :key="room.name" v-on:click="join_room(room.name)"
      >
        <p>{{room.name}}</p> <span class="count">{{room.count}}</span>
      </li>
    </ul> 

    <h3>Créer une partie</h3>
    <input v-model="room_name" type="text" placeholder="Nom de la partie"/>
    <input type="button" value="Créer" v-on:click="join_room(room_name)">

  </div>
</template>

<script>

export default {
  name: 'RoomList',
  components: {
    
  },
  data: function(){
    return {
      room_name: ""
    }
  },

  methods: {
    join_room: function (room) {
      this.$socket.emit('join_room', room)
    },

    refresh_rooms: function() {
      this.$socket.emit('refresh_rooms')
    }
  },
  computed: {
    rooms_list () {
      console.log("rooms", this.$store.state.rooms)
      return this.$store.state.rooms
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
