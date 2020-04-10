<template>
  <div id="game">
    <h1>Partie en cours</h1>

    <div id="board">

      <div v-if="waiting_for_players" id="waiting_screen">
        <h1>Waiting on host to start the game.</h1>
        <input v-if="game_host == socket_id" v-on:click="start_game" type="button" value="Start Game">
      </div>


      <div v-if="!waiting_for_players" id="live-roll">
        <h1>{{current_user.name}} is playing...</h1>
          <div id="dices">
            <div class="rolled_die" v-for="(die, idx) in current_user.dices" :key=idx 
                  v-on:click="select_die(idx)" >


                <div 
                  class="die" 
                  id="die_1"
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 1">
                  <div class="point" id="p_1_1"></div>
                </div>

                <div 
                  class="die" 
                  id="die_2" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 2">

                  <div class="point" id="p_2_1"></div>
                  <div class="point" id="p_2_2"></div> 
                </div>

                <div 
                  class="die" 
                  id="die_3" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 3">

                  <div class="point" id="p_3_1"></div>
                  <div class="point" id="p_3_2"></div>
                  <div class="point" id="p_3_3"></div> 
                </div>


                <div 
                  class="die" 
                  id="die_4"  
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 4">

                  <div class="point" id="p_4_1"></div>
                  <div class="point" id="p_4_2"></div>
                  <div class="point" id="p_4_3"></div>
                  <div class="point" id="p_4_4"></div> 
                </div>

                <div 
                  class="die" 
                  id="die_5" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 5">

                  <div class="point" id="p_5_1"></div>
                  <div class="point" id="p_5_2"></div>
                  <div class="point" id="p_5_3"></div>
                  <div class="point" id="p_5_4"></div> 
                  <div class="point" id="p_5_5"></div> 
                </div>


                <div 
                  class="die" 
                  id="die_6" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 6">

                  <div class="point" id="p_6_1"></div>
                  <div class="point" id="p_6_2"></div>
                  <div class="point" id="p_6_3"></div>
                  <div class="point" id="p_6_4"></div> 
                  <div class="point" id="p_6_5"></div> 
                  <div class="point" id="p_6_6"></div>
                </div>
              </div>
        </div>

        {{possible_scores}}

        <div v-if="user_num == current_user_idx" id="dice_controls">
          <input type="button" value="Lancer les dés" v-on:click="roll_dices">
          <input type="button" value="Valider" v-on:click="end_turn">
        </div>
      </div>

      <div id="user_list">
          <div class="user" v-for="user in users_list" :key=user.name>
            <span>{{user.name}}</span>
            <div id="dices">

              <div class="rolled_die" v-for="(die, idx) in user.dices" :key=idx 
                  v-on:click="select_die(idx)" >


                <div 
                  class="die" 
                  id="die_1"
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 1">
                  <div class="point" id="p_1_1"></div>
                </div>

                <div 
                  class="die" 
                  id="die_2" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 2">

                  <div class="point" id="p_2_1"></div>
                  <div class="point" id="p_2_2"></div> 
                </div>

                <div 
                  class="die" 
                  id="die_3" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 3">

                  <div class="point" id="p_3_1"></div>
                  <div class="point" id="p_3_2"></div>
                  <div class="point" id="p_3_3"></div> 
                </div>


                <div 
                  class="die" 
                  id="die_4"  
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 4">

                  <div class="point" id="p_4_1"></div>
                  <div class="point" id="p_4_2"></div>
                  <div class="point" id="p_4_3"></div>
                  <div class="point" id="p_4_4"></div> 
                </div>

                <div 
                  class="die" 
                  id="die_5" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 5">

                  <div class="point" id="p_5_1"></div>
                  <div class="point" id="p_5_2"></div>
                  <div class="point" id="p_5_3"></div>
                  <div class="point" id="p_5_4"></div> 
                  <div class="point" id="p_5_5"></div> 
                </div>


                <div 
                  class="die" 
                  id="die_6" 
                  v-bind:class="{ selected: selected[idx]}" 
                  v-if="die == 6">

                  <div class="point" id="p_6_1"></div>
                  <div class="point" id="p_6_2"></div>
                  <div class="point" id="p_6_3"></div>
                  <div class="point" id="p_6_4"></div> 
                  <div class="point" id="p_6_5"></div> 
                  <div class="point" id="p_6_6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RoomList',
  components: {
    
  },
  data: function(){
    return {
      room_name: "",
      selected: [false, false, false]
    }
  },

  methods: {
    roll_dices: function () {
      var selected_dices = []
      for(var i in this.selected) {
        if(!this.selected[i]) selected_dices.push(i)
      }
      this.$socket.emit('roll_dices', selected_dices)
    },
    select_die: function(idx) {
      this.$set(this.selected, idx, !this.selected[idx]);
    },
    end_turn: function() {
      this.$socket.emit('end_turn')
    },
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
    }
  }
}
</script>

<style>
.die {
  width: 20px;
  height: 20px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 4px; 
  position: relative;
}

.point {
  height: 5px;
  width: 5px;
  border-radius:50%;
  background: black;
  position: absolute;
}

#p_1_1 {
  top:17px;  /* 20 - padd/2 */
  left:17px; /* 20 - padd/2 */
}

#p_2_1 {
  top:  7.5px;
  left: 7.5px;
}

#p_2_2 {
  bottom:  7.5px;
  right: 7.5px;
}

#p_3_1 {
  top:  7px;
  top: 7px;
}

#p_3_2 {
  top:17px;  /* 20 - padd/2 */
  left:17px;
}

#p_3_3 {
  bottom:  7px;
  right: 7px;
}

#p_4_1 {
  bottom:  7px;
  right: 7px;
}
#p_4_2 {
  bottom:  7px;
  left: 7px;
}
#p_4_3 {
  top:  7px;
  right: 7px;
}
#p_4_4 {
  top:  7px;
  left: 7px;
}


#p_5_1 {
  top:  17.5px;
  left: 17.5px;
}
#p_5_2 {
  bottom:  7px;
  left: 7px;
}
#p_5_3 {
  bottom:  7px;
  right: 7px;
}
#p_5_4 {
  top:  7px;
  right: 7px;
}
#p_5_5 {
  left:  7px;
  top: 7px;
}


#p_6_1 {
  top:  17.5px;
  left: 7px;
}
#p_6_2 {
  bottom:  7px;
  left: 7px;
}
#p_6_3 {
  bottom:  7px;
  right: 7px;
}
#p_6_4 {
  top:  7px;
  right: 7px;
}
#p_6_5 {
  left: 7px;
  top:  7px;
}
#p_6_6 {
  right: 7px;
  top:  17px;
}

#dices {
  display: flex;
}

.rolled_die {
  display:flex;
  flex-direction: row;
}

.selected {
  background: red;
}

#user_list {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

#live-roll {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#board {
  border: 5px solid #b5b5b5;
  border-radius: 15px;
  padding: 15px;
}

</style>
