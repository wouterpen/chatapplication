module.exports = (app,io,client) => {
	//connecting to socket
//on connection, run a function, in that function we are gonna do all our events
io.sockets.on('connection', (socket)=>{
	connections.push(socket);
	socket.on('send message', (data, callback)=>{
		var msg = data.trim()
		if (msg.substr(0,3) === '/w ') {
			msg = msg.substr(3)
			var index = msg.indexOf(' ')
			if (index !== -1){
				var name = msg.substring(0,index)
				var msg = msg.substring(index + 1)
				console.log(name)
				console.log(users)
				if (name in users){
					users[name].emit('whisper', {msg:msg, user: socket.username})
					console.log("whisper")
				}
				else{
					callback("error: enter a valid user")
				}
			}
			else{
				callback('error please enter a message')
			}
		}
		else{
			io.sockets.emit('new message', {msg:msg, user: socket.username})
		}
	})
	socket.on('send privatemessage', (data, callback)=>{
			var msg = data.message
			//temporary fix for sending empty strings with data
			if(msg!==''){
			users[data.name].emit('new privatemessage', {msg:data.message,name:data.name, user: socket.username})
			users[socket.username].emit('new privatemessage', {msg:data.message, name:data.name, user: socket.username})
		}
	})
	// new User
	socket.on('new user',(data, callback)=>{
		// checking if the username is there
		if(data in users){
			callback(false)
		}
		else {
		callback(true);
		// add the data aka the username to the array usernames
		io.sockets.sockets[socket.id].username = data
		socket.username = data
		users[socket.username] = socket
		// now we are gonna call a function that updates the usernames
		updateUsernames();
		}
	});
	// update usernames
	// here we wanna emit usernames en also passalong the usernames, so the last usernames is the array. we pass that so we can list it on the sidebar in the app
	function updateUsernames(){
		var userIds = Object.keys(io.sockets.sockets)
		var userArr = []
		for(let i = 0; i < userIds.length; i ++) {
			userArr.push({
				id: userIds[i],
				name: io.sockets.sockets[userIds[i]].username
			})
		}
		io.sockets.emit('usernames', {userArr});
	}
	// disconnect
	socket.on('disconnect', (data)=>{
		if (!socket.username){
			console.log("disconnect++++",data)
			return;
		}
		// we wanna take that user out of the username array
		delete users[socket.username]
		// after the splice the usernames need to be updated again so we call the update fucntion again
		updateUsernames();
		connections.splice(connections.indexOf(socket),1)
		console.log('disconnected: %s sockets connected', connections.length)
	})
	})
}