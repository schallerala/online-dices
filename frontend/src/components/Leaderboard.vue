<template>
  <div id="leaderboard-panel">
    <h1>Leaderboard</h1>

    <div id="winners" class="user-list">
      <div 
        class="player winner" 
        v-for="user in users_list" :key=user.name
        v-bind:class="{ active: (user.name == current_user.name)}">

        <p>{{current_user.name}}</p>
      </div>
    </div>
    
    <div id="in_game_players" class="user-list">
      <div 
        class="player" 
        v-for="user in users_list" :key=user.name
        v-bind:class="{ active: (user.name == current_user.name)}">
        <p>{{current_user.name}}</p>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Leaderboard',
  components: {
    
  },
  data: function(){
    return {
      selected: [false, false, false]
    }
  },

  methods: {
    select_die: function(idx) {
      this.$set(this.selected, idx, !this.selected[idx]);
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
    }
  }
}
</script>

<style>
.user-list{
  display:flex;
  flex-direction: column;
  margin: 20px 0px;
  background: white;
  border-collapse: collapse;
}

.player {
  border-collapse: collapse;
  border: 1px solid #e2e2e2;
}

.winner {
  background: #bffdbf;
}

.active {
  font-weight: bold;
  background: #fcfcfc;
}

</style>
