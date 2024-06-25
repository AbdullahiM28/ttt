const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')


const path = require('path');
const PORT = 3000;

app.set('view engine', 'ejs')

app.use(express.json());


// static files from respective directories
app.use(express.static(path.join(__dirname, 'landing')));

app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, 'landing/home.html');
  res.setHeader('Content-Type', 'text/html');
  res.status(200).sendFile(filePath);

});

// local play
app.use(express.static(path.join(__dirname, 'singles')));

app.get('/local', (req, res) => {
  const filePath2 = path.resolve(__dirname, 'singles/index.html');
  res.setHeader('Content-Type', 'text/html');
  res.status(301).sendFile(filePath2);

});




///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const start_game = 0; // becomes 1 if its time to start the game
const players = 0;


// app.use(express.static(__dirname + "/multi/"));

app.get("/online", (req, res) => {
  res.redirect(`/${uuidV4()}`)
});

// the following io.on is WITHING the app.get

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:room', (req, res) => {
  res.render('m', { roomId: req.params.room })
})

io.on('connection', socket => {
  
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('make_play', (element_id, player) => {
      socket.broadcast.to(roomId).emit('make_play', element_id, player)
    })


  /*
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    */
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })

    socket.on('make_new', () => {
      socket.broadcast.to(roomId).emit('make_new')
    })

  })
})



function my_mssg() {
  console.log(`it's on http://localhost:${PORT}`)
}
server.listen(PORT, my_mssg());