<template>
  <div id="game">

    <div v-if="waiting_for_players" id="waiting_screen">
      <h1>Waiting on host to start the game.</h1>
      <input v-if="game_host == socket_id" v-on:click="start_game" type="button" value="Start Game">
    </div>


    <div v-if="!waiting_for_players" id="game-panel">

      <!-- Leader board -->
      <Leaderboard/>

      <GameBoard/>


    </div>
  </div>
</template>

<script>

import Leaderboard from './Leaderboard.vue'
import GameBoard from './GameBoard.vue'

export default {
  name: 'Game',
  components: {  Leaderboard, GameBoard  },
  data: function(){
    return {
    }
  },

  methods: {
    
    start_game: function() {
      this.$socket.emit('start_game')
    }
  },
  computed: {
    users_list () {
      return this.$store.state.users
    },
    current_user_idx() {
      return this.$store.state.current_user_idx
    },
    current_user() {
      return this.users_list[this.current_user_idx]
    },
    user_num() {
      return this.$store.state.user_num
    },
    possible_scores() {
      return this.$store.state.scores
    },
    waiting_for_players(){
      return this.$store.state.waiting_for_players
    },
    game_host() {
      return this.$store.state.game_host
    },
    socket_id() {
      return this.$store.state.socket_id
    }, 

    first_player() {
      return this.$store.state.first_player
    }
  }
}
</script>

<style>

#game-panel {
  border: 5px solid #b5b5b5;
  border-radius: 15px;
  padding: 15px;
  display: flex;
}

</style>
