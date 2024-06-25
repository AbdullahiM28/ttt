// global variables

let is_stop = true; // true means the game is ended, false means game has
                    // not ended

let turn = 0; // even numbers mean its X's turn, odd numbers O turn

let ele = []; // this array holds the positions on the board


// SCRIPT HERE TO CONNECT TWO PLAYERS FOR TIC TAC TOE
// ADJUST THE JAVASCRIPT IN m.ejs if necessary to facilitate online play

const socket = io('/')

let peers = {}

const myPeer = new Peer(undefined, { // lets you use PeerJS
    host: '/',
    port: '3001'
  })

  // this generates a userID, then emits that you have joined a room
  myPeer.on('open', id => {
    peers.id = Object.keys(peers).length + 1;
    socket.emit('join-room', ROOM_ID, id) 
  })
  
  socket.on('user-connected', (userId) => {
    peers.userId = Object.keys(peers).length + 1;
  })

  /*
myPeer.on('open', id => {
    peers[id] = Object.keys(peers).length + 1;
    socket.emit('join-room', ROOM_ID, id) 
  })

  socket.on('user-connected', userId => {
    peers[userId] = Object.keys(peers).length + 1;
  })

  */

  socket.on('user-disconnected', (userId, my_peers) => {
    if (my_peers.userId){
        delete my_peers.userId;
        peers = my_peers;
    }
  })

  socket.on('make_play', (element_id, player) => {
    //console.log("I RECIEVED MAKE_PLAY (CLIENT)")
    let x = element_id.toString();
    document.getElementById(x).innerHTML = player;
    turn++;
    check_winner();
  })

  socket.on('make_new', () => {
    clear_board()
  })

// code that lets you play the game is below (with the exception of global variables)
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// this for loop add the board to the array, and also adds a button to 
// each position on the board
function game_begin() {
    is_stop = false; // tells us we can start the game
  for (let i = 1; i < 10; i++) {
      let x = i.toString();
      let eoi = document.getElementById(x);
      ele.push(eoi);
      eoi.addEventListener("click", function() {
        if (is_stop == false && eoi.innerHTML != "X" && eoi.innerHTML != "O") {
          if (turn % 2 == 0) {
              eoi.innerHTML = "X";
              turn++;
              //console.log("I SENT MAKE_PLAY (CLIENT)")
              socket./*broadcast.to(ROOM_ID).*/emit('make_play', i, "X");
              check_winner();
          } else {
              eoi.innerHTML = "O";
              turn++;
             // console.log("I SENT MAKE_PLAY (CLIENT)")
              socket./*broadcast.to(ROOM_ID).*/emit('make_play', i, "O");
              check_winner();
          }
        }
    });
  }
}

// this functions adds the new game button when the game ends
function add_ngame() {
    document.getElementById("cen").innerHTML = `<button id="start">NEW GAME</button>`;
    document.getElementById("start").addEventListener("click", new_game);
}
    
function clear_board() {
    for (let i = 1; i < 10; i++) {
        let x = i.toString();
        document.getElementById(x).innerHTML = "‎";
    }
    turn = 0;
    is_stop = false;
    // the following piece of code removes the NEW GAME button so 
    document.getElementById("cen").innerHTML = ''; 
}

// this the the functionality of the new game button (cleans the board, etc)
function new_game() {
    socket./*broadcast.to(ROOM_ID).*/emit('make_new');
    clear_board(); 
}

// this function checks if someone won the game (brute force check)
function check_winner() { 
  if (turn == 9) {
      add_ngame(); // adds the new game button if it ends
  }
  if (turn >= 4) {
      if (ele[0].innerHTML == "X" || ele[0].innerHTML == "O") {
          if (ele[0].innerHTML == ele[1].innerHTML && ele[0].innerHTML == ele[2].innerHTML) {
              is_stop = true;
          } else if (ele[0].innerHTML == ele[3].innerHTML && ele[0].innerHTML == ele[6].innerHTML) {
              is_stop = true; 
          } else if (ele[0].innerHTML == ele[4].innerHTML && ele[0].innerHTML == ele[8].innerHTML) {
              is_stop = true;
          }
      } 
      if (ele[1].innerHTML == "X" || ele[1].innerHTML == "O") {
          if (ele[1].innerHTML == ele[4].innerHTML && ele[1].innerHTML == ele[7].innerHTML) {
              is_stop = true;
          } 
      }
      if (ele[2].innerHTML == "X" || ele[2].innerHTML == "O") {
          if (ele[2].innerHTML == ele[5].innerHTML && ele[2].innerHTML == ele[8].innerHTML) {
              is_stop = true;
          } 
      }
      if (ele[3].innerHTML == "X" || ele[3].innerHTML == "O") {
          if (ele[3].innerHTML == ele[4].innerHTML && ele[3].innerHTML == ele[5].innerHTML) {
              is_stop = true;
          } 
      }
      if (ele[6].innerHTML == "X" || ele[6].innerHTML == "O") {
          if (ele[6].innerHTML == ele[7].innerHTML && ele[6].innerHTML == ele[8].innerHTML) {
              is_stop = true;
          } else if (ele[6].innerHTML == ele[4].innerHTML && ele[6].innerHTML == ele[2].innerHTML) {
              is_stop = true;
          }
      }
      if (is_stop) {
          add_ngame(); // adds the new game button when it ends
      }       
  }
}

game_begin();
