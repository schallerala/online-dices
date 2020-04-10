<template>
  <div id="leaderboard-panel">
    <h1>Leaderboard</h1>

    <ul id="winners">

    </ul>
    
    <ul id="in_game_players">
      <li v-for="user in users_list" :key=user.name>
        {{user.name}} 
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Leaderboard',
  components: {
    
  },
  data: function(){
    return {
      a_state_var: "a value",
    }
  },

  methods: {
    exemple_name: function () {
      // hello
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
