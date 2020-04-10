var app = require('./http-server.js')
var http = require('http').createServer(app)
var io = require('socket.io')(http)

var public_socket_infos = {}
var rooms_state = {}

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

function rooms_list(socket) {
    var res = []
    var rooms = socket.adapter.rooms
    var rooms_names = Object.keys(rooms);
    for(var idx in rooms_names) {
        var room = rooms_names[idx]
        res.push({"name": room, "count": rooms[room].length})
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


io.on('connection', function(socket){
  console.log('a user connected')

  // lobby stuff
  socket.on('username', function(username){
    public_socket_infos[socket.id] = {}
    public_socket_infos[socket.id].name = username
    socket.emit('rooms', rooms_list(socket))
  })

  socket.on('refresh_rooms', function(){
    socket.emit('rooms', rooms_list(socket))
  })
 
  socket.on('join_room', function(room){
    socket.leave(room_of(socket));
    socket.join(room, function(){

      // add too rooms_state if new room
      if(!(room in rooms_state)) {
        rooms_state[room]={ "current_user_idx": 0 }
      }

      public_socket_infos[socket.id].dices = [0,0,0]

      sri = socket_room_id(socket)
      socket.emit('user_num', sri)

      // broadcast new user to the room
      io.sockets.in(room).emit('users', list_of_user_in_room(room));
      io.sockets.in(room).emit('turn_change', rooms_state[room].current_user_idx )      
    })
  })



  // game stuff
  socket.on('roll_dices', function(dices){
    roll_dices(socket, dices)
    var room = room_of(socket)

    // TODO EMIT POSSIBLE SCORES
    var scores = get_possible_dices_scores(socket)
    io.sockets.in(room).emit('scores', scores)
    io.sockets.in(room).emit('users', list_of_user_in_room(room))
  })

  socket.on('end_turn',function(){
    // TODO if emitting socket is the current playing user
    // ... 
    console.log("change turn", rooms_state)

    var room = room_of(socket)
    var room_size = list_of_user_in_room(room).length
    rooms_state[room].current_user_idx = (rooms_state[room].current_user_idx + 1)%room_size
    io.sockets.in(room).emit('turn_change', rooms_state[room].current_user_idx )
  })


  socket.on('disconnect', function(){
    console.log('player disconnected')
  })
})


http.listen(3000, function(){
  console.log('listening on *:3000')
})