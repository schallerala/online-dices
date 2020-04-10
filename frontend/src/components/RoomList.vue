<template>
  <div id="rooms_list">

    <h1>Liste des parties</h1>

    <div class="game_creator_panel">
      <input v-model="room_name" type="text" placeholder="Nom de la partie"/>
      <input type="button" value="Créer" v-on:click="join_room(room_name)">
    </div>

    <div id="rooms">
      <div class="room" 
          v-for="room in available_rooms_list" :key="room.name" 
          v-on:click="join_room(room.name)"
      >
        <p>{{room.name}} ({{room.count}} pers.)</p>
      </div>
    </div> 
    <input type="button" value="Refresh" v-on:click="refresh_rooms">
    

    
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
    available_rooms_list() {
      return this.rooms_list
      //return this.rooms_list.filter(room => room.waiting_for_players)
    },
    rooms_list () {
      return this.$store.state.rooms
    }
  }
}
</script>

<style>
#rooms {
  display: flex;
  flex-direction: column;
}

.room {
  padding:5px 20px;
  background: #f3cd32;
  border: 1px solid black;
  display: flex;
  justify-content: center;
}
</style>
