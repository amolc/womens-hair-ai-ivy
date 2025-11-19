
window.onload = function () {
  console.log('window.onload - ai -v1.2');
  var chatTextElements = document.querySelectorAll('.chatbot__chat p');

  chatTextElements.forEach(function (element) {
    var text = element.innerHTML;
    var urlPattern = /(https?:\/\/[^\s]+)/g;
    element.innerHTML = text.replace(urlPattern, '<span class="chat-url">$1</span>');
  });
}

const chatbotUrl = 'https://api-stage.ivybears.ai/api/chat/';

const sendChatBtn = document.querySelector('#send-btn');
// const sendChatBtn = document.querySelector('.chatbot__input-box span');
const chatInput = document.querySelector('.chatbot__textarea');
const chatBox = document.querySelector('.chatbot__box');
const chatbotCloseBtn = document.querySelector('.chatbot__header span');

let userMessage;
let audio;

const inputInitHeight = chatInput.scrollHeight;
const OPENAI_API_KEY = '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';
const ASSISTANT_ID = 'asst_QCB7CbBI4NjkHNBNLVz7k4H6';
const BASE_URL = 'https://api.openai.com/v1';
let threadId = null;
let transcriptLanguage = '';

const languages = {
  "german": "de-DE",
  "chinese": "yue-HK",
  "arabic": "ar-SA",
  "turkish": "tr-TR",
  "latin": "el-GR",
  "greek": "el-GR",
  "spanish": "es-ES",
  "de": "de-DE",
  "el": "en-US",
  "tr": "tr-TR",
  "ar": "ar-SA",
  "es": "es-ES",
  "zh-tw": "yue-HK",
  "zh-cn": "yue-HK"
};

const voices = {
  "de-DE": "de-DE-Chirp-HD-F",
  "yue-HK": "cmn-CN-Wavenet-A",
  "ar-SA": "ar-XA-Standard-A",
  "tr-TR": "tr-TR-Standard-A",
  "el-GR": "el-GR-Standard-A",
  "es-ES": "es-ES-Chirp-HD-F",
  "en-US": "en-US-Chirp-HD-F" // Adding proper Google TTS voice for English en-US-Neural2-F
};

function getLanguageCode(transcriptLanguage) {
  return languages[transcriptLanguage.toLowerCase()] || "en-US";
}

function getGoogleVoice(languageCode) {
  return voices[languageCode] || "Leda";
}

async function detectLanguage(text) {
  const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text })
  });

  const data = await response.json();

  console.log("detectLanguage");
  console.log(data);

  return data.data.detections[0][0].language || "en";
}


// ==================== GENERATE RESPONSE WITH WORD BY WORD ANIMATION ====================



const createintroChatElement = (message, className) => {
  console.log('createintroChatElement');
  console.log(message); 
  console.log(className);
  const chatLi = document.createElement('li');
  chatLi.classList.add('chatbot__chat', className);
  chatLi.innerHTML = className === 'incoming'
    ? `<p translate="no"></p>`
    : `<span><img src="https://cdn.shopify.com/s/files/1/0598/4544/3632/files/bear-chat.png?v=1731058568" class="ivybots-icon"></span> <p translate="no"></p>
    <div class="audio-toggle d-none"> 
    <img class="sound-toggle off" src="assets/Sound off CTA.svg" alt="">
    <img class="sound-toggle on d-none" src="assets/Sound on CTA.svg" alt="">
    </div>
    `;
  chatLi.querySelector('p').textContent = message;
  return chatLi;
};

const generateResponse = async (incomingChatLi) => {
  console.log('generateResponse');
  const messageElement = incomingChatLi.querySelector('p');
  console.log(userMessage);

  transcriptLanguage = await detectLanguage(userMessage);
  console.log('Written Transcript Language: ' + transcriptLanguage);

  try {
    let assistantResponse;
    // const response = await fetch('https://api.ivybears.ai/ask', {
    const response = await fetch(chatbotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: userMessage,
        assist_name: 'Ada',
        lang: transcriptLanguage,
        session_id: threadId
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    assistantResponse = data.answer;
    threadId = data.session_id;

    messageElement.innerHTML = ''; // Clear existing content

    // var specAudio = messageElement.parent().find(".audio-toggle");

    // Split the assistantResponse into words and display them one by one
    const words = assistantResponse.split(' ');
    let wordIndex = 0;

    const displayNextWord = () => {
      if (wordIndex < words.length) {

        $(".chatbot__chat.incoming .thinking").removeClass("thinking");
        messageElement.innerHTML += words[wordIndex] + ' ';
        wordIndex++;
        setTimeout(displayNextWord, 100); // Adjust the delay for word animation
        // handleTextFormatting();

      } else {
        // After displaying all words, handle URL and bold text formatting
        handleTextFormatting();
        messageElement.parentNode.querySelector(".audio-toggle")?.classList.remove("d-none");
      }
    };

    displayNextWord();

    const handleTextFormatting = () => {
      const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;  // Matches [text](url)
      const boldRegex = /\*\*(.*?)\*\*/g;  // Matches **bold** text
      const header4Regex = /^####\s*(.*)$/gm;  // Matches lines starting with ####
      const header3Regex = /^###\s*(.*)$/gm;   // Matches lines starting with ###

      let formattedText = messageElement.innerHTML;

      // Replace **bold** with <strong> tags
      formattedText = formattedText.replace(boldRegex, '<strong>$1</strong>');

      // Replace #### headers with <h4> tags
      formattedText = formattedText.replace(header4Regex, '<h4>$1</h4>');

      // Replace ### headers with <h3> tags
      formattedText = formattedText.replace(header3Regex, '<h3>$1</h3>');

      // Replace [text](url) with bold and clickable link
      formattedText = formattedText.replace(urlRegex, (match, text, url) => {
        return `<strong><a href="${url}" class="url" target="_blank">${text}</a></strong>`;
      });

      messageElement.innerHTML = formattedText;
    };

    try {
       // Prepare text-to-speech audio but don't autoplay
      const ttsBody = buildRequestBody(assistantResponse);
      const audioBase64 = await getAudio(ttsBody);
      const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))], {
        type: "audio/wav",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      audioElement = new Audio(audioUrl);
      isPlaying = false; 
    } catch (error) {
      console.error(error);      
    }

  } catch (error) {
    console.error(error);
    messageElement.classList.add('error');
    messageElement.textContent = 'Let’s take another shot at that—can you repeat your question?';
    $(".chatbot__chat.incoming .thinking").removeClass("thinking");
  } finally {
    chatBox.scrollTo(0, chatBox.scrollHeight);
  }
};


const createChatElement = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chatbot__chat', className);
  chatLi.innerHTML = className === 'outgoing'
    ? `<p translate="no"></p>`
    : `<span><img src="https://cdn.shopify.com/s/files/1/0598/4544/3632/files/bear-chat.png?v=1731058568" class="ivybots-icon"></span> <p translate="no"></p>
    <div class="audio-toggle d-none"> 
    <img class="sound-toggle off" src="assets/Sound off CTA.svg" alt="">
    <img class="sound-toggle on d-none" src="assets/Sound on CTA.svg" alt="">
    </div>
    `;
  chatLi.querySelector('p').textContent = message;
  return chatLi;
};



const introChat = () => {
  console.log('introChat');

  $(".chatbot__box").addClass("with-chat");

  chatBox.appendChild(createintroChatElement('Hello, I am Ivybears. How can I help you?', 'incoming'));
  chatBox.scrollTo(0, chatBox.scrollHeight);

};

const handleChat = () => {
  console.log('handleChat');
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = '';
  chatInput.style.height = `${inputInitHeight}px`;

  // CUSTOM CALL AFTER SUBMIT
  $(".hold-to-speak.outside").addClass("op-0-1");
  $(".hold-to-speak.outside").removeClass("startVoice");
  // $(".ai-chat .menu-container").addClass("menu-done");
  $(".chatbot_inner_2").removeClass("d-none");
  $(".mic-guide").removeClass("d-none");
  
  $(".chatbot__box").removeClass("op-0");
 

  // WITH CHAT
  $(".name-title").addClass("op-0-1-none");
  $(".ai-chat .menu-container").addClass("d-none");
  $(".ai-chat").addClass("with-chat");
  // $(".animation-sequence-container").addClass("with-chat");
  // $(".chatbot-content").addClass("with-chat");
  // $(".chatbot__box").addClass("with-chat");

  chatBox.appendChild(createChatElement(userMessage, 'outgoing'));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  const incomingChatLi = createChatElement(txtLanding[6][localCountryCode], 'incoming');
  incomingChatLi.querySelector('p').classList.add('thinking');
  chatBox.appendChild(incomingChatLi);
  chatBox.scrollTo(0, chatBox.scrollHeight);
  console.log('generateResponse');
  generateResponse(incomingChatLi);
};

// Adjust textarea height based on input
chatInput.addEventListener('input', () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// ==================== Send chat on Enter key press (without Shift) on larger screens ====================
chatInput.addEventListener('keydown', (e) => {
  console.log('keydown');
  if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 300) {
    e.preventDefault();
    handleChat();
    $(".startVoice.on-bar").removeClass("d-none");
    $(".mic-guide").removeClass("d-none");
    $("#send-btn").addClass("d-none");
    $(".mic-container").removeClass("d-none");
  }
});


// ==================== SEND TO CHAT AND ADD ANIMATION ====================
sendChatBtn.addEventListener("click", function () {
  handleChat();
  $(".mic-container").removeClass("d-none");
  $("#send-btn").addClass("d-none");
});


// ==================== GOOGLE TTS ====================
const API_KEY = "AIzaSyCCPWnLSFdK6rwP4FNVhkG7Fbs_MbGvMgk";
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;


function buildRequestBody(message) {
  // Replace all instances of "IVYBEARS®" with "ivy bears"
  const formattedMessage = message.replace(/IVYBEARS®/g, "ivy bears");

  languageCode = getLanguageCode(transcriptLanguage);
  console.log('Translate Body Build Message: ' + formattedMessage);
  console.log('Translate Body Build Language: ' + languageCode);
  console.log('Translate Body Build Voice: ' + getGoogleVoice(languageCode));

  // Return the request body
  return {
    input: {
      text: formattedMessage, // Use the formatted message
    },
    voice: {
      languageCode: languageCode,
      name: getGoogleVoice(languageCode),
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
    },
  };
}

async function getAudio(requestBody) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response from API:", data);

    // Return the audio content
    return data.audioContent;
  } catch (error) {
    console.error("Error calling Google Text-to-Speech API:", error);
    throw error; // Re-throw error for the caller to handle
  }
}



// ==================== CUSTOM TEST TO SPEECH PER WORD CHUNKS ====================
// Variables to manage the audio toggle state
let audioElement = null; // Stores the audio object
let isPlaying = false; // Tracks whether the audio is currently playing
let currentChatElement = null; // Track the currently clicked chat element
const audioCache = new Map(); // Cache to store preloaded audio


// Event listener for clicking on incoming chat messages
document.querySelector(".chatbot__box").addEventListener("click", async (event) => {
  const soundToggleElement = event.target.closest(".sound-toggle");

  if (soundToggleElement) {
    const chatElement = soundToggleElement.closest(".chatbot__chat.incoming");

    if (chatElement) {
      const isAlreadyListening = chatElement.classList.contains("listen-text");

      document.querySelectorAll(".chatbot__chat.incoming").forEach((element) => {
        element.classList.remove("listen-text");
        offSpeaking(element);
      });

      if (isAlreadyListening) {
        console.log("Pause speaking");

        // stopAnimateSpeaking();
        // playIdleAnimation();

        await pauseAudio(chatElement);
      } else {
        console.log("Start speaking", "line354");

        // animateSpeaking();

        chatElement.classList.add("listen-text");
        onSpeaking(chatElement);

        const message = chatElement.querySelector("p").textContent;

        if (audioElement && currentChatElement === chatElement && isPlaying) {
          console.log("Pause speaking (same chat clicked)");
          await pauseAudio(chatElement);
        } else if (message && chatElement.classList.contains("listen-text")) {
          if (currentChatElement !== chatElement) {
            // console.log("Switching chat");

            await pauseAudio(currentChatElement);
          }
          await playChunks(message, chatElement);
        }
      }
    }
  }
});

async function pauseAudio(chatElement) {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;

    if (chatElement) {
      offSpeaking(chatElement);
    }

    currentChatElement = null;

    return new Promise((resolve) => {
      audioElement.onpause = resolve;
      audioElement.dispatchEvent(new Event("pause"));
    });
  }
}

async function playChunks(message, chatElement) {
  console.log("playChunks", "line399");
  try {
    if (!message || message.trim() === "") {
      console.log("Empty message, skipping audio playback");
      return;
    }
    
    // Store the current chat element for proper UI updates
    currentChatElement = chatElement;
    onSpeaking(chatElement); // Ensure UI shows speaking state immediately
    
    const words = message.split(" ");
    let chunkIndex = 0;

    async function playNextChunk() {
      if (chunkIndex < words.length) {
        const chunk = words.slice(chunkIndex, chunkIndex + 10).join(" ");
        chunkIndex += 10;

        // Skip empty chunks
        if (!chunk || chunk.trim() === "") {
          console.log("Empty chunk, skipping to next");
          setTimeout(() => playNextChunk(), 100);
          return;
        }

        console.log("Processing chunk:", chunk);
        
        if (!audioCache.has(chunk)) {
          try {
            const requestBody = buildRequestBody(chunk);
            console.log("Fetching audio for chunk");
            const audioBase64 = await getAudio(requestBody);
            
            if (!audioBase64) {
              console.error("No audio content received from API");
              setTimeout(() => playNextChunk(), 100); // Add delay before trying next chunk
              return;
            }
            
            const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))], {
              type: "audio/wav",
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioCache.set(chunk, audioUrl);
            console.log("Audio cached for chunk");
          } catch (error) {
            console.error("Error fetching audio for chunk:", error);
            setTimeout(() => playNextChunk(), 100); // Add delay before trying next chunk
            return;
          }
        }

        let audioUrl = audioCache.get(chunk);
        
        if (!audioUrl) {
          console.error("Failed to get audio URL from cache");
          setTimeout(() => playNextChunk(), 100); // Add delay before trying next chunk
          return;
        }

        // Create new audio element with proper event handling
        const newAudio = new Audio();
        
        // Add error handling for audio playback
        newAudio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setTimeout(() => playNextChunk(), 100); // Add delay before trying next chunk
        };
        
        // Set source after adding event listeners
        newAudio.src = audioUrl;
        
        // Ensure audio is loaded before playing
        newAudio.oncanplaythrough = () => {
          // Remove the event handler to prevent multiple triggers
          newAudio.oncanplaythrough = null;
          
          console.log("Audio can play through, attempting playback");
          newAudio.play()
            .then(() => {
              isPlaying = true;
              audioElement = newAudio; // Only set global reference after successful play
              console.log("Audio playing successfully");
            })
            .catch(err => {
              console.error("Error playing audio:", err);
              isPlaying = false;
              setTimeout(() => playNextChunk(), 100); // Add delay before trying next chunk
            });
        };

        newAudio.onended = async () => {
          console.log("Chunk finished");
          isPlaying = false;
          
          if (chunkIndex >= words.length) {
            console.log("Done speaking");
            if (chatElement) {
              chatElement.classList.remove("listen-text");
              offSpeaking(chatElement);
            }
            currentChatElement = null;
          } else {
            await playNextChunk();
          }
        };

        // Load next chunks in background while current chunk is playing
        loadNextChunks(chunkIndex, words);
      } else {
        if (currentChatElement) {
          offSpeaking(currentChatElement);
          currentChatElement = null;
        }
      }
    }

    currentChatElement = chatElement;
    await playNextChunk();
  } catch (error) {
    console.error("Error generating or playing audio:", error);
    // Ensure we turn off speaking indicators even if there's an error
    if (chatElement) {
      offSpeaking(chatElement);
    }
    // Clean up audio resources in case of error
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
    isPlaying = false;
  }
}

async function loadNextChunks(startIndex, words) {
  for (let i = startIndex; i < words.length; i += 10) {
    const chunk = words.slice(i, i + 10).join(" ");
    if (!audioCache.has(chunk)) {
      const requestBody = buildRequestBody(chunk);
      const audioBase64 = await getAudio(requestBody);
      const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))], {
        type: "audio/wav",
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioCache.set(chunk, audioUrl);
    }
  }
}

function onSpeaking(chatElement) {
  chatElement.querySelector(".sound-toggle.off").classList.add("d-none");
  chatElement.querySelector(".sound-toggle.on").classList.remove("d-none");
}

function animateSpeaking() {
  // Check if stopAnimation exists before calling it
  if (typeof stopAnimation === 'function') {
    stopAnimation();
  } else {
    console.log('stopAnimation function not available');
  }
  
  //stopSpeakingAnimation();
  setTimeout(doAfterLoad1, 1);
  function doAfterLoad1() {
    stopIdleAnimation();
    // playSpeakingAnimation();
  }

  setTimeout(doAfterLoad, 200);
  function doAfterLoad() {
    $('.png-frame-ai.intro').addClass("d-none");
    $('.png-frame-ai.idle').addClass("d-none");
    $('.png-frame-ai.speaking').removeClass("d-none");

  }
}

function offSpeaking(element) {
  element.querySelector(".sound-toggle.off").classList.remove("d-none");
  element.querySelector(".sound-toggle.on").classList.add("d-none");
}

// function stopAnimateSpeaking() {
//   //stopSpeakingAnimation();
//   $('.png-frame-ai.intro').addClass("d-none");
//   $('.png-frame-ai.idle').removeClass("d-none");
//   $('.png-frame-ai.speaking').addClass("d-none");

//   $(".sound-toggle.off").removeClass("d-none");
//   $(".sound-toggle.on").addClass("d-none");
// }

async function stopAllSpeech() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;

    if (currentChatElement) {
      offSpeaking(currentChatElement);
      currentChatElement = null;
    }

    document.querySelectorAll(".chatbot__chat").forEach((element) => element.classList.remove("listen-text"));

    return new Promise((resolve) => {
      audioElement.onpause = resolve;
      audioElement.dispatchEvent(new Event("pause"));
    });
  }
}



// ==================== WHEN THE TEXTAREA IS FOCUSED OR HAVE CONTENT ====================
const textarea = document.querySelector('.chatbot__textarea');
// Function to handle the textarea content
function checkTextareaContent() {
  if ($(".chatbot__box").hasClass("with-chat") && textarea.value.trim() === '') {
    $(".mic-container").removeClass("d-none");
    $(".mic-guide").removeClass("d-none");
    $("#send-btn").addClass("d-none");

  }

  else if (!$(".chatbot__box").hasClass("with-chat") && textarea.value.trim() === '') {
    $(".chatbot_inner_2").addClass("d-none");
  }

  else {
    $(".mic-container").addClass("d-none");
    $(".mic-guide").addClass("d-none");
    $("#send-btn").removeClass("d-none");
    $(".chatbot_inner_2").removeClass("d-none");
  }
}
// Add an event listener to check the content when the user types
textarea.addEventListener('input', checkTextareaContent);


// ==================== VOICE TIMER ====================
let timerInterval;
let seconds = 0;
const timerDisplay = $('.timer-seconds');

const updateTimer = () => {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  timerDisplay.text(`${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`);
};

function startVoiceTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);

  }
  $(".voice-timer").removeClass("d-none");

  $(".mic-container").addClass("recording");
  $(".startRecord").addClass("d-none");
  $(".stopRecord").removeClass("d-none");

  $("#startRecord").addClass("d-none");
  $("#stopRecord").removeClass("d-none");

  $(".startRecord.outside").addClass("scale-bigger");
  $(".stopRecord.outside").addClass("scale-bigger");

  $(".voice-timer p:first-child").text(txtLanding[6][localCountryCode]);
  $(".voice-timer .timer-seconds").removeClass("d-none");

  $(".stopRecord.on-bar").addClass("loading");
  $(".stopRecord.outside").addClass("loading-bigger");

  stopAnimation();
  //stopSpeakingAnimation();
  stopAllSpeech();
  setTimeout(doAfterLoad, 200);

  if ($('.png-frame-ai.idle').hasClass("d-none")) {
    playIdleAnimation();
  }

  else {

  }

  $(".sound-toggle.off").removeClass("d-none");
  $(".sound-toggle.on").addClass("d-none");
  function doAfterLoad() {
    $('.png-frame-ai.intro').addClass("d-none");
    $('.png-frame-ai.speaking').addClass("d-none");
    $('.png-frame-ai.idle').removeClass("d-none");
  }
}

function stopVoiceTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  timerDisplay.text('0:00');
  $(".voice-timer").addClass("d-none");

  $(".mic-container").removeClass("recording");
  $(".startRecord").removeClass("d-none");
  $(".stopRecord").addClass("d-none");

  $(".startRecord.outside").removeClass("scale-bigger");
  $(".stopRecord.outside").removeClass("scale-bigger");

}

function loadingTranscript() {
  $(".stopRecord.on-bar").removeClass("loading");
  $(".stopRecord.outside").removeClass("loading-bigger");
  $(".voice-timer p:first-child").html("<span class='loading-ellipsis'>Loading</span>");
  $(".voice-timer .timer-seconds").addClass("d-none");
}

//==================== Check if the browser supports the Web Speech API ====================
const startVoiceButton = document.querySelectorAll('.startVoice');
var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.lang = 'en-US';

// Create permission dialog elements
const permissionDialog = document.createElement('div');
permissionDialog.className = 'permission-dialog';
permissionDialog.innerHTML = `
  <div class="permission-dialog-content">
    <h3>Microphone Access Required</h3>
    <p>Please allow access to your microphone to use voice input.</p>
    <button id="permission-allow-btn">Allow</button>
  </div>
`;
document.body.appendChild(permissionDialog);

// Add styles for the permission dialog
const style = document.createElement('style');
style.textContent = `
  .permission-dialog {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
  }
  .permission-dialog-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    text-align: center;
  }
  #permission-allow-btn {
    background-color: #EC008C;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
  }
`;
document.head.appendChild(style);

// Function to check and request microphone permission
let micPermissionGranted = false;

async function checkMicrophonePermission() {
  try {
    // Check if permission is already granted
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    
    if (permissionStatus.state === 'granted') {
      micPermissionGranted = true;
      return true;
    } else if (permissionStatus.state === 'prompt') {
      // Show our custom permission dialog
      permissionDialog.style.display = 'flex';
      return false;
    } else {
      // Permission denied
      alert('Microphone access is denied. Please enable it in your browser settings.');
      return false;
    }
  } catch (error) {
    console.error('Error checking microphone permission:', error);
    // Fallback for browsers that don't support permissions API
    return false;
  }
}

// Handle permission dialog button click
document.getElementById('permission-allow-btn').addEventListener('click', async () => {
  permissionDialog.style.display = 'none';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micPermissionGranted = true;
    // Close the stream since we're just checking permission
    stream.getTracks().forEach(track => track.stop());
    // Start recording now that we have permission
    startRecording();
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    alert('Could not access microphone. Please check your browser settings.');
  }
});

//==================== STT ====================

const handleVoice = (message) => {
  if (!message) return;
  userMessage = message;
  console.log('handleVoice');
  console.log('userMessage', userMessage);

  chatInput.value = '';
  chatInput.style.height = `${inputInitHeight}px`;

  chatBox.appendChild(createChatElement(message, 'outgoing'));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  const incomingChatLi = createChatElement(txtLanding[6][localCountryCode], 'incoming');
  chatBox.appendChild(incomingChatLi);
  chatBox.scrollTo(0, chatBox.scrollHeight);
  generateResponse(incomingChatLi);
};


let mediaRecorder;
let audioChunks = [];

async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  formData.append('model', 'whisper-1'); // Use 'whisper-1' model
  formData.append('response_format', 'verbose_json'); //verbose json get language

  if (isIOS) {
    try {
      // If iOS, convert MP4 to WebM using convertToWebm function
      const webmBlob = await convertToWebm(audioBlob); // Assuming convertToWebm returns a WebM blob

      // Append the converted WebM file to FormData
      formData.append('file', webmBlob, 'audio.webm'); // Upload as WebM
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error converting MP3 to WebM:', error);
      return;
    }
  } else {
    // If not iOS, upload directly as WebM (assuming it's already WebM)
    formData.append('file', audioBlob, 'audio.webm'); // Upload as WebM
  }


  try {
    // const response2 = await fetch('https://eo3ourzeoq80lju.m.pipedream.net', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${OPENAI_API_KEY}`
    //   },
    //   body: formData
    // });
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Transcription:', data.text);
    // return data.text;
    chatInput.value = data.text;
    transcriptLanguage = data.language;

    $("#send-btn").trigger("click");
  } catch (error) {
    console.error('Error transcribing audio:', error);
  }
}

// Helper function for converting MP3 to WebM (you need to define this conversion logic)
async function convertToWebm(audioBlob) {
  // Assuming you have a function that converts audioBlob (MP3) to WebM
  // Using the Node.js server or Web API (like FFmpeg or a conversion API)

  // Example using an external API or local function that returns a WebM blob
  const formData = new FormData();
  formData.append('file', audioBlob);

  // Call your own backend or a service like FFmpeg or any file conversion service
  const response = await fetch('https://api.ivybears-arr.com/convert-to-webm', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to convert to WebM');
  }

  const webmBlob = await response.blob(); // Assuming it returns the WebM blob
  return webmBlob;
}

// Removed custom permission dialog in favor of browser's native permission prompt

// Check if microphone permission has been granted
async function checkMicrophonePermission() {
  try {
    // Check if permission is already granted
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    return permissionStatus.state === 'granted';
  } catch (error) {
    console.error('Error checking microphone permission:', error);
    // If we can't check permission status, we'll assume it's not granted
    return false;
  }
}

// Store permission state in localStorage
function setMicrophonePermissionState(granted) {
  localStorage.setItem('microphonePermissionGranted', granted ? 'true' : 'false');
}

// Get permission state from localStorage
function getMicrophonePermissionState() {
  return localStorage.getItem('microphonePermissionGranted') === 'true';
}

// Update UI to show microphone status
function updateMicrophoneStatusUI(status) {
  const micButtons = document.querySelectorAll(".startRecord");
  
  // Reset all styles first
  micButtons.forEach(button => {
    button.style.position = 'relative';
    button.classList.remove('mic-active', 'mic-denied');
    
    // Remove any existing status indicators
    const existingIndicator = button.querySelector('.mic-status-indicator');
    if (existingIndicator) {
      button.removeChild(existingIndicator);
    }
  });
  
  if (status === 'active') {
    // Add active styling
    micButtons.forEach(button => {
      button.classList.add('mic-active');
      
      // Add pulsing indicator
      const indicator = document.createElement('span');
      indicator.className = 'mic-status-indicator';
      indicator.style.position = 'absolute';
      indicator.style.top = '-5px';
      indicator.style.right = '-5px';
      indicator.style.width = '10px';
      indicator.style.height = '10px';
      indicator.style.borderRadius = '50%';
      indicator.style.backgroundColor = '#ff0000';
      indicator.style.animation = 'pulse 1.5s infinite';
      button.appendChild(indicator);
    });
    
    // Add animation style if it doesn't exist
    if (!document.getElementById('mic-animation-style')) {
      const style = document.createElement('style');
      style.id = 'mic-animation-style';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.7; }
        }
        .mic-active {
          box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
        }
        .mic-denied {
          opacity: 0.6;
        }
      `;
      document.head.appendChild(style);
    }
  } else if (status === 'denied') {
    // Add denied styling
    micButtons.forEach(button => {
      button.classList.add('mic-denied');
      
      // Add denied indicator (crossed microphone)
      const indicator = document.createElement('span');
      indicator.className = 'mic-status-indicator';
      indicator.style.position = 'absolute';
      indicator.style.top = '-5px';
      indicator.style.right = '-5px';
      indicator.style.width = '10px';
      indicator.style.height = '10px';
      indicator.style.borderRadius = '50%';
      indicator.style.backgroundColor = '#888';
      indicator.style.display = 'flex';
      indicator.style.justifyContent = 'center';
      indicator.style.alignItems = 'center';
      indicator.innerHTML = '&#10060;'; // X mark
      indicator.style.fontSize = '8px';
      button.appendChild(indicator);
    });
  }
}

// Start recording with permission handling
async function startRecording() {
  console.log('recorder routine start');
  
  // Check if browser supports getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('Browser does not support getUserMedia API');
    alert('Your browser does not support voice recording. Please try a different browser.');
    return;
  }
  
  // Check if already recording
  if (window.mediaRecorder && window.mediaRecorder.state === 'recording') {
    console.log('Already recording, stopping current recording');
    try {
      window.mediaRecorder.stop();
    } catch (e) {
      console.error('Error stopping existing recording:', e);
    }
  }
  
  // First check if we already have permission
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    console.log('Microphone permission status:', permissionStatus.state);
  } catch (e) {
    console.log('Permission API not supported, will try getUserMedia directly');
  }
  
  startVoiceTimer();

  // Check for iOS Safari compatibility
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  console.log('Device detection - isIOS:', isIOS);

  let stream;
  try {
    console.log('Requesting microphone permission...');
    
    // Force the browser to show the permission dialog by explicitly requesting audio
    const constraints = { 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    };
    
    console.log('Using constraints:', JSON.stringify(constraints));
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    console.log('Microphone permission granted, stream tracks:', stream.getTracks().length);
    
    // Permission granted, save state
    setMicrophonePermissionState(true);
    
    // Update UI to show active microphone
    updateMicrophoneStatusUI('active');

    try {
      // Create MediaRecorder with different MIME type depending on browser support
      const mimeType = isIOS ? 'audio/mp4' : 'audio/webm';
      console.log(`Using MIME type: ${mimeType}`);
      
      // Store mediaRecorder in window object to ensure it's accessible globally
      window.mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
      console.log('MediaRecorder created successfully:', window.mediaRecorder);
      
      let audioChunks = [];

      // Collect audio data
      window.mediaRecorder.ondataavailable = (event) => {
        console.log('Data available event, size:', event.data.size);
        audioChunks.push(event.data);
      };

      // Handle the stop event of MediaRecorder
      window.mediaRecorder.onstop = async () => {
        console.log('MediaRecorder stopped, processing audio chunks:', audioChunks.length);
        // Reset UI when recording stops
        updateMicrophoneStatusUI('normal');
        
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        console.log('Audio blob created, size:', audioBlob.size);

        // Directly upload as WebM or MP4 depending on the browser
        const transcription = await transcribeAudio(audioBlob);
        handleVoice(transcription);
      };

      // Start recording
      window.mediaRecorder.start();
      console.log('Recorder started successfully:', window.mediaRecorder.state);
    } catch (recorderError) {
      console.error("Error creating MediaRecorder:", recorderError);
      alert(`Error creating recorder: ${recorderError.message}`);
    }
  } catch (error) {
    console.error("Error initializing the recorder:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    // If permission denied, update state and UI
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      setMicrophonePermissionState(false);
      updateMicrophoneStatusUI('denied');
      alert("Microphone access was denied. Please allow microphone access to use voice recording.");
    } else {
      alert(`Error accessing microphone: ${error.message}`);
    }
  }
}

document.querySelectorAll(".startRecord").forEach((element) => { 
   element.addEventListener("click", async () => { 
     console.log('recorder routine start'); 
     startVoiceTimer(); 
 
     // Check for iOS Safari compatibility 
     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
 
     let stream; 
     try { 
       if (isIOS) { 
         console.log('iOS detected'); 
         // iOS Safari: Use simple getUserMedia without AudioContext 
         stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
       } else { 
         // For other browsers (Android, desktop), use getUserMedia directly 
         stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
       } 
 
       // Create MediaRecorder with different MIME type depending on browser support 
       const mimeType = isIOS ? 'audio/mp4' : 'audio/webm'; // Default to 'audio/mpeg' for iOS 
       // Use local variable instead of window.mediaRecorder for better mobile compatibility
       mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType }); 
       let audioChunks = []; 
 
       // Collect audio data 
       mediaRecorder.ondataavailable = (event) => { 
         console.log('Data available event, size:', event.data.size);
         audioChunks.push(event.data); 
       }; 
 
       // Handle the stop event of MediaRecorder 
       mediaRecorder.onstop = async () => { 
         console.log('MediaRecorder stopped, processing audio chunks:', audioChunks.length);
         const audioBlob = new Blob(audioChunks, { type: mimeType }); 
         console.log('Audio blob created, size:', audioBlob.size);

         try {
           // Directly upload as WebM or MP4 depending on the browser 
           console.log('Sending audio for transcription...');
           await transcribeAudio(audioBlob);
           console.log('Transcription completed and sent');
         } catch (error) {
           console.error('Error in transcription process:', error);
         }
       }; 
 
       // Start recording with 1 second timeslice to ensure data is collected
       mediaRecorder.start(1000);
       console.log('recorder started', mediaRecorder); 
     } catch (error) { 
       console.error("Error initializing the recorder:", error); 
       alert(`Error: ${error.message}`); 
     } 
   }); 
 }); 
 
 // Stop Recording and Send to API 
 document.querySelectorAll(".stopRecord").forEach((element) => { 
   element.addEventListener("click", async () => { 
     try { 
       if (mediaRecorder && mediaRecorder.state === 'recording') {
         console.log('Stopping recorder...');
         mediaRecorder.stop(); 
         console.log('Recorder stop command issued');
       } else {
         console.log('Cannot stop recorder - state:', mediaRecorder ? mediaRecorder.state : 'undefined');
       }
     } catch (error) { 
       console.error('Error stopping recording:', error);
     } 
     console.log('recorder stop'); 
     stopVoiceTimer(); 
   }); 
 });


