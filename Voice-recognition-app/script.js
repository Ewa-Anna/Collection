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

function generatePDF() {
    var textToSave = document.getElementById("textarea-result").value;
    var pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text(10, 10, textToSave);
    pdf.save("output.pdf");
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
