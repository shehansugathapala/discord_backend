const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io'); // Import Socket.IO
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const { ChatMessage } = require('./models/ChatMessage');
const user = require('./models/user');
const multer = require('multer');
const router = require('./routes/authRoutes');
const path = require('path');




const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(express.json());
app.use(cors());

// Register the routes
app.use("/api/auth", authRoutes);



// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO instance
const io = socketIo(server);

// Multer configuration
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    }
  })
  const upload = multer({ storage: storage })

// Route to handle file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Event listener for receiving messages from the client
    socket.on("chat_message", async (msg) => {
        console.log("Received message from client:", msg);
        
        // Construct a response message
        const responseMsg = `Admin: Your message "${msg}" has been received. We will get back to you shortly!`;

        // Emit the response back to the client
        socket.emit("server_response", responseMsg);

      // Save the chat message to MongoDB
const chatMessage = new ChatMessage({ message: msg, username: ' username', receiver: 'receiver_username' });
await chatMessage.save();


        // Forward the message to all connected clients (admin chat screen)
        socket.broadcast.emit("chat_message", msg);
    });

    // Event listener for receiving admin messages from the client
    socket.on("admin_message", (msg) => {
        console.log("Received admin message:", msg);
        
        // Forward the admin message to all connected clients (including client chat screens)
        io.emit("admin_message", msg);
    });
});




// Start server after connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Database connection failed. Server not started.');
        console.error(err);
    });
