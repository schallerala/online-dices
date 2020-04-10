var app = require('./http-server.js')
var http = require('http').createServer(app)
var io = require('socket.io')(http)

var public_socket_infos = {}

// stores rooms state info
// - name, 
// - count, 
// - waiting_for_players
var rooms_state = {}


// convert json object to array 
function json_to_array(json) {
    var res = []
    var props = Object.keys(json);
    for(var i in props) {
        var name = props[i]
        var val = json[name]
        res.push({"name":name, "value": val})
    }
    return res
}

// list of all rooms 
function rooms_list(socket) {
    var res = []
    var rooms = json_to_array(rooms_state)
    for(var idx in rooms) {
      var room = rooms[idx].name
      var waiting_for_players = rooms_state[room].waiting_for_players
      res.push({"name": room, "count": 0, "waiting_for_players": waiting_for_players})
    }
    return res
}

function room_of(socket) {
  var curr_room = Object.keys(socket.rooms)[0];
  return curr_room
}

function socket_room_id(socket) {
  var room_name = room_of(socket)
  var clients = json_to_array(io.sockets.adapter.rooms[room_name].sockets)
  var id = 0;
  while(socket.id != clients[id].name) {id++}
  return id
}

function list_of_user_in_room(room_name) {
  var res = []
  var clients = json_to_array(io.sockets.adapter.rooms[room_name].sockets)
  for(var idx in clients) {
      var client = clients[idx]
      var socket_id = client.name
      var user = public_socket_infos[socket_id]
      res.push(user)   
  }
  return res
}

function roll_dices(socket, dices) {

  for(var i in dices) {
    die_idx = dices[i]
    public_socket_infos[socket.id].dices[die_idx] =  Math.floor((Math.random()*6+1))
  }
}


function get_possible_dices_scores(socket) {
  var dices = [...public_socket_infos[socket.id].dices]

  var values = []

  var val_dice_1 = []
  var val_dice_2 = []
  var val_dice_3 = []

  if(dices[0] == 1) val_dice_1 = [1,100]
  else if(dices[0] == 6) val_dice_1 = [6,60]
  else val_dice_1.push(dices[0])


  if(dices[1] == 1) val_dice_2 = [1,100]
  else if(dices[1] == 6) val_dice_2 = [6,60]
  else val_dice_2.push(dices[1])


  if(dices[2] == 1) val_dice_3 = [1,100]
  else if(dices[2] == 6) val_dice_3 = [6,60]
  else val_dice_3.push(dices[2])

  for (var i = 0; i < val_dice_1.length; i++) {
    for (var j = 0; j < val_dice_2.length; j++) {
      for (var k = 0; k < val_dice_3.length; k++) {
        values.push(val_dice_1[i] + val_dice_2[j] + val_dice_3[k])
      }
    }
  }

  return values
}

// socket connection
io.on('connection', function(socket){

  // user register
  socket.on('username', function(username){
    public_socket_infos[socket.id] = {}
    public_socket_infos[socket.id].name = username
    socket.emit('rooms', rooms_list(socket))
  })

  // refresh list of rooms
  socket.on('refresh_rooms', function(){
    socket.emit('rooms', rooms_list(socket))
  })
 
  // user create/join a room
  socket.on('join_room', function(room){
    socket.leave(room_of(socket));
    socket.join(room, function(){

      // add too rooms_state if new room
      if(!(room in rooms_state)) {
        rooms_state[room]={ 
          "current_user_idx": 0, 
          "waiting_for_players": true,
          "host": socket.id
        }
      }

      // game already started
      if (!rooms_state[room].waiting_for_players) {
        console.log("cannot join")
        socket.emit("error", "cannot join") // todo, handle in client
        return
      }

      // init player state
      public_socket_infos[socket.id].cards = 0
      public_socket_infos[socket.id].dices = [0,0,0]

      // broadcast new user to the room
      io.sockets.in(room).emit('users', list_of_user_in_room(room))

      // send user turn number
      sri = socket_room_id(socket)
      socket.emit('user_num', sri)

      // tell the user who's turn it is
      socket.emit('turn_change', rooms_state[room].current_user_idx )      

      // send game infos
      console.log("send game host")
      socket.emit('socket_id', socket.id)
      socket.emit('game_host', rooms_state[room].host)
      socket.emit('waiting_for_players', true)
    })
  })




  // start a game
  socket.on("start_game", function(){
      var room = room_of(socket)
      var room_state = rooms_state[room]

      // check if it is the host
      if(room_state.host == socket.id) {

        // start game for all players in the room 
        room_state.waiting_for_players = false
        io.sockets.in(room).emit('first_player', 0)
        io.sockets.in(room).emit('waiting_for_players', false)
      }
  })


  // roll the dices
  socket.on('roll_dices', function(dices){
    roll_dices(socket, dices)
    var room = room_of(socket)

    // TODO EMIT POSSIBLE SCORES
    var scores = get_possible_dices_scores(socket)
    io.sockets.in(room).emit('scores', scores)
    io.sockets.in(room).emit('users', list_of_user_in_room(room))
  })

  socket.on('end_turn',function(){

    // TODO check emitting socket == the current playing user
    // ... 

    var room = room_of(socket)
    var room_size = list_of_user_in_room(room).length
    rooms_state[room].current_user_idx = (rooms_state[room].current_user_idx + 1)%room_size
    io.sockets.in(room).emit('turn_change', rooms_state[room].current_user_idx )
  })


  socket.on('disconnect', function(){
    // do smthing
  })
})


http.listen(3000, function(){
  console.log('listening on *:3000')
})