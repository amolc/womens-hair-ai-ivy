
// version 1.0 production  . Issue with link formatting.

console.log('window.onload - ada-ai -v3.102');
const chatbotUrl = 'https://api-stage.ivybears.ai/api/chat/';
const api_url = 'https://api-stage.ivybears.ai/';


// const chatbotUrl = 'http://localhost:8888/api/chat/';
// const api_url = 'http://localhost:8888/';
const assist_name = 'Ada';

const sendChatBtn = document.querySelector('#send-btn');
// const sendChatBtn = document.querySelector('.chatbot__input-box span');
const chatInput = document.querySelector('.chatbot__textarea');
const chatBox = document.querySelector('.chatbot__box');
const chatbotCloseBtn = document.querySelector('.chatbot__header span');

let userMessage;
let audio;

const inputInitHeight = chatInput.scrollHeight;

let threadId = null;
let transcriptLanguage = '';
let voiceLanguage = '';
let sessionId = null;
let responseLang = 'en-US';
let response_assist_name = 'Ada';
let response_data = {};






// Function to format URLs in text content
function formatURLs(element) {
  if (!element) return;
  
  var text = element.innerHTML;
  
  // Pattern to match complete URLs
  var urlPattern = /https?:\/\/[^\s]+/g;
  
  // Replace URLs with clickable links
  element.innerHTML = text.replace(urlPattern, function(url) {
    // Check if it's the main IvyBears website
    if (url.includes('www.ivybears.de') && !url.includes('/products/')) {
      return `<a href="${url}" class="url" target="_blank">our online store</a>`;
    }
    // Check if it's a product link (contains /products/)
    else if (url.includes('/products/')) {
      return `<a href="${url}" class="url" target="_blank">Discover now</a>`;
    } else {
      return `<a href="${url}" class="url" target="_blank">${url}</a>`;
    }
  });
}

window.onload = function () {
  console.log('window.onload - ai -v3.102');
  
  // get sessionid from localstorage, it is generated in geo.js
  sessionId = localStorage.getItem('sessionId');

  // Format any existing chat messages (for page reloads)
  var chatTextElements = document.querySelectorAll('.chatbot__chat p');
  chatTextElements.forEach(formatURLs);

}



function showNotification(message, type = 'error') {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
      errorElement.textContent = '';
    }, 5000);
  } else {
    console.error('Notification element not found:', message);
  }
}






async function prefetchAudio(text, lang, assist_name, sessionId, inputType) {
  console.log("[PRE-FETCH] Starting audio pre-fetch for:", text);
  console.log("[PRE-FETCH] Language for TTS:", lang);
  try {
    const audioData = await getAudio(text, lang, assist_name, sessionId, inputType);
    console.log("[PRE-FETCH] Audio pre-fetched successfully.");
    return audioData;
  } catch (error) {
    console.error("[PRE-FETCH] Error pre-fetching audio:", error);
    return null;
  }
}

const animateMessageDisplay = (words, messageElement, chatBox, preFetchedAudio, incomingChatLi) => {
  let wordIndex = 0;
  let fullText = ''; // Store the complete text for formatting

  const displayNextWord = () => {
    if (wordIndex < words.length) {
      $(".chatbot__chat.incoming .thinking").removeClass("thinking");
      
      // Build the full text progressively
      fullText += words[wordIndex] + ' ';
      
      // Format the complete text and display it
      const formattedText = handleTextFormatting(fullText.trim());
      messageElement.innerHTML = formattedText;
      
      wordIndex++;

      // Scroll to bottom as each word is added to keep chat visible
      setTimeout(() => {
        chatBox.scrollTo({
          top: chatBox.scrollHeight,
          behavior: 'smooth'
        });
      }, 10); // Small delay to ensure DOM updates

      setTimeout(displayNextWord, 100); // Adjust the delay for word animation
    } else {
      // Store the pre-fetched audio data on the chat element for instant playback FIRST
      if (preFetchedAudio && incomingChatLi) {
        incomingChatLi._preFetchedAudio = preFetchedAudio;
        console.log("[PRE-FETCH] Audio data stored on chat element for instant playback");
      }
      
      // Make audio toggle visible ONLY AFTER pre-fetched audio is stored
      // If audio is already pre-fetched, show toggle immediately
      // Otherwise, it will be shown when background fetch completes
      if (incomingChatLi._preFetchedAudio) {
        incomingChatLi.querySelector(".audio-toggle")?.classList.remove("d-none");
      }

      // Final scroll to ensure everything is visible
      setTimeout(() => {
        chatBox.scrollTo({
          top: chatBox.scrollHeight,
          behavior: 'smooth'
        });
      }, 50); // Slightly longer delay for final positioning
    }
  };

  displayNextWord();
};

// ==================== GENERATE RESPONSE WITH WORD BY WORD ANIMATION ====================

// New function to handle the chat API call
const getChat = async (userMessage, assist_name, detectedLanguage, sessionId, inputType) => {
  try {
    const response = await fetch(chatbotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: userMessage,
        assist_name: assist_name,
        lang: detectedLanguage || null,
        session_id: sessionId,
        input_type: inputType,
      })
    });

    console.log("chat url Response Status:", response.status);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {

    console.error("Error in getChat:", error);
    throw error; // Re-throw the error for generateResponse to catch
  }
};



const generateResponse = async (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector('p');
  const inputType = voiceLanguage ? 1 : 0;
  let preFetchedAudio = null;
  console.log('Input Language: ' + voiceLanguage);

  session_params = localStorage.getItem('session_params');
  console.log('[Generate Response] Decrypted - session_params:', session_params);
  
  // Parse the session data from JSON string to object
  let sessionData = {};
  try {
    sessionData = JSON.parse(session_params);
  } catch (e) {
    console.error('[Generate Response] Failed to parse session_params:', e);
  }
  
  sessionId = localStorage.getItem('sessionId');
  console.log('[Generate Response] SessionId - sessionId:', sessionId);

  // Extract language from geo.js
  let sessionLanguage = sessionData.browserLang;
  console.log('[Generate Response] Language from geo.js:', sessionLanguage);
  


  if (voiceLanguage) {
    sessionLanguage = voiceLanguage;
    console.log('[Generate Response] sessionLanguage updated with voiceLanguage:', sessionLanguage);
    voiceLanguage = '';
  }

  try {
    let assistantResponse;
    console.log('userMessage ready for chatpayload:', userMessage);
    const data = await getChat(userMessage, assist_name, sessionLanguage, sessionId, inputType);
    console.log('[generateResponse] Detected language from backend:', data.detected_language);
    console.log('Chat Response:', JSON.stringify(data, null, 2));
 
    

    const messageElement = incomingChatLi.querySelector('p');
    console.log(userMessage);
    assistantResponse = String(data.answer);
    // Format the text first, then split into words for animation
    const formattedResponse = handleTextFormatting(assistantResponse);
    // Split the formatted text while preserving HTML tags as single units
    const words = formattedResponse.split(/\s+/);
    animateMessageDisplay(words, messageElement, chatBox, null, incomingChatLi);
    
    // Pre-fetch audio in the background while message is displaying
    prefetchAudio(data.answer, data.detected_language, assist_name, sessionId, inputType).then(audioData => {
      if (audioData && incomingChatLi) {
        incomingChatLi._preFetchedAudio = audioData;
        console.log("[PRE-FETCH] Audio data stored on chat element after background fetch");
        // Make audio toggle visible now that audio is ready
        incomingChatLi.querySelector(".audio-toggle")?.classList.remove("d-none");
      }
    }).catch(error => {
      console.error("[PRE-FETCH] Background audio fetch failed:", error);
    });

  } catch (error) {
    console.error(error);
    messageElement.classList.add('error');
    messageElement.textContent = 'Let’s take another shot at that—can you repeat your question?';
    $(".chatbot__chat.incoming .thinking").removeClass("thinking");
  } finally {
    setTimeout(() => {
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }
};


const handleTextFormatting = (text) => {
  // Ensure the input is a string
  if (typeof text !== 'string') {
    text = String(text);
  }

  const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;  // Matches [text](url)
  const boldRegex = /\*\*(.*?)\*\*/g;  // Matches **bold** text
  const header4Regex = /^####\s*(.*)$/gm;  // Matches lines starting with ####
  const header3Regex = /^###\s*(.*)$/gm;   // Matches lines starting with ###
  const newlineRegex = /\n/g; // Detects newline characters

  let formattedText = text;

  // Replace **bold** with <strong> tags
  formattedText = formattedText.replace(boldRegex, '<strong>$1</strong>');

  // Replace #### headers with <h4> tags
  formattedText = formattedText.replace(header4Regex, '<h4>$1</h4>');

  // Replace ### headers with <h3> tags
  formattedText = formattedText.replace(header3Regex, '<h3>$1</h3>');

  // Replace [text](url) with clickable link (handle special cases)
  formattedText = formattedText.replace(urlRegex, (match, linkText, url) => {
    // Check if it's the main IvyBears website
    if (url.includes('www.ivybears.de') && !url.includes('/products/')) {
      return `<a href="${url}" class="url" target="_blank">our online store</a>`;
    }
    // Check if it's a product link (contains /products/)
    else if (url.includes('/products/')) {
      return `<a href="${url}" class="url" target="_blank">Discover now</a>`;
    } else {
      // For other links, use the provided link text without bold
      return `<a href="${url}" class="url" target="_blank">${linkText}</a>`;
    }
  });

  // Handle newline characters: Replace with <br> tags directly
  formattedText = formattedText.replace(newlineRegex, '<br>');

  return formattedText;
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



const handleChat = () => {
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
  $(".suggestions-slider").addClass("d-none");
  $(".chatbot__box").removeClass("op-0");
  $(".back-button").removeClass("d-none");
  $('.suggestions-slider').slick('unslick');

  // stopAnimation();
  // stopIdleAnimation();
  // playIdleAnimation();
  setTimeout(doAfterLoad200, 200);
  function doAfterLoad200() {
    $('.png-frame-ai.intro').addClass("d-none");
    $('.png-frame-ai.idle').removeClass("d-none");
  }

  // WITH CHAT
  $(".name-title").addClass("op-0-1-none");
  $(".ai-chat .menu-container").addClass("d-none");
  $(".ai-chat").addClass("with-chat");
  $(".animation-sequence-container").addClass("with-chat");
  $(".chatbot-content").addClass("with-chat");
  $(".chatbot__box").addClass("with-chat");

  chatBox.appendChild(createChatElement(userMessage, 'outgoing'));
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });

  const incomingChatLi = createChatElement(txtLanding[6][localCountryCode], 'incoming');
  incomingChatLi.querySelector('p').classList.add('thinking');
  chatBox.appendChild(incomingChatLi);
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });
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



// Event listener for clicking on incoming chat messages

// ==================== CUSTOM TEST TO SPEECH PER WORD CHUNKS ====================
// Variables to manage the audio toggle state
let audioElement = null; // Stores the audio object
let isPlaying = false; // Tracks whether the audio is currently playing
let currentChatElement = null; // Track the currently clicked chat element
const audioCache = new Map(); // Cache to store preloaded audio
let audioContext = null;
let audioBufferQueue = [];
let currentAudioIndex = 0;
let currentWordIndex = 0; // Track current word index for chunk processing
let currentWords = []; // Store current words array for access in event listeners
let mediaSource = null;
let sourceBuffer = null;
let isPreloadingNextChunk = false; // Flag to prevent duplicate preloading


// Event listener for clicking on incoming chat messages
document.querySelector(".chatbot__box").addEventListener("click", async (event) => {
  const soundToggleElement = event.target.closest(".sound-toggle");
  
  if (soundToggleElement) {
    const chatElement = soundToggleElement.closest(".chatbot__chat.incoming");

    if (chatElement) {
      const isAlreadyListening = chatElement.classList.contains("listen-text");
     
      // Remove listening state from all chat elements
      document.querySelectorAll(".chatbot__chat.incoming").forEach((element) => {
        element.classList.remove("listen-text");
        offSpeaking(element);
      });

      if (isAlreadyListening) {
        // If this chat was already listening, pause it
        console.log("Pause speaking");
        await pauseAudio(chatElement);
      } else {
        // If this chat was not listening, start playing it
        console.log("Start speaking", "line354");
        chatElement.classList.add("listen-text");
        
        onSpeaking(chatElement);
        const message = chatElement.querySelector("p").textContent;
        
        // Stop any currently playing audio first
        if (currentChatElement && currentChatElement !== chatElement) {
          await pauseAudio(currentChatElement);
        }
        
        // Check if we have pre-fetched audio for instant playback
        console.log("[PRE-FETCH] Checking for pre-fetched audio on chat element:", !!chatElement._preFetchedAudio);
        if (chatElement._preFetchedAudio) {
          console.log("[PRE-FETCH] Using pre-fetched audio for instant playback");
          await playPreFetchedAudio(chatElement._preFetchedAudio, chatElement);
        } else {
          console.log("[PRE-FETCH] No pre-fetched audio available, audio playback skipped");
          // No fallback - audio playback is only available with pre-fetched audio
        }
      }
    }
  }
});



async function pauseAudio(chatElement) {
  console.log("pauseAudio called for chat element:", chatElement);
  
  if (audioElement) {
    try {
      audioElement.pause();
      audioElement.currentTime = 0;
      isPlaying = false;

      if (chatElement) {
        offSpeaking(chatElement);
      }

      currentChatElement = null;

      // Clean up audio buffer queue
      audioBufferQueue.forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
      audioBufferQueue = [];
      currentAudioIndex = 0;

      return new Promise((resolve) => {
        audioElement.onpause = resolve;
        audioElement.dispatchEvent(new Event("pause"));
      });
    } catch (error) {
      console.error("Error in pauseAudio:", error);
      isPlaying = false;
      currentChatElement = null;
    }
  } else {
    // No audio element, but still clean up state
    isPlaying = false;
    currentChatElement = null;
    
    if (chatElement) {
      offSpeaking(chatElement);
    }
  }
}





function playAudio(audioBase64) {
  try {
    // Convert base64 to audio blob
    const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))], {
      type: "audio/wav",
    });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create audio element with iOS Safari optimizations
    const audio = new Audio(audioUrl);
    
    // iOS Safari specific settings
    audio.muted = false;
    audio.preload = 'auto';
    audio.autoplay = false; // Don't autoplay immediately
    
    // Set up audio for iOS Safari compatibility
    audio.load(); // Explicitly load the audio
    
    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    audio._isiOSSafari = isIOS && isSafari;
    
    return audio; // Return audio object for controlled playback
  } catch (error) {
    console.error("Error in playAudio function:", error);
    return null;
  }
}

// New function to preload next chunk in background
async function preloadNextChunk(startIndex, words = currentWords) {
  try {
    console.log("preloadNextChunk: Pre-loading chunk starting at:", startIndex);
    
    if (startIndex >= (words || currentWords).length) {
      console.log("preloadNextChunk: No more words to process");
      isPreloadingNextChunk = false;
      return;
    }

    // Get the next complete sentence instead of word chunk
    const sentence = getNextSentence(words || currentWords, startIndex);
    if (!sentence) {
      console.log("preloadNextChunk: No complete sentence found");
      isPreloadingNextChunk = false;
      return;
    }

    // Build request body and get audio for the sentence
    const requestBody = buildTTSRequestBody(sentence.text, "Reg", false);
    const audioBase64 = await getAudio(requestBody);
    
    if (!audioBase64) {
      console.error("preloadNextChunk: No audio data received");
      isPreloadingNextChunk = false;
      return;
    }

    // Append audio to buffer queue
    const audioUrl = appendAudioToBuffer(audioBase64);
    if (!audioUrl) {
      console.error("preloadNextChunk: Failed to append audio to buffer");
      isPreloadingNextChunk = false;
      return;
    }

    console.log("preloadNextChunk: Successfully pre-loaded chunk, buffer size:", audioBufferQueue.length);
    
    // Check if we should trigger playback of the newly loaded chunk
    if (currentAudioIndex < audioBufferQueue.length - 1) {
      console.log("preloadNextChunk: More chunks available in buffer");
    }
    
    // Continue preloading next sentence if more words remain
    const nextStart = sentence.endIndex;
    if (nextStart < (words || currentWords).length && audioBufferQueue.length < 3) {
      console.log("preloadNextChunk: Buffer still low (size:", audioBufferQueue.length, "), continuing to preload next sentence at index:", nextStart);
      setTimeout(() => {
        preloadNextChunk(nextStart, currentWords);
      }, 100);
    } else {
      console.log("preloadNextChunk: Preloading complete. Buffer size:", audioBufferQueue.length, ", Next index:", nextStart, ", Words remaining:", (words || currentWords).length - nextStart);
      isPreloadingNextChunk = false;
    }
    
    // Update the global currentWordIndex when preloading is successful
    if (startIndex === currentWordIndex) {
      currentWordIndex = nextStart;
      console.log("preloadNextChunk: Updated currentWordIndex to:", currentWordIndex);
    }
    
  } catch (error) {
    console.error("preloadNextChunk: Error pre-loading chunk:", error);
    isPreloadingNextChunk = false;
  }
}

// New function to append audio to buffer queue for seamless playback
function appendAudioToBuffer(audioBase64) {
  try {
    console.log("appendAudioToBuffer: Converting base64 audio to blob");
    
    // Convert base64 to audio blob and store in queue
    const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))], {
      type: "audio/wav",
    });
    
    console.log("appendAudioToBuffer: Audio blob created, size:", audioBlob.size);
    
    // Create object URL and add to queue
    const audioUrl = URL.createObjectURL(audioBlob);
    audioBufferQueue.push(audioUrl);
    
    console.log("Audio appended to buffer queue, current size:", audioBufferQueue.length, "URL:", audioUrl);
    return audioUrl;
  } catch (error) {
    console.error("Error appending audio to buffer:", error);
    return null;
  }
}

// New function to get the next complete sentence from word array
function getNextSentence(words, startIndex) {
  if (startIndex >= words.length) {
    return null;
  }
  
  let sentenceEnd = startIndex;
  let sentenceText = "";
  
  // Look for sentence-ending punctuation
  const sentenceEnders = /[.!?]/;
  
  for (let i = startIndex; i < words.length; i++) {
    const word = words[i];
    sentenceText += (i === startIndex ? "" : " ") + word;
    
    // Check if this word ends with sentence-ending punctuation
    if (sentenceEnders.test(word)) {
      sentenceEnd = i + 1;
      break;
    }
    
    // If we haven't found a sentence ender by the time we reach a reasonable length,
    // break at a natural pause point (comma, semicolon, etc.)
    if (i - startIndex >= 10) { // Max ~10 words per sentence for natural flow
      const pausePoints = /[,;]/;
      if (pausePoints.test(word)) {
        sentenceEnd = i + 1;
        break;
      }
    }
    
    // If we've gone too long without finding a natural break, force a break
    if (i - startIndex >= 15) { // Hard limit of ~15 words per sentence
      sentenceEnd = i + 1;
      break;
    }
    
    sentenceEnd = i + 1; // Keep track of the furthest we've gone
  }
  
  return {
    text: sentenceText,
    startIndex: startIndex,
    endIndex: sentenceEnd
  };
}

// New function to create seamless audio playback
function createSeamlessAudioPlayer() {
  try {
    console.log("Creating seamless audio player...");
    
    // Create a single audio element for continuous playback
    const audio = new Audio();
    
    // iOS Safari optimizations
    audio.muted = false;
    audio.preload = 'auto';
    audio.autoplay = false;
    
    // Set volume to ensure it's audible
    audio.volume = 1.0;
    
    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    audio._isiOSSafari = isIOS && isSafari;
    
    console.log("Audio player created, iOS Safari:", audio._isiOSSafari);
    
    return audio;
  } catch (error) {
    console.error("Error creating seamless audio player:", error);
    return null;
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
  
  // Clean up audio buffer queue
  audioBufferQueue.forEach(url => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
  audioBufferQueue = [];
  currentAudioIndex = 0;
}



// New function to play pre-fetched audio instantly
async function playPreFetchedAudio(preFetchedAudio, chatElement) {
  try {
    console.log("[PRE-FETCH AUDIO] Playing pre-fetched audio instantly");
    
    // Convert base64 to audio blob
    const audioBlob = new Blob([Uint8Array.from(atob(preFetchedAudio), (c) => c.charCodeAt(0))], {
      type: "audio/wav",
    });
    
    // Create object URL
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create audio element
    audioElement = new Audio(audioUrl);
    
    // iOS Safari optimizations
    audioElement.muted = false;
    audioElement.preload = 'auto';
    audioElement.autoplay = false;
    
    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    audioElement._isiOSSafari = isIOS && isSafari;
    
    // Set up ended event handler
    audioElement.addEventListener('ended', () => {
      console.log("[PRE-FETCH AUDIO] Playback completed");
      if (currentChatElement) {
        offSpeaking(currentChatElement);
        currentChatElement = null;
      }
      isPlaying = false;
      
      // Clean up object URL
      URL.revokeObjectURL(audioUrl);
    }, { once: true });
    
    // Handle errors
    audioElement.addEventListener('error', (e) => {
      console.error("[PRE-FETCH AUDIO] Audio playback error:", e);
      if (currentChatElement) {
        offSpeaking(currentChatElement);
        currentChatElement = null;
      }
      isPlaying = false;
      URL.revokeObjectURL(audioUrl);
    }, { once: true });
    
    // Handle iOS Safari autoplay restrictions
    if (audioElement._isiOSSafari) {
      console.log("[PRE-FETCH AUDIO] iOS Safari detected, handling autoplay restrictions");
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("[PRE-FETCH AUDIO] iOS Safari audio started successfully");
        }).catch(error => {
          if (error.name === 'NotAllowedError') {
            console.log("[PRE-FETCH AUDIO] iOS Safari autoplay blocked, setting up interaction handler");
            const playOnInteraction = () => {
              audioElement.play().then(() => {
                console.log("[PRE-FETCH AUDIO] Audio resumed after interaction");
              }).catch(err => console.error("Failed to resume audio:", err));
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
          } else {
            console.error("[PRE-FETCH AUDIO] Non-autoplay error:", error);
          }
        });
      }
    } else {
      // Non-iOS Safari - play normally
      try {
        await audioElement.play();
        console.log("[PRE-FETCH AUDIO] Audio started instantly");
      } catch (error) {
        console.error("[PRE-FETCH AUDIO] Error playing audio:", error);
        if (currentChatElement) {
          offSpeaking(currentChatElement);
          currentChatElement = null;
        }
        isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        return;
      }
    }
    
  } catch (error) {
    console.error("[PRE-FETCH AUDIO] Error in playPreFetchedAudio:", error);
    if (currentChatElement) {
      offSpeaking(currentChatElement);
      currentChatElement = null;
    }
    isPlaying = false;
  }
}


async function getAudio(message, lang, assist_name, sessionId, inputType) {
  try {
    console.log("[iOS AUDIO DEBUG] getAudio ENTERED");
    console.log("[iOS AUDIO DEBUG] Language parameter received:", lang);
    const requestBody = {
      text: message,
      lang: lang,
      assist_name: assist_name,
      sessionId: sessionId,
      inputType: inputType
    };
    console.log("[TTS API Request Body]:", requestBody);
    console.log("[iOS AUDIO DEBUG] TTS Request Body:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(api_url + 'api/tts/', {
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
    console.log("[iOS AUDIO DEBUG] TTS response received");
    
    // Enhanced audio format logging
    if (data.audioContent) {
      const isDataUri = data.audioContent.startsWith('data:');
      console.log(`[iOS AUDIO DEBUG] Audio: ${isDataUri ? 'Data URI' : 'Raw base64'} (${data.audioContent.length} chars)`);
      console.log(`[iOS AUDIO DEBUG] Preview: ${data.audioContent.substring(0, 50)}...`);
      return data.audioContent;
    }

   
  } catch (error) {
    console.error("[iOS AUDIO DEBUG] Error calling backend TTS API:", error);
    throw error; // Re-throw error for the caller to handle
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

  // $(".voice-timer p:first-child").text(txtLanding[6][localCountryCode]);
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
      // Permission denied - use UI notification instead of alert
      showNotification('Microphone access is denied. Please enable it in your browser settings.', 'error');
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
    showNotification('Could not access microphone. Please check your browser settings.', 'error');
  }
});


let mediaRecorder;
let audioChunks = [];


// Store permission state in localStorage
function setMicrophonePermissionState(granted) {
  localStorage.setItem('microphonePermissionGranted', granted ? 'true' : 'false');
}

// Get permission state from localStorage
function getMicrophonePermissionState() {
  return localStorage.getItem('microphonePermissionGranted') === 'true';
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

  // Check for Safari browser (both iOS and macOS)
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMacSafari = isSafari && /Macintosh/.test(navigator.userAgent);
  console.log('Device detection - UserAgent:', navigator.userAgent);
  console.log('Device detection - isSafari:', isSafari);
  console.log('Device detection - isIOS:', isIOS);
  console.log('Device detection - isMacSafari:', isMacSafari);

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
    
    try {
      // Create MediaRecorder with different MIME type depending on browser support
      const mimeType = (isIOS || isMacSafari) ? 'audio/mp4' : 'audio/webm';
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
      showNotification("Microphone access was denied. Please allow microphone access to use voice recording.", 'error');
    } else {
      showNotification(`Error accessing microphone: ${error.message}`, 'error');
    }
  }
}

document.querySelectorAll(".startRecord").forEach((element) => { 
   element.addEventListener("click", async () => { 
    
     startVoiceTimer(); 
 
     // Check for Safari browser (both iOS and macOS)
     const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
     const isMacSafari = isSafari && /Macintosh/.test(navigator.userAgent);
 
     console.log('recorder routine start-nov-5'); 
     console.log('UserAgent:', navigator.userAgent); 
     console.log('isSafari:', isSafari);
     console.log('isIOS:', isIOS);
     console.log('isMacSafari:', isMacSafari);
     let stream; 
     try { 
       if (isIOS || isMacSafari) { 
         console.log('Safari detected (iOS or macOS)'); 
         // Safari: Use simple getUserMedia without AudioContext 
         stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
       } else { 
         // For other browsers (Android, desktop Chrome/Firefox), use getUserMedia directly 
         stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
       } 

       // Create MediaRecorder with different MIME type depending on browser support 
       const mimeType = (isIOS || isMacSafari) ? 'audio/mp4' : 'audio/webm'; 
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
 

 
// Removed convertToWebm function - we now handle audio formats directly

async function transcribeAudio(audioBlob, service = 'whisper') {
  const formData = new FormData();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Determine the correct MIME type and filename based on the browser
  let mimeType;
  let filename;
  
  if (isIOS) {
    // iOS records as MP4
    mimeType = 'audio/mp4';
    filename = 'audio.mp4';
  } else {
    // Other browsers record as WebM
    mimeType = 'audio/webm';
    filename = 'audio.webm';
  }
  
  // Create a new blob with the correct MIME type
  const typedBlob = new Blob([audioBlob], { type: mimeType });
  formData.append('file', typedBlob, filename);
  formData.append('service', service); // Add service parameter

  try {
    // Send audio to backend transcription endpoint
    const response = await fetch(api_url + 'api/transcribe/', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Transcription:', data.transcribed_text);
    console.log('Detected language:', data.detected_language);
    
    // Set the transcribed text in the chat input
    chatInput.value = data.transcribed_text;
    
    // Use the language detected by Whisper instead of calling separate API
    voiceLanguage = data.detected_language;
    
    // Trigger the send button to process the transcribed text
    $("#send-btn").trigger("click");
  } catch (error) {
    console.error('Error transcribing audio:', error);
    showNotification(`Transcription error: ${error.message}`);
  }
}






