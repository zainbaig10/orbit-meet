// // public/script.js
// import { io } from "socket.io-client";

// const socket = io("https://orbit-meet-4.onrender.com/");
// let localStream, peer;
// let roomId = "";

// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");

// window.joinRoom = async function () {
//   roomId = document.getElementById("roomInput").value;
//   if (!roomId) return alert("Enter room ID");

//   socket.emit("join", roomId);
//   await startLocalStream();
// };

// socket.on("user-joined", async (peerId) => {
//   console.log("User joined:", peerId);
//   createPeer(true, peerId);
// });

// socket.on("signal", async ({ from, signal }) => {
//   if (!peer) createPeer(false, from);
//   await peer.signal(signal);
// });

// function createPeer(initiator, peerId) {
//   const SimplePeer = window.SimplePeer;
//   peer = new SimplePeer({
//     initiator,
//     trickle: false,
//     stream: localStream,
//   });

//   peer.on("signal", (signal) => {
//     socket.emit("signal", {
//       to: peerId,
//       signal,
//     });
//   });

//   peer.on("stream", (remoteStream) => {
//     remoteVideo.srcObject = remoteStream;
//   });
// }

// async function startLocalStream() {
//   localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//   localVideo.srcObject = localStream;
// }

const socket = io("https://orbit-meet-4.onrender.com/");
let localStream, peer;
let roomId = "";

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const joinBtn = document.getElementById("joinBtn");

joinBtn.addEventListener("click", async () => {
  roomId = document.getElementById("roomInput").value;
  if (!roomId) return alert("Enter room ID");

  await startLocalStream(); // ✅ Ask for permission first
  socket.emit("join", roomId); // ✅ Join after permission
});

socket.on("user-joined", async (peerId) => {
  console.log("User joined:", peerId);
  createPeer(true, peerId);
});

socket.on("signal", async ({ from, signal }) => {
  if (!peer) createPeer(false, from);

  try {
    peer.signal(signal);
  } catch (error) {
    console.error("Error in peer.signal:", error);
  }
});

function createPeer(initiator, peerId) {
  peer = new SimplePeer({
    initiator,
    trickle: false,
    stream: localStream,
  });

  peer.on("signal", (signal) => {
    socket.emit("signal", {
      to: peerId,
      signal,
    });
  });

  peer.on("stream", (remoteStream) => {
    remoteVideo.srcObject = remoteStream;
  });

  peer.on("error", (err) => {
    console.error("Peer error:", err);
  });
}

async function startLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.srcObject = localStream;
  } catch (error) {
    console.error("Media access error:", error);
    alert("⚠️ Please allow camera and microphone access to use Orbit Meet.");
  }
}
