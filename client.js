const io = require("socket.io-client");
var ss = require("socket.io-stream");
var { Client } = require("yamux-js");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("connected");

    var socketStream = ss.createStream();
    ss(socket).emit("INIT", socketStream);

    // socketStream.on("data", (data) => console.log(data));

    var client = new Client();
    client.on("error", (err) => {
        console.log("An error occured:", err);
    });
    client.pipe(socketStream).pipe(client);

    var stream1 = client.open();
    stream1.on("end", () => {
        console.log("client disconnected");
    });
    stream1.on("data", (data) => {
        console.log("recv:", data.toString());
    });
    stream1.on("error", (err) => {
        console.log("An error occured:", err);
    });
    stream1.write("Sending data");

    var stream2 = client.open();
    stream2.on("end", () => {
        console.log("client disconnected");
    });
    stream2.on("data", (data) => {
        console.log("recv:", data.toString());
    });
    stream2.on("error", (err) => {
        console.log("An error occured:", err);
    });
    stream2.write("Sending data");
});
