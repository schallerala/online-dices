var socket = 0;


// send username to the server
function send_username() {
    $("#username-form").submit(function(e){
        e.preventDefault()
        let username = $("#username").val()
        socket = io('http://localhost:3000')
        socket.emit('username', username)
})}


function load_script() {
    send_username()
}