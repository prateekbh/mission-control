// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
'use strict';
const { ipcRenderer } = require('electron');
const { networkInterfaces } = require('os');
const getPort = require('get-port');
const nets = networkInterfaces();
const QRCode = require('qrcode')
const http = require("http");
const WebSocket = require("ws");

const results = {}; // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const port = await getPort();
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        //connection is up, let's add a simple simple event
        ws.on("message", (message) => {
            //log the received message and send it back to the client
            console.log("received: %s", message);
            ws.send(`Hello, you sent -> ${message}`);
        });

        //send immediately a feedback to the incoming connection
        ws.send("Hi there, I am a WebSocket server");
    });

    //start our server
    server.listen(port, () => {
    console.log(`Data stream server started on port ${port}`);
    });

    const [ip] = results.en0;
    console.log(`http://${ip}:${port}`);
    QRCode.toCanvas(document.getElementById('qrcode'),`http://${ip}:${port}`, { toSJISFunc: QRCode.toSJIS }, function (error) {
        if (error) console.error(error)
        console.log('success!')
    })
  })

  