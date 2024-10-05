const recordButton = document.getElementById('recordButton');
const output = document.getElementById('output');
const visualizer = document.getElementById('visualizer');

let mediaRecorder;
let audioChunks = [];
let audioContext;
let analyser;
let dataArray;
let animationId;

// Initialize audio recording and visualization
function initAudioRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = sendAudioToAPI;

            // Set up audio visualization
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            output.innerHTML += `<p>Error: Unable to access microphone. ${error.message}</p>`;
        });
}

// Visualize audio (unchanged)
function visualizeAudio() {
    // ... (keep the existing visualization code)
}

// Send audio to backend for speech-to-text conversion
async function sendAudioToAPI() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
        const response = await axios.post('http://localhost:3000/api/stt', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Assume the API returns a 'text' field in the response
        const recognizedText = response.data.text;
        handleRecognizedSpeech(recognizedText);
    } catch (error) {
        console.error('Error in speech recognition:', error);
        output.innerHTML += `<p>Error: Speech recognition failed. ${error.message}</p>`;
    }

    audioChunks = [];
}

// Handle recognized speech
async function handleRecognizedSpeech(text) {
    output.innerHTML += `<p>You said: ${text}</p>`;

    try {
        // Send recognized speech to backend for processing
        const response = await axios.post('http://localhost:3000/api/process', {
            text: text
        });

        const assistantResponse = response.data.response;
        output.innerHTML += `<p>Assistant: ${assistantResponse}</p>`;

        // Use backend for Text to Speech
        const ttsResponse = await axios.post('http://localhost:3000/api/tts', {
            text: assistantResponse
        });

        // Play the audio response
        const audio = new Audio(ttsResponse.data.audio_url);
        audio.play();
    } catch (error) {
        console.error('Error processing speech', error);
        output.innerHTML += `<p>Error: ${error.message}</p>`;
    }
}
// Toggle recording
function toggleRecording() {
    if (mediaRecorder.state === 'inactive') {
        mediaRecorder.start();
        recordButton.textContent = 'Stop Recording';
        recordButton.classList.remove('bg-blue-500');
        recordButton.classList.add('bg-red-500');
        visualizeAudio();
    } else {
        mediaRecorder.stop();
        recordButton.textContent = 'Start Recording';
        recordButton.classList.remove('bg-red-500');
        recordButton.classList.add('bg-blue-500');
        cancelAnimationFrame(animationId);
    }
}

// Initialize the application
function init() {
    initAudioRecording();
    recordButton.addEventListener('click', toggleRecording);
}

init();