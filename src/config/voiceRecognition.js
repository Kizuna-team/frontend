function createRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('此瀏覽器不支援語音辨識');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'zh-TW';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  return recognition;
}

export { createRecognition };