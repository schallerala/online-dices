<template>
  <div id="game-board">


      <!-- Roll dice and select the goal of the round -->
      <!--<GameScorePicker v-if="user_num == first_player" />-->
      <GameScorePicker />

  </div>
</template>

<script>

import GameScorePicker from './GameScorePicker.vue'

export default {
  name: 'GameBoard',
  components: { GameScorePicker  },
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
