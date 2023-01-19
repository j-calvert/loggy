var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var recognition = new SpeechRecognition();
// TODO: Continuous?  interimResults?
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function addToMessages(msg) {
  const message = document.createElement('div');
  message.innerHTML = msg;
  document.getElementById('messages').appendChild(message);
}

const startRecognition = function () {
  recognition.start();
  console.log('Listening...');
};

recognition.onresult = function (event) {
  const t = event.results[0][0].transcript;
  addToMessages(`Me: ${t}`);
  generate();
};

recognition.onspeechend = function () {
  recognition.stop();
};

recognition.onerror = function (event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
};

function generate() {
  var transcript = '';
  const messages = Array.from(
    document.getElementById('messages').getElementsByTagName('div')
  );
  const messagesToSend = messages.forEach((div) => {
    transcript += div.textContent + '\n';
  });
  fetch('https://us-central1-loggy-ff3d3.cloudfunctions.net/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript: transcript }),
  })
    .then((response) => {
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      response.json().then((data) => {
        const result = data.result;
        addToMessages(`AI: ${result}`);
        const speech = new SpeechSynthesisUtterance(result);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
      });
    })
    .catch((error) => {
      // TODO Something better
      console.error(error);
      alert(error.message);
    });
}
