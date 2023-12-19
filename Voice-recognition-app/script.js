function startRecognition() {
    if (!recognition) {
        initializeRecognition();
    }

    if (recognition && recognition.running) {
        recognition.stop();
        recognition.running = false;
        document.getElementById("toggleMicrophone").innerHTML = 'Start listening <i class="fa-solid fa-microphone" style="color: #134192;"></i>';
    } else {
        recognition.start();
        recognition.running = true;
        document.getElementById("toggleMicrophone").innerHTML = 'Stop listening <i class="fa-solid fa-square" style="color: #134192;"></i>';
    }
}

function clearTextarea() {
    var textarea = document.getElementById("textarea-result");
    textarea.value = "";
}

function generateTXT() {
    var textToSave = document.getElementById("textarea-result").value;
    var blob = new Blob([textToSave], { type: "text/plain" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const textareaResult = document.getElementById("textarea-result");

recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = true;

recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    textareaResult.value = transcript;
});
