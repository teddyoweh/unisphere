require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const http = require('http');
const ip = require('./ip');
const { modCourses, modMajors } = require('./db');
const WebSocket = require('ws');
 const socketIo = require('socket.io');
 
const Threads = require('./threads.model');
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {
        console.log('Database is connected');
        modCourses();
        modMajors();
    },
    (err) => {
        console.log('Can not connect to the database' + err);
    }
);
const db = mongoose.connection;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
  
    
    ws.on('message', (message) => {
      console.log(`Received message from client: ${message}`);
    });
  });
  
   
  db.once('open', () => {
    const changeStream = Threads.watch();
  
    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const newMessage = change.fullDocument;
        // Broadcast the new message to all connected WebSocket clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newMessage));
          }
        });
      }
    });
  });
  
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api",require('./routes'));

app.get('/', function (req, res) {
    res.send('hello');
});
 
 

function listRoutes(app) {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods),
        });
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            routes.push({
              path: route.path,
              methods: Object.keys(route.methods),
            });
          }
        });
      }
    });
    return routes;
  }
  
  console.log('All Routes:');
  listRoutes(app).forEach((route) => {
    console.log(`Path: ${route.path}, Methods: ${route.methods.join(', ')}`);
  });
const PORT = 9990;
app.listen(PORT, () => {
    server.listen(3001, () => {
        console.log('WebSocket server is listening on port 3001');
      });
      
    console.log(`Server running on ${ip}:${PORT}`);
});
 