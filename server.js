var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var rooms = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));	


app.get('/',function(req,res){
	res.sendfile(__dirname+'/views/login.html');
});

app.get('/hello',function(req,res){
	res.sendfile(__dirname+'/views/login.html');
});

var httpServer =http.createServer(app).listen(8080, function(req,res){
	  console.log('Socket IO server has been started');
	});
	// upgrade http server to socket.io server
	var io = require('socket.io').listen(httpServer);

	io.on('connection', function(socket){
		socket.on('chat message', function(msg){
			io.emit('chat message',msg);
		});
	});

// 채팅방 생성 요청
app.get('/makingRoom:room',function(req,res){
	
	var isExistRoom = checkRoomStatus(req.params.room);
	
	if(!isExistRoom){
		rooms.push(req.params.room);
		res.json(rooms);
	}
	
});

// 채팅방 리스트 요청
app.get('/getRoomLists', function(req,res){
	console.log(rooms);
	res.json(rooms);
});

// 채팅방 참가 요청 , Socket Connection
app.get('/joinRoom:room' , function(req,res){
	
	var room = req.params.room;

	io.on('connecton', function(socket){
		socket.join(room);
	});	
	
	res.json(room);
});

// 채팅 전달 해당 채팅방에 들어온 사용자들에게 메시지를 전달
// TODO :: Room Connection & Message Sending
app.post('/doChat' , function(req,res){
	
	console.log(req);
	console.log(req.body[0]);
	console.log(req.body.room);
	console.log(req.body.chat);
	
	console.log("room : ");
	console.log("chat : ");
	
	var chattingRoomNameSpace = io.of(room);
	chattingRoomNameSpace.on('connection', function(socket){
		console.log('connection success');
	});
	
	chattingRoomNameSpace.emit('hi','everyone');
	
});

// 채팅방 존재 유무 확인 요청 (True Or False)
app.get('/checkRoomStatus:room', function(req,res){
	var room = req.params.room;
	var roomStatus = checkRoomStatus(room);
	res.json(roomStatus);
	
});

// 클라이언트가 넘겨준 방이 실제 존재하는 방인지 체크하여 존재 여부를 반환
function checkRoomStatus(clientRoom){
	
	var returnValue = false;
	
	rooms.forEach(function(room){
		
		if(room === clientRoom){
			returnValue = true;
		}
	});
	return returnValue;
}

