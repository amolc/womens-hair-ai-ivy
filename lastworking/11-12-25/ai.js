
// version 1.0 production  . Issue with link formatting.


window.onload = function () {
  console.log('window.onload - ai -v1.102');
  var chatTextElements = document.querySelectorAll('.chatbot__chat p');

  chatTextElements.forEach(function (element) {
    var text = element.innerHTML;
    var urlPattern = /(https?:\/\/[^\s]+)/g;
    element.innerHTML = text.replace(urlPattern, '<span class="chat-url">$1</span>');
  });
}



const chatbotUrl = 'https://api-stage.ivybears.ai/api/chat/';
const api_url = 'https://api-stage.ivybears.ai/';


// const chatbotUrl = 'http://localhost:8888/api/chat/';
// const api_url = 'http://localhost:8888/';


const sendChatBtn = document.querySelector('#send-btn');
// const sendChatBtn = document.querySelector('.chatbot__input-box span');
const chatInput = document.querySelector('.chatbot__textarea');
const chatBox = document.querySelector('.chatbot__box');
const chatbotCloseBtn = document.querySelector('.chatbot__header span');

let userMessage;
let audio;

const inputInitHeight = chatInput.scrollHeight;
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
};

function getGoogleVoice(languageCode) {
  return voices[languageCode] || "Leda";
};

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


async function detectLanguage(text) {
  try {
    // iOS Safari specific: Ensure we're using the correct protocol and headers
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    
  
    const requestUrl = api_url + 'api/detect-language/';
  
    
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({ text: text }),
    };
    
    // iOS Safari specific: Add mode and credentials for CORS
    if (isIOS || isSafari) {
      fetchOptions.mode = 'cors';
      fetchOptions.credentials = 'same-origin';
      console.log("[iOS CORS DEBUG] Added iOS Safari specific fetch options");
    }
    
    console.log("[iOS CORS DEBUG] Fetch options:", JSON.stringify(fetchOptions, null, 2));
    
    const response = await fetch(requestUrl, fetchOptions);
    console.log("[iOS CORS DEBUG] Response received:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("[iOS CORS DEBUG] detectLanguage response:", data);

    if (data.success) {
      return data.language || "en";
    } else {
      throw new Error(data.error || "Language detection failed");
    }
  } catch (error) {
    console.error("[iOS CORS DEBUG] Error calling backend language detection API:", error);
    console.error("[iOS CORS DEBUG] Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // iOS Safari specific: Try fallback to localhost:8000 if localhost:8888 fails
    
    
    return "en"; // Default to English on error
  }
}



// ==================== GENERATE RESPONSE WITH WORD BY WORD ANIMATION ====================

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

    // Pre-fetch TTS audio while displaying the message
    let preFetchedAudio = null;
    const prefetchAudio = async () => {
      try {
        console.log("[PRE-FETCH] Starting TTS audio pre-fetch");
        const requestBody = {
          text: assistantResponse,
          language: transcriptLanguage || 'en-US'
        };
        preFetchedAudio = await getAudio(requestBody);
        console.log("[PRE-FETCH] TTS audio pre-fetch completed successfully");
      } catch (error) {
        console.error("[PRE-FETCH] Error pre-fetching TTS audio:", error);
        // Don't fail the message display if pre-fetch fails
        preFetchedAudio = null;
      }
    };

    // Start pre-fetching audio in the background
    setTimeout(() => {
      prefetchAudio();
    }, 500); // Small delay to prioritize message display

    const displayNextWord = () => {
      if (wordIndex < words.length) {

        $(".chatbot__chat.incoming .thinking").removeClass("thinking");
        messageElement.innerHTML += words[wordIndex] + ' ';
        wordIndex++;
        
        // Scroll to bottom as each word is added to keep chat visible
        setTimeout(() => {
          chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
          });
        }, 10); // Small delay to ensure DOM updates
        
        setTimeout(displayNextWord, 100); // Adjust the delay for word animation
        // handleTextFormatting();

      } else {
        // After displaying all words, handle URL and bold text formatting
        handleTextFormatting();
        messageElement.parentNode.querySelector(".audio-toggle")?.classList.remove("d-none");
        
        // Final scroll to ensure everything is visible
        setTimeout(() => {
          chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
          });
        }, 50); // Slightly longer delay for final positioning
        
        // Store the pre-fetched audio data on the chat element for instant playback
        if (preFetchedAudio && incomingChatLi) {
          incomingChatLi._preFetchedAudio = preFetchedAudio;
          console.log("[PRE-FETCH] Audio data stored on chat element for instant playback");
        }
      }
    };

    displayNextWord();

    const handleTextFormatting = () => {
      const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;  // Matches [text](url)
      const hrefRegex = /href="(https?:\/\/[^"]+)"/g;  // Matches href="url" attributes
      const malformedLinkRegex = /([^<>\s]+)\s+target="_blank"\s+rel="noopener noreferrer">([^<]+)/g;  // Matches malformed links
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

      // Fix malformed links like "Discover now  target="_blank" rel="noopener noreferrer">Discover now"
      formattedText = formattedText.replace(malformedLinkRegex, (match, linkText, displayText) => {
        // Try to extract URL from previous context or use a default
        const urlMatch = formattedText.match(/href="(https?:\/\/[^"]+)"/);
        const url = urlMatch ? urlMatch[1] : 'https://www.ivybears.de/collections/haare';
        return `<strong><a href="${url}" class="url" target="_blank" rel="noopener noreferrer">${displayText}</a></strong>`;
      });

      // Replace raw href attributes with proper clickable links
      formattedText = formattedText.replace(hrefRegex, (match, url) => {
        return `<strong><a href="${url}" class="url" target="_blank" rel="noopener noreferrer">Discover now</a></strong>`;
      });

      // Replace [text](url) with bold and clickable link
      formattedText = formattedText.replace(urlRegex, (match, text, url) => {
        return `<strong><a href="${url}" class="url" target="_blank">${text}</a></strong>`;
      });

      messageElement.innerHTML = formattedText;
    };


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
    }, 100); // Delay to ensure all DOM updates are complete
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

  stopAnimation();
  stopIdleAnimation();
  playIdleAnimation();
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
        if (chatElement._preFetchedAudio) {
          console.log("[PRE-FETCH] Using pre-fetched audio for instant playback");
          await playPreFetchedAudio(chatElement._preFetchedAudio, chatElement);
        } else {
          console.log("[PRE-FETCH] No pre-fetched audio available, using standard approach");
          // Start playing the new message using full message approach
          await playFullMessageAudio(message, chatElement);
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

async function playChunks(message, chatElement) {
  console.log("playChunks", "line426 - function invoked.");
  console.log("playChunks: Initial state - isPlaying:", isPlaying, "currentChatElement:", currentChatElement);
  
  // Check if we're already playing this same chat element
  if (currentChatElement === chatElement && isPlaying) {
    console.log("Already playing this chat element, skipping");
    return;
  }
  
  try {
    if (!message || message.trim() === "") {
      console.log("Empty message, skipping audio playback");
      return;
    }
    
    // Initialize or reset audio queue and buffer
    audioQueue = [];
    audioBufferQueue = []; // Clear audio buffer queue
    currentChunkIndex = 0;
    currentAudioIndex = 0;
    currentWordIndex = 0; // Reset word index
    currentWords = message.split(" "); // Store words globally for event listeners
    isPlaying = true;
    currentChatElement = chatElement;
    
    // Show speaking animation
    onSpeaking(chatElement);
    
    // Create seamless audio player for iOS Safari
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
    
    // Store words globally for access in event listeners
    currentWords = message.split(" ");
    
    // Define the async function to play chunks sequentially with caching
    async function playNextChunk(startIndex = 0) {
      // Check if we should continue playing (user might have clicked pause)
      if (!isPlaying || currentChatElement !== chatElement) {
        console.log("Playback interrupted or chat changed, stopping");
        offSpeaking(chatElement);
        isPlaying = false;
        return;
      }
      
      if (startIndex >= currentWords.length) {
        offSpeaking(chatElement);
        isPlaying = false;
        return;
      }

      try {
        // Get the next complete sentence instead of word chunk
        const sentence = getNextSentence(currentWords, startIndex);
        if (!sentence) {
          console.log("No complete sentence found, stopping");
          offSpeaking(chatElement);
          isPlaying = false;
          return;
        }

        console.log("Playing sentence:", sentence.text, "(words:", sentence.startIndex, "to", sentence.endIndex, ")");

        // Build request body and get audio for the sentence
        const requestBody = buildRequestBody(sentence.text);
        const audioBase64 = await getAudio(requestBody);
        
        if (!audioBase64) {
          console.error("No audio data received for sentence starting at index:", startIndex);
          offSpeaking(chatElement);
          isPlaying = false;
          return;
        }

        // Append audio to buffer queue for seamless playback
        const audioUrl = appendAudioToBuffer(audioBase64);
        if (!audioUrl) {
          console.error("Failed to append audio to buffer");
          offSpeaking(chatElement);
          isPlaying = false;
          return;
        }

        // Create audio element if not exists
        if (!audioElement) {
          audioElement = createSeamlessAudioPlayer();
          if (!audioElement) {
            console.error("Failed to create audio element");
            offSpeaking(chatElement);
            isPlaying = false;
            return;
          }
        }

        // Update currentWordIndex to the end of the current sentence
        currentWordIndex = sentence.endIndex;

        // For the first sentence, start playing from buffer queue
        if (startIndex === 0) {
          console.log("Starting playback from buffer queue, current index:", currentAudioIndex);
          playFromBufferQueue();
        }

        // Pre-load the next sentence while current audio is playing
        const nextSentenceStart = sentence.endIndex;
        if (nextSentenceStart < currentWords.length && !isPreloadingNextChunk) {
          isPreloadingNextChunk = true;
          console.log("Pre-loading next sentence starting at:", nextSentenceStart);
          
          // Pre-load next sentence in background without waiting
          setTimeout(() => {
            preloadNextChunk(nextSentenceStart, currentWords);
          }, 200); // Short delay to prioritize current playback
        }

        console.log("Sentence processing complete, next start index:", nextSentenceStart);

      } catch (error) {
        console.error("Error in playNextChunk:", error);
        offSpeaking(chatElement);
        isPlaying = false;
      }
    }
    
    // Start playing the first chunk
    await playNextChunk(0);
    
  } catch (error) {
    console.error("Error in playChunks:", error);
    if (currentChatElement) {
      offSpeaking(currentChatElement);
      currentChatElement = null;
    }
  }
}

async function loadNextChunks(startIndex, words) {
  console.log("loadNextChunks", "line 559- function invoked.");
  for (let i = startIndex; i < (words || currentWords).length; i += 10) {
    const chunk = (words || currentWords).slice(i, i + 10).join(" ");
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
    const requestBody = buildRequestBody(sentence.text);
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

// Play next chunk with improved iOS Safari support
async function playNextChunk() {
  if (!isPlaying || !currentChatElement) {
    console.log("Playback stopped or chat changed, stopping");
    return;
  }
  
  if (currentWordIndex >= currentWords.length) {
    console.log("All chunks played");
    return;
  }
  
  // Check if we have more chunks in the buffer
  if (currentAudioIndex < audioBufferQueue.length) {
    console.log("More chunks in buffer, continuing playback...");
    playFromBufferQueue();
    return;
  }
  
  // Don't proceed if already preloading to prevent race conditions
  if (isPreloadingNextChunk) {
    console.log("Already preloading, waiting...");
    return;
  }
  
  // Process complete sentences instead of word chunks
  const sentence = getNextSentence(currentWords, currentWordIndex);
  if (!sentence) {
    console.log("No more sentences to process");
    return;
  }
  
  console.log("Playing sentence:", sentence.text, "(words:", sentence.startIndex, "to", sentence.endIndex, ")");
  
  try {
    isPreloadingNextChunk = true;
    const audioData = await getAudio(sentence.text);
    if (!audioData) {
      console.log("No audio data received, stopping");
      isPreloadingNextChunk = false;
      return;
    }
    
    console.log("Appending audio to buffer...");
    appendAudioToBuffer(audioData);
    
    // Update currentWordIndex to the end of the current sentence
    currentWordIndex = sentence.endIndex;
    isPreloadingNextChunk = false;
    
    // Start playing from buffer if this is the first chunk
    if (currentAudioIndex === 0 && audioBufferQueue.length === 1) {
      console.log("First chunk loaded, starting buffer playback...");
      playFromBufferQueue();
    }
    
  } catch (error) {
    console.error("Error playing next chunk:", error);
    isPreloadingNextChunk = false;
  }
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

// New function to play full message audio with progressive streaming
async function playFullMessageAudio(message, chatElement) {
  try {
    console.log("[FULL MESSAGE AUDIO] Starting full message playback...");
    
    // Check if we're already playing this same chat element
    if (currentChatElement === chatElement && isPlaying) {
      console.log("Already playing this chat element, skipping");
      return;
    }
    
    if (!message || message.trim() === "") {
      console.log("Empty message, skipping audio playback");
      return;
    }
    
    // Initialize audio state
    audioBufferQueue = []; // Clear audio buffer queue
    currentAudioIndex = 0;
    isPlaying = true;
    currentChatElement = chatElement;
    
    // Show speaking animation
    onSpeaking(chatElement);
    
    // Clean up any existing audio element
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
    
    // Get message length to decide on streaming approach
    const messageLength = message.length;
    const shouldUseStreaming = messageLength > 100; // Use streaming for longer messages
    
    console.log(`[FULL MESSAGE AUDIO] Message length: ${messageLength}, using streaming: ${shouldUseStreaming}`);
    
    // Get the full message audio as base64
    const audioBase64 = await getFullMessageAudio(message, shouldUseStreaming);
    
    if (!audioBase64) {
      console.error("Failed to get full message audio");
      offSpeaking(chatElement);
      isPlaying = false;
      currentChatElement = null;
      return;
    }
    
    console.log("[FULL MESSAGE AUDIO] Audio received, length:", audioBase64.length);
    
    // Convert base64 to audio blob
    const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))], {
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
      console.log("[FULL MESSAGE AUDIO] Playback completed");
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
      console.error("[FULL MESSAGE AUDIO] Audio playback error:", e);
      if (currentChatElement) {
        offSpeaking(currentChatElement);
        currentChatElement = null;
      }
      isPlaying = false;
      URL.revokeObjectURL(audioUrl);
    }, { once: true });
    
    // Handle iOS Safari autoplay restrictions
    if (audioElement._isiOSSafari) {
      console.log("[FULL MESSAGE AUDIO] iOS Safari detected, handling autoplay restrictions");
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("[FULL MESSAGE AUDIO] iOS Safari audio started successfully");
        }).catch(error => {
          if (error.name === 'NotAllowedError') {
            console.log("[FULL MESSAGE AUDIO] iOS Safari autoplay blocked, setting up interaction handler");
            const playOnInteraction = () => {
              audioElement.play().then(() => {
                console.log("[FULL MESSAGE AUDIO] Audio resumed after interaction");
              }).catch(err => console.error("Failed to resume audio:", err));
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
          } else {
            console.error("[FULL MESSAGE AUDIO] Non-autoplay error:", error);
          }
        });
      }
    } else {
      // Non-iOS Safari - play normally
      try {
        await audioElement.play();
        console.log("[FULL MESSAGE AUDIO] Audio started normally");
      } catch (error) {
        console.error("[FULL MESSAGE AUDIO] Error playing audio:", error);
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
    console.error("[FULL MESSAGE AUDIO] Error in playFullMessageAudio:", error);
    if (currentChatElement) {
      offSpeaking(currentChatElement);
      currentChatElement = null;
    }
    isPlaying = false;
  }
}

// New function to play from audio buffer queue
async function playFromBufferQueue() {
  if (currentAudioIndex >= audioBufferQueue.length) {
    console.log("Buffer queue finished, checking for more chunks...");
    // If we have more words to process, preload the next chunk
    if (isPlaying && currentChatElement && currentWordIndex < currentWords.length) {
      console.log("More words available, loading next chunk...");
      setTimeout(() => {
        playNextChunk(currentWordIndex);
      }, 100);
    } else if (currentWordIndex >= currentWords.length) {
      console.log("All words processed, ending playback");
      if (isPlaying && currentChatElement) {
        offSpeaking(currentChatElement);
        isPlaying = false;
      }
    }
    return;
  }
  
  try {
    const audioUrl = audioBufferQueue[currentAudioIndex];
    if (!audioUrl) {
      console.error("Invalid audio URL at index:", currentAudioIndex);
      return;
    }
    
    // Create or reuse audio element
    if (!audioElement) {
      audioElement = createSeamlessAudioPlayer();
    }
    
    console.log("Playing buffer item", currentAudioIndex, "of", audioBufferQueue.length);
    audioElement.src = audioUrl;
    
    // Handle iOS Safari playback
    if (audioElement._isiOSSafari) {
      console.log("iOS Safari detected, handling autoplay restrictions");
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("iOS Safari audio started successfully");
        }).catch(error => {
          if (error.name === 'NotAllowedError') {
            console.log("iOS Safari autoplay blocked, setting up interaction handler");
            // Set up user interaction handler
            const playOnInteraction = () => {
              audioElement.play().then(() => {
                console.log("Buffer queue audio resumed after interaction");
              }).catch(err => console.error("Failed to resume buffer audio:", err));
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
          } else {
            console.error("Non-autoplay error:", error);
          }
        });
      }
    } else {
      // Non-iOS Safari - play normally
      try {
        await audioElement.play();
        console.log("Audio started normally");
      } catch (error) {
        console.error("Error playing audio:", error);
        return;
      }
    }
    
    // Set up ended event for next buffer item with improved timing
    audioElement.addEventListener('ended', () => {
      console.log("Buffer item ended, moving to next");
      currentAudioIndex++;
      
      // Check if we have more items in the buffer
      if (currentAudioIndex < audioBufferQueue.length) {
        console.log("More items in buffer, continuing playback...");
        playFromBufferQueue();
      } else {
        console.log("Buffer queue empty, checking for more chunks...");
        
        // For full message approach, we're done when the buffer is empty
        if (isPlaying && currentChatElement) {
          console.log("Full message playback complete, ending playback");
          offSpeaking(currentChatElement);
          isPlaying = false;
          currentChatElement = null;
        }
      }
    }, { once: true });
    
    // Handle errors during playback
    audioElement.addEventListener('error', (e) => {
      console.error("Audio playback error:", e);
    }, { once: true });
    
  } catch (error) {
    console.error("Error playing from buffer queue:", error);
  }
}


// ==== TTS


// ==================== GOOGLE TTS ====================

function buildRequestBody(message) {
  // Replace all instances of "IVYBEARS®" with "ivy bears"
  const formattedMessage = message.replace(/IVYBEARS®/g, "ivy bears");

  languageCode = getLanguageCode(transcriptLanguage);
  console.log('TTS Request Message: ' + formattedMessage);
  console.log('TTS Request Language: ' + languageCode);

  // Return the request body for backend TTS API (simple format)
  return {
    text: formattedMessage,
    language_code: languageCode,
    // Let backend choose appropriate voice for the language
    // voice_name: "en-US-Chirp3-HD-Leda", // Removed hardcoded Leda voice
    audioEncoding: "LINEAR16"

  };
}

// New function for full message TTS requests
function buildFullMessageRequestBody(message) {
  // Replace all instances of "IVYBEARS®" with "ivy bears"
  const formattedMessage = message.replace(/IVYBEARS®/g, "ivy bears");

  languageCode = getLanguageCode(transcriptLanguage);
  console.log('Full Message TTS Request: ' + formattedMessage);
  console.log('Full Message TTS Language: ' + languageCode);

  // Return the request body for full message TTS API
  return {
    text: formattedMessage,
    language_code: languageCode,
    // Let backend choose appropriate voice for the language
    // voice_name: "en-US-Chirp3-HD-Leda", // Removed hardcoded Leda voice
    audioEncoding: "LINEAR16",
    full_message: true  // Flag to indicate full message processing
  };
}

// New function to get audio for full message with streaming support
async function getFullMessageAudio(message, enableStreaming = true) {
  try {
    console.log(`[FULL MESSAGE TTS] Processing entire message with streaming: ${enableStreaming}...`);
    
    const requestBody = buildFullMessageRequestBody(message);
    
    // Add streaming flag if enabled
    if (enableStreaming) {
      requestBody.streaming = true;
    }
    
    console.log("[FULL MESSAGE TTS] Request body:", JSON.stringify(requestBody, null, 2));
    
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
    console.log("[FULL MESSAGE TTS] Response received:", data);
    
    if (data.audioContent) {
      console.log(`[FULL MESSAGE TTS] Audio generated successfully, streaming: ${data.streaming || false}, chunks: ${data.chunks || 1}, length: ${data.audioContent.length}`);
      
      // Log performance metrics
      if (data.processing_time) {
        console.log(`[FULL MESSAGE TTS] Processing time: ${data.processing_time}ms`);
      }
      if (data.chunk_times) {
        console.log(`[FULL MESSAGE TTS] Individual chunk times: ${data.chunk_times.join(', ')}ms`);
      }
      
      return data.audioContent;
    } else {
      console.error("[FULL MESSAGE TTS] Failed to generate audio:", data.error || "No audio content in response");
      return null;
    }
    
  } catch (error) {
    console.error("[FULL MESSAGE TTS] Error calling backend TTS API:", error);
    return null;
  }
}


// function buildRequestBody(message) {
//   // Replace all instances of "IVYBEARS®" with "ivy bears"
//   const formattedMessage = message.replace(/IVYBEARS®/g, "ivy bears");

//   languageCode = getLanguageCode(transcriptLanguage);
//   console.log('Translate Body Build Message: ' + formattedMessage);
//   console.log('Translate Body Build Language: ' + languageCode);
//   console.log('Translate Body Build Voice: ' + getGoogleVoice(languageCode));

//   // Return the request body
//   return {
//     input: {
//       text: formattedMessage, // Use the formatted message
//     },
//     voice: {
//       languageCode: languageCode,
//       name: getGoogleVoice(languageCode),
//     },
//     audioConfig: {
//       audioEncoding: "LINEAR16",
//     },
//   };
// }


async function getAudio(requestBody) {
  try {
    console.log("[iOS AUDIO DEBUG] getAudio ENTERED");
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

  $(".voice-timer p:first-child").text(txtLanding[6][localCountryCode]);
  $(".voice-timer .timer-seconds").removeClass("d-none");

  $(".stopRecord.on-bar").addClass("loading");
  $(".stopRecord.outside").addClass("loading-bigger");

  stopAnimation();
  //stopSpeakingAnimation();
  stopAllSpeech();
  setTimeout(doAfterLoad, 200);

  if ($('.png-frame-ai.idle').hasClass("d-none")) {
    // playIdleAnimation();
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
    
    // Check for older Safari versions that might have webkitGetUserMedia
    if (navigator.webkitGetUserMedia) {
      console.log('Using webkitGetUserMedia for older Safari');
      alert('Your Safari version is outdated. Please update Safari or use a different browser for voice recording.');
      return;
    }
    
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

  // Check if we're on HTTP and Safari - Safari requires HTTPS for getUserMedia
  if ((isIOS || isMacSafari) && window.location.protocol !== 'https:') {
    console.error('Safari requires HTTPS for microphone access');
    alert('Voice recording requires a secure connection (HTTPS). Please access this page over HTTPS to use voice recording.');
    return;
  }

  let stream;
  try {
    console.log('Requesting microphone permission...');
    
    // Safari-specific constraints - simpler is better for Safari
    let constraints;
    if (isIOS || isMacSafari) {
      // Safari works better with simple constraints
      constraints = { 
        audio: true, // Simple audio constraint for Safari
        video: false
      };
    } else {
      // Other browsers can handle advanced constraints
      constraints = { 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      };
    }
    
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
    
    // Safari-specific error handling
    if ((isIOS || isMacSafari) && error.name === 'NotImplementedError') {
      console.error('Safari getUserMedia not implemented - may be due to HTTP or old Safari version');
      showNotification("Voice recording is not available. This may be due to: 1) Using HTTP instead of HTTPS, 2) Old Safari version, or 3) Browser restrictions. Please try a different browser or ensure you're using HTTPS.", 'error');
      return;
    }
    
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

     // Check if browser supports getUserMedia
     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       console.error('Browser does not support getUserMedia API');
       
       // Check for older Safari versions that might have webkitGetUserMedia
       if (navigator.webkitGetUserMedia) {
         console.log('Using webkitGetUserMedia for older Safari');
         alert('Your Safari version is outdated. Please update Safari or use a different browser for voice recording.');
         return;
       }
       
       alert('Your browser does not support voice recording. Please try a different browser.');
       return;
     }

     // Check if we're on HTTP and Safari - Safari requires HTTPS for getUserMedia
     if ((isIOS || isMacSafari) && window.location.protocol !== 'https:') {
       console.error('Safari requires HTTPS for microphone access');
       alert('Voice recording requires a secure connection (HTTPS). Please access this page over HTTPS to use voice recording.');
       return;
     }

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
       console.error("Error name:", error.name);
       console.error("Error message:", error.message);
       
       // Safari-specific error handling
       if ((isIOS || isMacSafari) && error.name === 'NotImplementedError') {
         console.error('Safari getUserMedia not implemented - may be due to HTTP or old Safari version');
         alert("Voice recording is not available. This may be due to: 1) Using HTTP instead of HTTPS, 2) Old Safari version, or 3) Browser restrictions. Please try a different browser or ensure you're using HTTPS.");
         return;
       }
       
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
    transcriptLanguage = data.detected_language;
    
    // Trigger the send button to process the transcribed text
    $("#send-btn").trigger("click");
  } catch (error) {
    console.error('Error transcribing audio:', error);
    showNotification(`Transcription error: ${error.message}`);
  }
}






