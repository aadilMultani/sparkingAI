const WebSocket = require('ws');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({
    // Use the GOOGLE_APPLICATION_CREDENTIALS environment variable to authenticate
    keyFile: '/home/loopconangular/Downloads/GOOGLE_APPLICATION_CREDENTIALS.json'
});

// Configure Transcription Request
const request = {
    config: {
        encoding: "MULAW",
        sampleRateHertz: 8000,
        languageCode: "en-US"
    },
    interimResults: true
};

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.recognizeStream = null;

        this.wss.on("connection", this.onConnection.bind(this));
    }

    onConnection(ws) {
        console.log("New Connection Initiated");
        ws.on("message", this.onMessage.bind(this));
    }

    onMessage(message) {
        const msg = JSON.parse(message);
        switch (msg.event) {
            case "connected":
                console.log('A New Call has connected.');
                if (!this.recognizeStream) {
                    this.recognizeStream = client.streamingRecognize(request)
                        .on("error", (err) => {
                            console.error('Error occurred:', err);
                            this.recognizeStream = null;
                        })
                        .on("data", data => {
                            this.wss.clients.forEach(client => {
                                if (client.readyState === WebSocket.OPEN) {
                                    try {
                                        client.send(
                                            JSON.stringify({
                                                event: "interim-transcription",
                                                text: data.results[0].alternatives[0].transcript
                                            })
                                        );
                                    } catch (err) {
                                        console.error('Error sending message to client:', err);
                                    }
                                }
                            });
                        });
                }
                break;
            case "start":
                console.log(`Starting Media Stream ${msg.streamSid}`);
                break;
            case "media":
                // Write Media Packets to the recognize stream
                if (this.recognizeStream && !this.recognizeStream.destroyed) {
                    this.recognizeStream.write(msg.media.payload);
                } else {
                    // Try to recreate the recognizeStream
                    this.recognizeStream = client.streamingRecognize(request)
                        .on("error", (err) => {
                            console.error('Error occurred:', err);
                            this.recognizeStream = null;
                        })
                        .on("data", data => {
                            this.wss.clients.forEach(client => {
                                if (client.readyState === WebSocket.OPEN) {
                                    try {
                                        client.send(
                                            JSON.stringify({
                                                event: "interim-transcription",
                                                text: data.results[0].alternatives[0].transcript
                                            })
                                        );
                                    } catch (err) {
                                        console.error('Error sending message to client:', err);
                                    }
                                }
                            });
                        });
                    this.recognizeStream.write(msg.media.payload);
                }
                break;
            case "stop":
                console.log(`Call Has Ended`);
                if (this.recognizeStream) {
                    this.recognizeStream.destroy();
                    this.recognizeStream = null;
                }
                break;
        }
    }
}

module.exports = WebSocketServer;