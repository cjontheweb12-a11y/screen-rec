let mediaRecorder;
let recordedChunks = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const video = document.getElementById('recordedVideo');

startBtn.onclick = async () => {
  try {
    // Request screen capture
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true // optional, captures system audio
    });

    // Setup MediaRecorder
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedChunks = [];
      const url = URL.createObjectURL(blob);
      video.src = url;

      // Optional: auto-download the video
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen_recording.webm';
      a.click();
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    console.log('Recording started');
  } catch (err) {
    console.error('Error: ' + err);
  }
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  console.log('Recording stopped');
};
