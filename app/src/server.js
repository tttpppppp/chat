const express = require("express");
const path = require("path");
const Filter = require("bad-words");
const { createMessage } = require("./Utils/generateMessage");
const socketio = require("socket.io"); 
const http = require("http");
const { userList, addUser, removeUser, findUser}  = require("./Utils/users");

const app = express();
const port = 4000;


const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));


const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("User connected");


  socket.on("join room client to server", ({ room, username }) => {
    if (!room || !username) {
      return socket.emit("error", "Room and username are required");
    }

    socket.join(room);


    socket.emit("send message server to client", createMessage(`Chào mừng bạn đã đến phòng ${room}` , "Admin"));

    socket.broadcast
      .to(room)
      .emit("send message server to client", createMessage(`Một client ${username} khác đã tham gia`) , "Admin");


    socket.on("send message form client to server", (message, callback) => {
      const filter = new Filter();
      if (filter.isProfane(message)) {
        return callback("Có từ khóa tục tiểu");
      }

      const id = socket.id;
      const user = findUser(id);

      io.to(room).emit("send message server to client", createMessage(message , user.username));

      callback();
    });


    socket.on("share location from client", ({ latitude, longitude }) => {
      const id = socket.id;
      const user = findUser(id);
      const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
      io.to(room).emit("send message server to client", createMessage(linkLocation , user.username));
    });

    const newUser = { id: socket.id, username, room };
    addUser(newUser);
    io.to(room).emit("server send list user to client", userList(room));

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit("server send list user to client", userList(room));
      console.log("User disconnected");
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Đang chạy server http://localhost:${port}`);
});
