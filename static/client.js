// =======================
// Global state
// =======================
let pc = null;
let dc = null;
let id;
let room;
let es;
let localStream = null;

function logMsg(s) {
  appendLog(s);
  console.log(s);
}

// =======================
// SHARE SCREEN (CALLER)
// =======================
document.getElementById('shareBtn').onclick = async () => {
  room = document.getElementById('room').value || 'room1';
  id = document.getElementById('id').value || Math.random().toString(36).slice(2, 8);

  startEventSource();

  pc = createPeerConnection();

  // Create data channel for chat
  dc = pc.createDataChannel('chat');
  dc.onmessage = (e) => appendLog('Peer: ' + e.data);

  // Capture screen
  localStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false
  });

  // Detect STOP sharing
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.onended = () => {
    logMsg('Screen sharing stopped');

    // Notify peer
    sendSignal({ type: 'screen-stopped' });

    cleanupConnection();
  };

  // Add tracks
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  // Create offer
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  sendSignal({ type: 'offer', payload: pc.localDescription });
};

// =======================
// JOIN AS VIEWER
// =======================
document.getElementById('joinBtn').onclick = () => {
  room = document.getElementById('room').value || 'room1';
  id = document.getElementById('id').value || Math.random().toString(36).slice(2, 8);

  startEventSource();
  logMsg('Joined room ' + room + ' as ' + id);
};

// =======================
// SEND CHAT
// =======================
document.getElementById('sendMsg').onclick = () => {
  const t = document.getElementById('msg');
  const text = t.value;
  if (!text) return;

  if (dc && dc.readyState === 'open') {
    dc.send(text);
  } else {
    sendSignal({ type: 'chat', payload: text });
  }

  appendLog('You: ' + text);
  t.value = '';
};

// =======================
// EVENT SOURCE (SIGNALING)
// =======================
function startEventSource() {
  if (es) es.close();

  es = new EventSource(`/events?room=${encodeURIComponent(room)}&id=${encodeURIComponent(id)}`);

  es.onmessage = async (ev) => {
    try {
      const m = JSON.parse(ev.data);

      if (m.type === 'connected') return;
      if (m.type === 'join') return;
      if (m.type === 'leave') {
        logMsg('Peer left');
        cleanupConnection();
        return;
      }

      const from = m.from;

      if (m.type === 'offer') {
        if (!pc) pc = createPeerConnection();

        await pc.setRemoteDescription(m.payload);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal({ type: 'answer', to: from, payload: pc.localDescription });

      } else if (m.type === 'answer') {
        await pc.setRemoteDescription(m.payload);

      } else if (m.type === 'candidate') {
        try {
          await pc.addIceCandidate(m.payload);
        } catch (e) {
          console.warn(e);
        }

      } else if (m.type === 'chat') {
        appendLog('Peer: ' + m.payload);

      } else if (m.type === 'screen-stopped') {
        logMsg('Peer stopped sharing');
        cleanupConnection();
      }

    } catch (e) {
      console.warn('SSE parse error', e);
    }
  };
}

// =======================
// PEER CONNECTION SETUP
// =======================
function createPeerConnection() {
  const pc = new RTCPeerConnection();

  pc.ontrack = (e) => {
    document.getElementById('remoteVideo').srcObject = e.streams[0];
  };

  pc.ondatachannel = (ev) => {
    dc = ev.channel;
    dc.onmessage = (e) => appendLog('Peer: ' + e.data);
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      sendSignal({ type: 'candidate', payload: e.candidate });
    }
  };

  return pc;
}

// =======================
// CLEANUP (IMPORTANT)
// =======================
function cleanupConnection() {
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop());
    localStream = null;
  }

  const remoteVideo = document.getElementById('remoteVideo');
  if (remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().forEach(t => t.stop());
    remoteVideo.srcObject = null;
  }

  if (pc) {
    pc.close();
    pc = null;
  }

  dc = null;
}

// =======================
// SIGNAL SEND
// =======================
async function sendSignal(obj) {
  const payload = {
    from: id,
    to: obj.to || '',
    type: obj.type,
    payload: obj.payload
  };

  await fetch(`/signal?room=${encodeURIComponent(room)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

// =======================
// LOG
// =======================
function appendLog(s) {
  const log = document.getElementById('log');
  const el = document.createElement('div');
  el.textContent = s;
  log.appendChild(el);
}
