const io = require("socket.io")(3000);
var ss = require("socket.io-stream");
var {Server} = require('yamux-js');

io.on("connection", (socket) => {
    console.log("New Connection!")
    ss(socket).once("INIT", function (socketStream, data) {
        // socketStream.on("data", data => {
        //     console.log(data);
        // })

        var server = new Server((stream) => {
            console.log("New multiplex connection")
            stream.on('end', () => {
                console.log('client disconnected');
            });
            stream.on('data', (data) => {
                console.log('recv:', data.toString());
                stream.write('Sending back data');
            });
            stream.on('error', (err) => {
                console.log('An error occured:', err);
            });
        });
        server.on('error', (err) => {
            console.log('An error occured:', err);
        });
        
        server.pipe(socketStream).pipe(server);
    });
});
