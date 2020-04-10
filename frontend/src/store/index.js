import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    rooms: [],
    users: [],
    current_user_idx: 0,
    user_num: 0,
    scores:[]
  },
  mutations: {
    SOCKET_rooms (state, rooms) {
      state.rooms = rooms
    },
    SOCKET_users(state, users) {
      state.users = users
    },
    SOCKET_user_num(state, user_num) {
      state.user_num = user_num
    },
    SOCKET_turn_change(state, new_num) {
      state.current_user_idx = new_num
    },
    SOCKET_scores(state, scores) {
      state.scores = scores
    }
  }
})


export default store