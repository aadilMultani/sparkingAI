const express = require('express');
const WebSocketServer = require('./service/webSocket');
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const path = require("path");

const app = express();
const PORT = process.env.PORT;
const server = require('http').createServer(app);

// Create an instance of the WebSocketServer class
const wss = new WebSocketServer(server);
const errorHandler = require('./middleware/error');
const { connectDB } = require('./utils/DBconnection');

// Connect to database
const mongoURI = process.env.MONGO_URI;
connectDB(mongoURI);

// Get Request data in JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Route Import 
const user = require('./routes/user-router');
const client = require('./routes/client_routes');
const jobCart = require('./routes/jobCard_routes');
const role = require('./routes/role');

// Set proxy
app.use('/api/v1', user);
app.use('/api/v1', client);
app.use('/api/v1', jobCart);
app.use('/api/v1', role);
app.use(errorHandler);

// Handle HTTP Request
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));

app.post('/', async (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(
    `<Response>
      <Say voice="Polly.Kimberly" language="en-US">
        hii, welcome to AllsparkAI plumbing Service ,
        <break time="2s"/>
        What can i help you today!
      </Say>
    </Response>`
  )
})

// server Listen
server.listen(PORT, () => {
  console.log(`Server is Runnig on Port ${PORT}`);
})
