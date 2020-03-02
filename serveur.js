var http = require('http');
var fs = require('fs');
var count = 0;
// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
	console.log("someone arrived");

	socket.on('firstLoad', function(){
		var content = fs.readFileSync('data.json', 'utf8');
		var data = JSON.parse(content);
		var str ="";
		for (i in data.taches){	
			str += '<div title=' + i +'>' + data.taches[i].user + ' : ' + data.taches[i].descr + "<button type='button' class='close aSpan' aria-label='Close'><span aria-hidden='true'> &times;</span></button></div><br>";
		}

		socket.broadcast.emit('update',str);
		socket.emit('update',str);
	});

	socket.on('newTask', function(name, task){
		var content = fs.readFileSync('data.json', 'utf8');
		var data = JSON.parse(content);
		data.taches.push({user:name, descr:task});
		var susu = JSON.stringify(data);
		fs.writeFile('data.json', susu, function(err){
			if(err) throw err;
			console.log('file saved !')
		});	

		var str2 ="";
		for (i in data.taches){	
			str2 += '<div title=' + i +'>' + data.taches[i].user + ' : ' + data.taches[i].descr + "<button type='button' class='close aSpan' aria-label='Close'><span aria-hidden='true'> &times;</span></button></div><br>";
		}

		socket.broadcast.emit('update',str2);
		socket.emit('update',str2);
	});

	socket.on('newVisitor', function(){
		count++;
		socket.broadcast.emit('newCount',count);
		socket.emit('newCount',count);
	});

	socket.on('disconnect', function(){
		console.log("someone left !");
		count--;
		socket.broadcast.emit('newCount',count);
		socket.emit('newCount',count);
	});

	socket.on('suppression', function(number){
		var content = fs.readFileSync('data.json', 'utf8');
		var data = JSON.parse(content);
		data.taches.splice(number,1);

		var susu = JSON.stringify(data);
		fs.writeFile('data.json', susu, function(err){
			if(err) throw err;
			console.log('file saved !')

		var str3 ="";
		for (i in data.taches){	
			str3 += '<div title=' + i +'>' + data.taches[i].user + ' : ' + data.taches[i].descr + "<button type='button' class='close aSpan' aria-label='Close'><span aria-hidden='true'> &times;</span></button></div><br>";
		}

		socket.broadcast.emit('update',str3);
		socket.emit('update',str3);
		});	
	});

});

server.listen(8080, function(){
	console.log("listening on port 8080");
})

