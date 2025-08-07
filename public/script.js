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

// const socket = io("https://orbit-meet-4.onrender.com/");
// let localStream, peer;
// let roomId = "";

// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
// const joinBtn = document.getElementById("joinBtn");

// joinBtn.addEventListener("click", async () => {
//   roomId = document.getElementById("roomInput").value;
//   if (!roomId) return alert("Enter room ID");

//   await startLocalStream(); // ✅ Ask for permission first
//   socket.emit("join", roomId); // ✅ Join after permission
// });

// socket.on("user-joined", async (peerId) => {
//   console.log("User joined:", peerId);
//   createPeer(true, peerId);
// });

// socket.on("signal", async ({ from, signal }) => {
//   if (!peer) createPeer(false, from);

//   try {
//     peer.signal(signal);
//   } catch (error) {
//     console.error("Error in peer.signal:", error);
//   }
// });

// function createPeer(initiator, peerId) {
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

//   peer.on("error", (err) => {
//     console.error("Peer error:", err);
//   });
// }

// async function startLocalStream() {
//   try {
//     localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localVideo.srcObject = localStream;
//   } catch (error) {
//     console.error("Media access error:", error);
//     alert("⚠️ Please allow camera and microphone access to use Orbit Meet.");
//   }
// }

// const socket = io("https://orbit-meet-4.onrender.com/");
// let localStream, screenStream;
// let peers = {}; // key: socketId, value: SimplePeer
// let roomId = "";

// const localVideo = document.getElementById("localVideo");
// const remoteVideos = document.getElementById("remoteVideos");

// const joinBtn = document.getElementById("joinBtn");
// const muteBtn = document.getElementById("muteBtn");
// const cameraBtn = document.getElementById("cameraBtn");
// const screenBtn = document.getElementById("screenBtn");
// const endCallBtn = document.getElementById("endCallBtn");

// let isMicMuted = false;
// let isCameraOff = false;
// let isScreenSharing = false;

// joinBtn.addEventListener("click", async () => {
//   roomId = document.getElementById("roomInput").value.trim();
//   if (!roomId) return alert("Enter room ID");

//   await startLocalStream();
//   socket.emit("join", roomId);
// });

// socket.on("all-users", (users) => {
//   users.forEach((userId) => {
//     createPeer(userId, true);
//   });
// });

// socket.on("user-joined", (userId) => {
//   createPeer(userId, false);
// });

// socket.on("signal", ({ from, signal }) => {
//   if (peers[from]) {
//     peers[from].signal(signal);
//   }
// });

// socket.on("user-disconnected", (userId) => {
//   if (peers[userId]) {
//     peers[userId].destroy();
//     delete peers[userId];
//     const vid = document.getElementById(userId);
//     if (vid) vid.remove();
//   }
// });

// function createPeer(remoteSocketId, initiator) {
//   const peer = new SimplePeer({
//     initiator,
//     trickle: false,
//     stream: localStream
//   });

//   peer.on("signal", (signal) => {
//     socket.emit("signal", { to: remoteSocketId, signal });
//   });

//   peer.on("stream", (stream) => {
//     const video = document.createElement("video");
//     video.id = remoteSocketId;
//     video.srcObject = stream;
//     video.autoplay = true;
//     video.playsInline = true;
//     video.width = 320;
//     video.height = 240;
//     remoteVideos.appendChild(video);
//   });

//   peer.on("close", () => {
//     const vid = document.getElementById(remoteSocketId);
//     if (vid) vid.remove();
//   });

//   peer.on("error", (err) => {
//     console.error("Peer error:", err);
//   });

//   peers[remoteSocketId] = peer;
// }

// async function startLocalStream() {
//   try {
//     localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localVideo.srcObject = localStream;
//   } catch (error) {
//     console.error("Media access error:", error);
//     alert("⚠️ Please allow camera and microphone access to use Orbit Meet.");
//   }
// }

// // 🔇 Toggle Mic
// muteBtn.addEventListener("click", () => {
//   if (!localStream) return;
//   isMicMuted = !isMicMuted;
//   localStream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
//   muteBtn.textContent = isMicMuted ? "Unmute Mic" : "Mute Mic";
// });

// // 📷 Toggle Camera
// cameraBtn.addEventListener("click", () => {
//   if (!localStream) return;
//   isCameraOff = !isCameraOff;
//   localStream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
//   cameraBtn.textContent = isCameraOff ? "Turn On Camera" : "Turn Off Camera";
// });

// // 🖥 Screen Share
// screenBtn.addEventListener("click", async () => {
//   if (!isScreenSharing) {
//     try {
//       screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       replaceVideoTrack(screenStream.getVideoTracks()[0]);
//       isScreenSharing = true;
//       screenBtn.textContent = "Stop Sharing";
//       screenStream.getVideoTracks()[0].onended = () => {
//         replaceVideoTrack(localStream.getVideoTracks()[0]);
//         isScreenSharing = false;
//         screenBtn.textContent = "Share Screen";
//       };
//     } catch (err) {
//       console.error("Screen share error:", err);
//     }
//   } else {
//     replaceVideoTrack(localStream.getVideoTracks()[0]);
//     isScreenSharing = false;
//     screenBtn.textContent = "Share Screen";
//   }
// });

// // 🔁 Replace outgoing video track (screen ↔ camera)
// function replaceVideoTrack(newTrack) {
//   Object.values(peers).forEach(peer => {
//     const sender = peer._pc.getSenders().find(s => s.track.kind === "video");
//     if (sender) sender.replaceTrack(newTrack);
//   });
//   localVideo.srcObject = isScreenSharing ? screenStream : localStream;
// }

// // 📞 End Call
// endCallBtn.addEventListener("click", () => {
//   Object.values(peers).forEach(peer => peer.destroy());
//   peers = {};
//   if (localStream) localStream.getTracks().forEach(track => track.stop());
//   if (screenStream) screenStream.getTracks().forEach(track => track.stop());
//   localVideo.srcObject = null;
//   remoteVideos.innerHTML = "";
//   socket.disconnect();
//   alert("Call ended.");
// });

const socket = io("https://orbit-meet-4.onrender.com/");
let localStream, screenStream;
let peers = {};
let roomId = "";

const localVideo = document.getElementById("localVideo");
const remoteVideos = document.getElementById("remoteVideos");

const joinBtn = document.getElementById("joinBtn");
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");
const screenBtn = document.getElementById("screenBtn");
const endCallBtn = document.getElementById("endCallBtn");

let isMicMuted = false;
let isCameraOff = false;
let isScreenSharing = false;

// ✅ STUN + TURN config (Option 1: Free public server)
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:relay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:relay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:relay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};

joinBtn.addEventListener("click", async () => {
  roomId = document.getElementById("roomInput").value.trim();
  if (!roomId) return alert("Enter room ID");

  await startLocalStream();
  socket.emit("join", roomId);
});

socket.on("all-users", (users) => {
  users.forEach((userId) => {
    createPeer(userId, true);
  });
});

socket.on("user-joined", (userId) => {
  createPeer(userId, false);
});

socket.on("signal", ({ from, signal }) => {
  if (peers[from]) {
    peers[from].signal(signal);
  }
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].destroy();
    delete peers[userId];
    const vid = document.getElementById(userId);
    if (vid) vid.remove();
  }
});

function createPeer(remoteSocketId, initiator) {
  const peer = new SimplePeer({
    initiator,
    trickle: false,
    stream: localStream,
    config: rtcConfig, // ✅ using STUN + TURN config
  });

  peer.on("signal", (signal) => {
    socket.emit("signal", { to: remoteSocketId, signal });
  });

  peer.on("stream", (stream) => {
    const video = document.createElement("video");
    video.id = remoteSocketId;
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.width = 320;
    video.height = 240;
    remoteVideos.appendChild(video);
  });

  peer.on("close", () => {
    const vid = document.getElementById(remoteSocketId);
    if (vid) vid.remove();
  });

  peer.on("error", (err) => {
    console.error("Peer error:", err);
  });

  peers[remoteSocketId] = peer;
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

muteBtn.addEventListener("click", () => {
  if (!localStream) return;
  isMicMuted = !isMicMuted;
  localStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !isMicMuted));
  muteBtn.textContent = isMicMuted ? "Unmute Mic" : "Mute Mic";
});

cameraBtn.addEventListener("click", () => {
  if (!localStream) return;
  isCameraOff = !isCameraOff;
  localStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !isCameraOff));
  cameraBtn.textContent = isCameraOff ? "Turn On Camera" : "Turn Off Camera";
});

screenBtn.addEventListener("click", async () => {
  if (!isScreenSharing) {
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      replaceVideoTrack(screenStream.getVideoTracks()[0]);
      isScreenSharing = true;
      screenBtn.textContent = "Stop Sharing";
      screenStream.getVideoTracks()[0].onended = () => {
        replaceVideoTrack(localStream.getVideoTracks()[0]);
        isScreenSharing = false;
        screenBtn.textContent = "Share Screen";
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  } else {
    replaceVideoTrack(localStream.getVideoTracks()[0]);
    isScreenSharing = false;
    screenBtn.textContent = "Share Screen";
  }
});

function replaceVideoTrack(newTrack) {
  Object.values(peers).forEach((peer) => {
    const sender = peer._pc.getSenders().find((s) => s.track.kind === "video");
    if (sender) sender.replaceTrack(newTrack);
  });
  localVideo.srcObject = isScreenSharing ? screenStream : localStream;
}

endCallBtn.addEventListener("click", () => {
  Object.values(peers).forEach((peer) => peer.destroy());
  peers = {};
  if (localStream) localStream.getTracks().forEach((track) => track.stop());
  if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
  localVideo.srcObject = null;
  remoteVideos.innerHTML = "";
  socket.disconnect();
  alert("Call ended.");
});
