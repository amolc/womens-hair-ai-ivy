// ==================== LANGUAGE SETTING ====================
// const localLanguage = "EN"; // Set default language to English
console.log("main.js - v12.22");
// ==================== MISSING FILE DETECTION ====================
// Global array to track missing files
window.missingFiles = [];

// Function to check if a file exists
function checkFileExists(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.status === 200);
        }
    };
    xhr.onerror = function() {
        callback(false);
    };
    xhr.timeout = 5000; // 5 second timeout
    xhr.ontimeout = function() {
        callback(false);
    };
    xhr.send();
}

// Function to check all animation files and report missing ones
function checkMissingFiles() {
    console.log('[checkMissingFiles] Starting comprehensive file check...');
    window.missingFiles = []; // Reset missing files list
    
    const filesToCheck = [];
    
    // Define all animation sequences and their expected files
    const animations = [
        {
            name: 'AI Intro',
            totalFrames: 215,
            pathTemplate: `assets/Media/AIIntro/06_AI_Intro_{frame}.webp`,
            audio: [`assets/Media/VO/AIIntro VO.mp3`]
        },
        {
            name: 'AI Idle',
            totalFrames: 350,
            pathTemplate: `assets/Media/AIIdle/06_AI_Idle_{frame}.webp`,
            audio: []
        },
        {
            name: 'AR Intro',
            totalFrames: 540,
            pathTemplate: `assets/Media/${localLanguage}/ARIntro/ARBear_Intro_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARIntro VO.mp3`]
        },
        {
            name: 'AR Idle',
            totalFrames: 300,
            pathTemplate: `assets/Media/${localLanguage}/ARIdle/ARBear_Idle_{frame}.webp`,
            audio: []
        },
        {
            name: 'AR Blower',
            totalFrames: 261,
            pathTemplate: `assets/Media/${localLanguage}/ARBlower/ARBear_Blower_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARBlower VO.mp3`]
        },
        {
            name: 'AR Bench',
            totalFrames: 400,
            pathTemplate: `assets/Media/${localLanguage}/ARBench/ARBear_Bench_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARBench VO.mp3`]
        },
        {
            name: 'AR Dumb Bell',
            totalFrames: 280,
            pathTemplate: `assets/Media/${localLanguage}/ARDumbBell/ARBear_Dumb%20Bell_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARDumbBell VO.mp3`]
        },
        {
            name: 'AR Bag',
            totalFrames: 280,
            pathTemplate: `assets/Media/${localLanguage}/ARBag/ARBear_Bag_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARBag VO.mp3`]
        },
        {
            name: 'AR Nail Polish',
            totalFrames: 387,
            pathTemplate: `assets/Media/${localLanguage}/ARNailPolish/ARBear_Nail%20Polish_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARNailPolish VO.mp3`]
        },
        {
            name: 'AR Mirror',
            totalFrames: 361,
            pathTemplate: `assets/Media/${localLanguage}/ARMirror/ARHair_Mirror_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARMirror VO.mp3`]
        }
    ];
    
    // Build list of files to check
    animations.forEach(animation => {
        // Add frame files
        for (let i = 0; i < animation.totalFrames; i++) {
            const frameNumber = i.toString().padStart(5, '0');
            const framePath = animation.pathTemplate.replace('{frame}', frameNumber);
            filesToCheck.push({
                type: 'image',
                animation: animation.name,
                path: framePath,
                frame: i
            });
        }
        
        // Add audio files
        animation.audio.forEach(audioPath => {
            filesToCheck.push({
                type: 'audio',
                animation: animation.name,
                path: audioPath,
                frame: null
            });
        });
    });
    
    console.log(`[checkMissingFiles] About to check ${filesToCheck.length} files...`);
    
    let checkedCount = 0;
    const totalToCheck = filesToCheck.length;
    
    // Check files with limited concurrency to avoid overwhelming the server
    const batchSize = 10;
    let currentBatch = 0;
    
    function processBatch() {
        const startIdx = currentBatch * batchSize;
        const endIdx = Math.min(startIdx + batchSize, filesToCheck.length);
        
        if (startIdx >= filesToCheck.length) {
            // All batches complete
            console.log(`[checkMissingFiles] File check complete. Missing files: ${window.missingFiles.length}`);
            displayMissingFiles();
            return;
        }
        
        const batchPromises = [];
        
        for (let i = startIdx; i < endIdx; i++) {
            const file = filesToCheck[i];
            batchPromises.push(
                new Promise((resolve) => {
                    checkFileExists(file.path, (exists) => {
                        checkedCount++;
                        if (!exists) {
                            window.missingFiles.push(file);
                            console.warn(`[checkMissingFiles] Missing file: ${file.path}`);
                        }
                        
                        // Progress update
                        if (checkedCount % 50 === 0) {
                            console.log(`[checkMissingFiles] Progress: ${checkedCount}/${totalToCheck} files checked`);
                        }
                        
                        resolve();
                    });
                })
            );
        }
        
        Promise.all(batchPromises).then(() => {
            currentBatch++;
            setTimeout(processBatch, 100); // Small delay between batches
        });
    }
    
    processBatch();
}

// Function to display missing files in a user-friendly way
function displayMissingFiles() {
    if (window.missingFiles.length === 0) {
        console.log('[displayMissingFiles] All files are present!');
        alert('✅ All animation files are present and accessible!');
        return;
    }
    
    console.log(`[displayMissingFiles] Found ${window.missingFiles.length} missing files`);
    
    // Group missing files by animation and type
    const missingByAnimation = {};
    window.missingFiles.forEach(file => {
        if (!missingByAnimation[file.animation]) {
            missingByAnimation[file.animation] = { images: [], audio: [] };
        }
        
        if (file.type === 'image') {
            missingByAnimation[file.animation].images.push(file);
        } else {
            missingByAnimation[file.animation].audio.push(file);
        }
    });
    
    // Build detailed report
    let report = '🚨 MISSING FILES DETECTED\n\n';
    report += `Total missing files: ${window.missingFiles.length}\n\n`;
    
    Object.keys(missingByAnimation).forEach(animation => {
        const missing = missingByAnimation[animation];
        report += `📽️ ${animation}:\n`;
        
        if (missing.images.length > 0) {
            report += `  🖼️ Missing frames: ${missing.images.length}\n`;
            // Show first few and last few missing frames
            if (missing.images.length <= 10) {
                missing.images.forEach(img => {
                    report += `    - Frame ${img.frame}\n`;
                });
            } else {
                // Show first 5 and last 5
                for (let i = 0; i < 5; i++) {
                    report += `    - Frame ${missing.images[i].frame}\n`;
                }
                report += `    ... (${missing.images.length - 10} more frames) ...\n`;
                for (let i = missing.images.length - 5; i < missing.images.length; i++) {
                    report += `    - Frame ${missing.images[i].frame}\n`;
                }
            }
        }
        
        if (missing.audio.length > 0) {
            report += `  🔊 Missing audio files:\n`;
            missing.audio.forEach(audio => {
                report += `    - ${audio.path.split('/').pop()}\n`;
            });
        }
        
        report += '\n';
    });
    
    report += '💡 Recommendations:\n';
    report += '1. Check if the files exist in the correct directory structure\n';
    report += '2. Verify file permissions and server access\n';
    report += '3. Ensure all animation assets have been uploaded\n';
    report += '4. Check browser console for detailed error messages\n';
    
    // Also log to console for detailed debugging
    console.error('[displayMissingFiles] Missing files report:', missingByAnimation);
    
    // Show alert with summary
    alert(report);
}

// Function to check missing files for a specific animation
function checkMissingFilesForAnimation(animationName) {
    console.log(`[checkMissingFilesForAnimation] Checking files for: ${animationName}`);
    
    // Define animation configurations
    const animationConfigs = {
        'AI Intro': {
            totalFrames: 215,
            pathTemplate: `assets/Media/AIIntro/06_AI_Intro_{frame}.webp`,
            audio: [`assets/Media/VO/AIIntro VO.mp3`]
        },
        'AI Idle': {
            totalFrames: 350,
            pathTemplate: `assets/Media/AIIdle/06_AI_Idle_{frame}.webp`,
            audio: []
        },
        'AR Intro': {
            totalFrames: 540,
            pathTemplate: `assets/Media/${localLanguage}/ARIntro/ARBear_Intro_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARIntro VO.mp3`]
        },
        'AR Idle': {
            totalFrames: 300,
            pathTemplate: `assets/Media/${localLanguage}/ARIdle/ARBear_Idle_{frame}.webp`,
            audio: []
        },
        'AR Blower': {
            totalFrames: 261,
            pathTemplate: `assets/Media/${localLanguage}/ARBlower/ARBear_Blower_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARBlower VO.mp3`]
        },
        'AR Nail Polish': {
            totalFrames: 387,
            pathTemplate: `assets/Media/${localLanguage}/ARNailPolish/ARBear_Nail%20Polish_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARNailPolish VO.mp3`]
        },
        'AR Mirror': {
            totalFrames: 361,
            pathTemplate: `assets/Media/${localLanguage}/ARMirror/ARHair_Mirror_{frame}.webp`,
            audio: [`assets/Media/${localLanguage}/ARVO/ARMirror VO.mp3`]
        },
        'AR Gift': {
            totalFrames: 170,
            pathTemplate: `assets/Media/${localLanguage}/ARGift/ARBear_Gift_{frame}.webp`,
            audio: []
        }
    };
    
    const config = animationConfigs[animationName];
    if (!config) {
        alert(`Unknown animation: ${animationName}`);
        return;
    }
    
    const filesToCheck = [];
    
    // Add frame files
    for (let i = 0; i < config.totalFrames; i++) {
        const frameNumber = i.toString().padStart(5, '0');
        const framePath = config.pathTemplate.replace('{frame}', frameNumber);
        filesToCheck.push({
            type: 'image',
            animation: animationName,
            path: framePath,
            frame: i
        });
    }
    
    // Add audio files
    config.audio.forEach(audioPath => {
        filesToCheck.push({
            type: 'audio',
            animation: animationName,
            path: audioPath,
            frame: null
        });
    });
    
    console.log(`[checkMissingFilesForAnimation] Checking ${filesToCheck.length} files for ${animationName}...`);
    
    let missingCount = 0;
    let checkedCount = 0;
    const missingFiles = [];
    
    filesToCheck.forEach(file => {
        checkFileExists(file.path, (exists) => {
            checkedCount++;
            if (!exists) {
                missingCount++;
                missingFiles.push(file);
                console.warn(`[checkMissingFilesForAnimation] Missing: ${file.path}`);
            }
            
            if (checkedCount === filesToCheck.length) {
                // All files checked
                console.log(`[checkMissingFilesForAnimation] Check complete for ${animationName}. Missing: ${missingCount}/${filesToCheck.length}`);
                
                if (missingCount === 0) {
                    alert(`✅ All files for ${animationName} are present!`);
                } else {
                    let report = `🚨 Missing files for ${animationName}:\n\n`;
                    report += `Total missing: ${missingCount}/${filesToCheck.length}\n\n`;
                    
                    const missingImages = missingFiles.filter(f => f.type === 'image');
                    const missingAudio = missingFiles.filter(f => f.type === 'audio');
                    
                    if (missingImages.length > 0) {
                        report += `🖼️ Missing frames: ${missingImages.length}\n`;
                        if (missingImages.length <= 10) {
                            missingImages.forEach(img => {
                                report += `  - Frame ${img.frame}\n`;
                            });
                        } else {
                            for (let i = 0; i < 5; i++) {
                                report += `  - Frame ${missingImages[i].frame}\n`;
                            }
                            report += `  ... (${missingImages.length - 10} more) ...\n`;
                            for (let i = missingImages.length - 5; i < missingImages.length; i++) {
                                report += `  - Frame ${missingImages[i].frame}\n`;
                            }
                        }
                        report += '\n';
                    }
                    
                    if (missingAudio.length > 0) {
                        report += `🔊 Missing audio files:\n`;
                        missingAudio.forEach(audio => {
                            report += `  - ${audio.path.split('/').pop()}\n`;
                        });
                    }
                    
                    alert(report);
                }
            }
        });
    });
}

// Wrapper functions to check missing files before playing animations
function playAnimationWithCheck() {
    checkMissingFilesForAnimation('AI Intro');
}

function playIdleAnimationWithCheck() {
    checkMissingFilesForAnimation('AI Idle');
}

function playArIntroAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Intro');
}

function playArIdleAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Idle');
}

function playArBlowerAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Blower');
}

function playArBenchAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Bench');
}

function playArDumbBellAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Dumb Bell');
}

function playArBagAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Bag');
}

function playArNailPolishAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Nail Polish');
}

function playArMirrorAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Mirror');
}

function playArGiftAnimationWithCheck() {
    checkMissingFilesForAnimation('AR Gift');
}

// ==================== LOADING ====================
// Detect when the page is loaded from cache
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.log("Page loaded from cache, reloading...");

        // Show a blank overlay to hide the old content
        const overlay = document.getElementById("reloading-overlay");
        overlay.style.display = "flex";

        // Reload the page
        window.location.reload();
    }
});

// Prevent caching by appending a timestamp to the URL
// if (!window.performance.getEntriesByType("navigation")[0].type.includes("reload")) {
//     const url = new URL(window.location.href);
//     url.searchParams.set("t", Date.now());
//     history.replaceState(null, "", url.toString());
// }

// ==================== SET CUSTOM HEIGHT OF THE MAIN CONTAINER ====================
function setVh() {
    // Get the actual viewport height
    let vh = window.innerHeight;
    // Set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call the function once to set the initial value
setVh();

// Listen to the resize and orientationchange events and call the function again
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);


// ==================== OPEN CAMERA AND MIC ON CLICK ====================
// Function to start the camera
var cameraPrompt = $(".camera-prompt");
var arAnimation = $(".ar-into-animation");
var mainContainer = $(".main-container");
var aiChat = $(".ai-chat ");
var aiVO = $("#ai-vo")[0];
var aiMusic = $("#ai-music")[0];
var aiMusic2 = $("#ai-music-2")[0];
var dummySound = $("#dummy-sound")[0];

var arIntro = $("#ar-intro")[0];
var arGift = $("#ar-gift")[0];
var arBlower = $("#ar-blower")[0];
var arNailPolish = $("#ar-nail-polish")[0];
var arMirror = $("#ar-mirror")[0];

// AUDIO INITIALIZATION DEBUGGING
console.log("=== AUDIO INITIALIZATION DEBUG ===");
console.log("aiVO element found:", !!aiVO);
console.log("aiMusic element found:", !!aiMusic);
console.log("aiMusic2 element found:", !!aiMusic2);

if (aiVO) {
    console.log("aiVO.src:", aiVO.src);
    console.log("aiVO.id:", aiVO.id);
    console.log("aiVO.tagName:", aiVO.tagName);
}

if (aiMusic) {
    console.log("aiMusic.src:", aiMusic.src);
    console.log("aiMusic.id:", aiMusic.id);
    console.log("aiMusic.tagName:", aiMusic.tagName);
}

if (aiMusic2) {
    console.log("aiMusic2.src:", aiMusic2.src);
    console.log("aiMusic2.id:", aiMusic2.id);
    console.log("aiMusic2.tagName:", aiMusic2.tagName);
}

// Check if audio elements exist in DOM
console.log("Checking DOM for audio elements:");
console.log("document.getElementById('ai-vo'):", document.getElementById('ai-vo'));
console.log("document.getElementById('ai-music'):", document.getElementById('ai-music'));
console.log("document.getElementById('ai-music-2'):", document.getElementById('ai-music-2'));

// Test loading the audio files
console.log("=== TESTING AUDIO FILE LOADING ===");
if (aiVO && aiVO.src) {
    console.log("Testing aiVO file:", aiVO.src);
    fetch(aiVO.src, { method: 'HEAD' })
        .then(response => {
            console.log("aiVO file status:", response.status, response.statusText);
            console.log("aiVO file headers:", response.headers.get('content-type'));
        })
        .catch(error => {
            console.error("aiVO file error:", error.message);
        });
}

if (aiMusic && aiMusic.src) {
    console.log("Testing aiMusic file:", aiMusic.src);
    fetch(aiMusic.src, { method: 'HEAD' })
        .then(response => {
            console.log("aiMusic file status:", response.status, response.statusText);
            console.log("aiMusic file headers:", response.headers.get('content-type'));
        })
        .catch(error => {
            console.error("aiMusic file error:", error.message);
        });
}


function enableMic() {
    recognition.start();

    setTimeout(offMic, 100);
    function offMic() {
        recognition.stop();
    }
}

async function enableCamera() {
    console.log("=== enableCamera: start ===");
    $(".loading-container").removeClass("d-none");
    console.log("Loading container shown");
    
    // Initialize AR loadedAudio if not set
    if (typeof window.arloadedAudio === 'undefined') {
        window.arloadedAudio = 0;
    }
    
    // Initialize AR-specific audio counter if not set
    if (typeof window.arloadedAudio === 'undefined') {
        window.arloadedAudio = 0;
    }
    if (typeof window.ailoadedImages === 'undefined') {
        window.ailoadedImages = 0;
    }
    
    console.log("Initial values:", {
        loadedAudio: window.loadedAudio,
        ailoadedImages: window.ailoadedImages,
        aiOverrideTotalImages: window.aiOverrideTotalImages,
        aiTotalAudio: window.aiTotalAudio
    });
    
    loadAiAnimations();
    console.log("loadAiAnimations called");
}



// $('.click-camera').on('click', enableCamera);

window.addEventListener("load", function() {
    console.log("Page has loaded!");
    enableCamera();
    // Your code here runs after the entire page loads
});



// $(".click-camera").click(function () {
   
// });



// ==================== AFTER ACCESS OPEN ELEMENTS ====================
// open this after all permissions are granted
function afterAccess() {
    $(".custom-popup").addClass("d-none");
    // ---------- CUSTOM CALLS ----------
    // $(".splash-page").removeClass("d-none");
    $(".all-prompts-container").addClass("d-none");
    // $(".splash-page")[0].play();
    // cameraPrompt.addClass("d-none");
    mainContainer.addClass("no-bg");

    setTimeout(doAfterLoad500, 500);
    
    function doAfterLoad500() {
          aiChat.removeClass("d-none");
        // setTimeout(doAfterLoad1000, 1000);
        // function doAfterLoad1000() {
        // $(".splash-page").addClass("d-none");
        // $(".splash-page")[0].pause();

        $(".ivybears-header").removeClass("d-none");

        $('.suggestions-slider').slick({ // Slick slider options 
            dots: false,
            arrows: false,
            // infinite: true,
            speed: 300,
            slidesToShow: 1,
            touchThreshold: 10,
            variableWidth: true, // Allow different widths
            swipeToSlide: true, // Enable free scrolling effect

        });
        }

        // AUDIO DEBUGGING
        console.log("[AUDIO DEBUG] aiMusic element:", aiMusic);
        console.log("[AUDIO DEBUG] aiVO element:", aiVO);
        if (aiMusic) {
            console.log("[AUDIO DEBUG] aiMusic.src:", aiMusic.src);
            console.log("[AUDIO DEBUG] aiMusic.readyState:", aiMusic.readyState);
            console.log("[AUDIO DEBUG] aiMusic.networkState:", aiMusic.networkState);
            console.log("[AUDIO DEBUG] aiMusic.error:", aiMusic.error);
        }
        if (aiVO) {
            console.log("[AUDIO DEBUG] aiVO.src:", aiVO.src);
            console.log("[AUDIO DEBUG] aiVO.readyState:", aiVO.readyState);
            console.log("[AUDIO DEBUG] aiVO.networkState:", aiVO.networkState);
            console.log("[AUDIO DEBUG] aiVO.error:", aiVO.error);
        }

        aiMusic.pause();
        aiMusic.currentTime = 0;
        aiMusic.play();
        aiVO.pause();
        aiVO.currentTime = 0;
        // $('.png-frame-ai.intro').removeClass("d-none");
        // $('.png-frame-ai.idle').addClass("d-none");

}

// ==================== BACK BUTTON ====================
$(".ivybears-header .back-button").click(function () {
    // CUSTOM CALL AFTER BACK
    $(".hold-to-speak.outside").removeClass("op-0-1");
    $(".hold-to-speak.outside").addClass("startVoice");
    $(".ai-chat .menu-container").removeClass("menu-done");
    $(".chatbot_inner_2").addClass("d-none");
    $(".mic-guide").addClass("d-none");
    $(".suggestions-slider").removeClass("d-none");
    $(".chatbot__box").addClass("op-0");
    $(".ivybears-header .back-button").addClass("d-none");
    // $('.suggestions-slider').slick('reinit');
    // stopAllSpeech();
    // $(".sound-toggle.off").removeClass("d-none");
    // $(".sound-toggle.on").addClass("d-none");
    $(".chatbot__chat.incoming").removeClass("listen-text");
    $(".sound-toggle.off").removeClass("d-none");
    $(".sound-toggle.on").addClass("d-none");
    stopAllSpeech();
    stopAnimation();

    // WITH CHAT
    $(".name-title").removeClass("op-0-1-none");
    $(".ai-chat .menu-container").removeClass("d-none");
    $(".ai-chat").removeClass("with-chat");
    $(".animation-sequence-container").removeClass("with-chat");
    $(".chatbot-content").removeClass("with-chat");
    $(".chatbot__box").removeClass("with-chat");

    $('.suggestions-slider').slick({ // Slick slider options 
        dots: false,
        arrows: false,
        // infinite: true,
        speed: 300,
        slidesToShow: 1,
        touchThreshold: 10,
        variableWidth: true, // Allow different widths
        swipeToSlide: true, // Enable free scrolling effect

    });
});

// ==================== PLUS ICON ====================
$(".plus-icon").click(function () {
    $(".plus-content").toggleClass("d-none");
});

// ==================== CLICK TO PLAY CHANGE CONTENT ====================
var clickToPlay = 0;
var timeOutPop = 0;
var timeOutPop1 = 0;
var timeOutPopAudio = 0;

var popWhole;
$(document).ready(function() {
    popWhole = $("#pop-whole")[0];
    if (popWhole) {
        popWhole.load();
    }
});



function conditionalArLoader() {
    return new Promise((resolve, reject) => {
        console.log("[conditionalArLoader] Starting AR loading");
        window.arloadedImages = 0;
    window.loadedAudio = 0;
    window.arloadedAudio = 0;
        console.log("[conditionalArLoader] Initial state:", {
            arloadedImages: window.arloadedImages,
            loadedAudio: window.loadedAudio,
            arloadedAudio: window.arloadedAudio,
            arLoadingComplete: window.arLoadingComplete
        });
        
        if (areArAssetsReady()) {
            console.log("[AR]  all assets cached – skip loader");
            window.arLoadingComplete = true;
            resolve({ success: true, cached: true, message: "AR assets already loaded" });
            return;
        }
        
        console.log("[AR]  missing assets – show loader");
        // reveal the loader bar (it will be hidden by updateLoadingBar when ≥ 98 %)
        $(".popup-container").removeClass("d-none");   // the element that actually holds the bar
        $(".loading-container").removeClass("d-none");  // extra safety – both can be un-hidden
        $(".loading-container-aranimation").removeClass("d-none"); // Make the new loading container visible
        // reset bar to 0 % visually
        const bar = document.getElementById("loading-bar");
        const txt = document.querySelector(".loading-percentage");
        if (bar) bar.style.width = "0%";
        if (txt) txt.textContent = "0%";
        $(".click-to-play").removeClass("op-0-1");
        
        console.log("[conditionalArLoader] Starting AR loading process...");
        
        // Store the resolve function so updateLoadingBar can call it when complete
        window.arLoadingResolve = resolve;
        window.arLoadingReject = reject;
        
        
        // No timeout - loading will continue indefinitely until complete
        
        loadArAnimations();
        loadArAudio();
    });
}


/* ---------- conditional AR loader ---------- */
function areArAssetsReady() {
    // fast sanity-check: if any AR image array is empty or the first frame is not yet
    // decoded we treat the whole bundle as "not ready"
    console.log("[AR] Checking if AR assets are ready...");
    const arArrays = [arIntroImages, arMirrorImages, arNailPolishImages, arBlowerImages, arGiftImages];
    const audioEls = [arIntro, arMirror, arNailPolish, arBlower, arGift];
    
    console.log("[AR] Image arrays:", arArrays.map(arr => ({ length: arr.length, firstComplete: arr[0]?.complete })));
    console.log("[AR] Audio elements:", audioEls.map(el => ({ exists: !!el, readyState: el?.readyState })));

    const imagesReady = arArrays.every(arr => arr.length > 0 && arr[0].complete && arr[0].naturalHeight !== 0);
    const audioReady  = audioEls.every(el => el && el.readyState >= 2);   // HAVE_CURRENT_DATA
    console.log("[AR] Assets ready - images:", imagesReady, "audio:", audioReady);
    return imagesReady && audioReady;
}


// Utility function to check if AR loading is complete
function isArLoadingComplete() {
    return window.arLoadingComplete || areArAssetsReady();
}

// Utility function to get AR loading status
function getArLoadingStatus() {
    const bar = document.getElementById("loading-bar");
    const progress = bar ? parseInt(bar.style.width) || 0 : 0;
    
    return {
        complete: isArLoadingComplete() || progress >= 97,
        progress: progress,
        cached: areArAssetsReady(),
        loadingInProgress: window.arLoadingResolve !== undefined
    };
}
$(".click-to-play").click(function () {

    
    stopAnimation();
    stopIdleAnimation();
    // $(".popup-container").removeClass("d-none");   // the element that actually holds the bar
    // $(".loading-container").removeClass("d-none");  // extra safety – both can be un-hidden
    
    setTimeout(doAfterLoad, 500);
    function doAfterLoad() {
        $(".ai-chat").addClass("d-none");
        $(".ar-into-animation").removeClass("op-0");
        $(".ar-into-animation").addClass("op-1");
        $('.suggestions-slider').slick('unslick');
        $(".click-to-play").addClass("op-0");
    }
    $(".chatbot__chat.incoming").removeClass("listen-text");
    $(".sound-toggle.off").removeClass("d-none");
    $(".sound-toggle.on").addClass("d-none");
   
    // aiMusic2.currentTime = 0;
    // aiMusic2.play();
   
    $(".hold-to-speak.outside").removeClass("op-0-1");
    $(".hold-to-speak.outside").addClass("startVoice");
    $(".ai-chat .menu-container").removeClass("menu-done");
    $(".chatbot_inner_2").addClass("d-none");
    $(".mic-guide").addClass("d-none");
    $(".suggestions-slider").removeClass("d-none");
    $(".chatbot__box").addClass("op-0");

    $(".ai-chat").removeClass("op-1");
    $(".ai-chat").addClass("op-0");
    $(".ar-into-animation").removeClass("d-none");
    $(".ar-into-animation .back-button").removeClass("d-none");
    $(".ar-into-animation .back-button").removeClass("op-0-1");
    
    $(".ar-into-animation .back-button").click(function () {
        $(".ar-into-animation").removeClass("op-1");
        $(".ar-into-animation").addClass("op-0");
        $(".ar-into-animation .back-button").addClass("d-none");
        stopAllAr();
        setTimeout(doAfterLoad, 500);
        function doAfterLoad() {
            $(".ai-chat").removeClass("d-none");
            $(".ar-into-animation").addClass("d-none");
            $(".click-to-play").addClass("op-0-1");
            playIdleAnimation();

        }
    });

    console.log("[AR] Starting conditionalArLoader...");
    conditionalArLoader().then((result) => {
        if (result.success) {
            // AR assets are ready - start the animations
        setTimeout(doAfterLoad502, 50);
        function doAfterLoad502() {
            console.log("doafter502-Ar Animation Started");
            $(".png-sequence-ar").removeClass("d-none");
            stopAnimation();
            stopIdleAnimation();
            playArIntroAnimation();
        }
        }
        console.log("[AR] Assets loaded successfully, starting animations...");

        popWhole.load();
        popWhole.currentTime = 0;
        popWhole.play();

        aiMusic2.load();
        aiMusic2.currentTime = 0;
        aiMusic2.play();

        timeOutPop = setTimeout(delayPop, 5000);
        function delayPop() {

            $(".gadget-container .gadget-item:nth-child(1)").removeClass("op-0-1-none");
            $(".gadget-container .gadget-item:nth-child(1)").addClass("pop-item");

            timeOutPop1 = setTimeout(delayPop1, 150);
            function delayPop1() {
                $(".gadget-container .gadget-item:nth-child(2)").removeClass("op-0-1-none");
                $(".gadget-container .gadget-item:nth-child(2)").addClass("pop-item");

                timeOutPop1 = setTimeout(delayPop1, 150);
                function delayPop1() {
                    $(".gadget-container .gadget-item:nth-child(3)").removeClass("op-0-1-none");
                    $(".gadget-container .gadget-item:nth-child(3)").addClass("pop-item");

                    timeOutPop1 = setTimeout(delayPop1, 150);
                    function delayPop1() {
                        $(".gadget-container .gadget-item:nth-child(4)").removeClass("op-0-1-none");
                        $(".gadget-container .gadget-item:nth-child(4)").addClass("pop-item");

                        timeOutPop1 = setTimeout(delayPop1, 150);
                        function delayPop1() {
                            $(".menu-items .ask-me-anyting").removeClass("op-0-1-none");
                            $(".menu-items .ask-me-anyting").addClass("pop-item");

                        }
                    }

                }
            }
        
        }

        
       
       
    }).catch((error) => {
        console.error("[AR] Loading failed:", error);
        // Handle loading failure - maybe show an error message to the user
        alert("Failed to load AR assets: " + (error.message || "Unknown error"));
    });

     console.log("[AR] Loading result:", result);
        
      

  
    
       
    
});

function stopAllAr() {
    stopArIntroAnimation();
    stopArIdleAnimation();
    stopArGiftAnimation();
    stopArBlowerAnimation();
    stopArNailPolishAnimation();
    stopArMirrorAnimation();
}

// ==================== CLICK GIFT ====================
$(".gadget-container .gadget-item:nth-child(1) .no-glow").click(function () {
    stopArIntroAnimation();
    stopArIdleAnimation();
    playArGiftAnimation();
    stopArBlowerAnimation();
    stopArNailPolishAnimation();
    stopArMirrorAnimation();
    // setTimeout(doAfterLoad1, 1);
    // function doAfterLoad1() {
    // }
});

// ==================== CLICK BLOWER ====================
$(".gadget-container .gadget-item:nth-child(2) .no-glow").click(function () {
    stopArIntroAnimation();
    stopArIdleAnimation();
    stopArGiftAnimation();
    playArBlowerAnimation();
    stopArNailPolishAnimation();
    stopArMirrorAnimation();
});

// ==================== CLICK NAIL POLISH ====================
$(".gadget-container .gadget-item:nth-child(3) .no-glow").click(function () {
    stopArIntroAnimation();
    stopArIdleAnimation();
    stopArGiftAnimation();
    stopArBlowerAnimation();
    playArNailPolishAnimation();
    stopArMirrorAnimation();
});

// ==================== CLICK MIRROR ====================
$(".gadget-container .gadget-item:nth-child(4) .no-glow").click(function () {
    stopArIntroAnimation();
    stopArIdleAnimation();
    stopArGiftAnimation();
    stopArBlowerAnimation();
    stopArNailPolishAnimation();
    playArMirrorAnimation();
});


// ==================== ASK ME ANYTHING CHANGE CONTENT ====================
$(".ask-me-anyting").click(function () {
    // $(".ivybears-header").removeClass("d-none");
    $(".ar-into-animation").removeClass("op-1");
    $(".ar-into-animation").addClass("op-0");
    $(".ai-chat").removeClass("d-none");
    playIdleAnimation();
    stopAllAr();
    aiMusic2.pause();
    // $('.suggestions-slider').slick('reinit');
    setTimeout(doAfterLoad, 500);
    function doAfterLoad() {
        $(".ar-into-animation").addClass("d-none");
        $(".ai-chat").removeClass("op-0");
        $(".ai-chat").addClass("op-1");
        $(".tap-to-learn-container").removeClass("d-none");
    }

    $('.suggestions-slider').slick({ // Slick slider options 
        dots: false,
        arrows: false,
        // infinite: true,
        speed: 300,
        slidesToShow: 1,
        touchThreshold: 10,
        variableWidth: true, // Allow different widths
        swipeToSlide: true, // Enable free scrolling effect

    });
});

// ==================== REMOVE ACCIDENTAL CLICK ON SLICK SLIDER ====================
let startX, startY;
$(".suggestions-box").on('mousedown touchstart', function (event) {
    startX = event.pageX || event.originalEvent.touches[0].pageX;
    startY = event.pageY || event.originalEvent.touches[0].pageY;
});

$(".suggestions-box").click(function (event) {
    const endX = event.pageX || event.originalEvent.changedTouches[0].pageX;
    const endY = event.pageY || event.originalEvent.changedTouches[0].pageY;

    // Check if the movement is significant enough to be considered a drag
    if (Math.abs(startX - endX) < 10 && Math.abs(startY - endY) < 10) {
        var childTextValues = $(this).children().map(function () {
            return $(this).text();
        }).get().join(' ');

        $('.chatbot__textarea').val(childTextValues);
        $("#send-btn").trigger("click");

        $(".suggestions-slider").addClass("d-none");
    }
});


// ==================== MAKE SUGGESTION BOXES SAME HEIGHT ====================
// all height the same
function suggestionBoxHeight() {
    //COPY MAX HEIGHT
    $(".suggestions-text").css("height", "auto");
    var maxHeight = 0;
    $('.suggestions-text').each(function () {
        var height = $(this).outerHeight();
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
    // Set the maximum height to all divs
    $('.suggestions-text').css('height', maxHeight + 'px');
}
suggestionBoxHeight();

// Recalculate the height when the SLICK SLIDER position changes
$('.suggestions-slider').on('setPosition', function () {
    suggestionBoxHeight();
});


// ==================== AR BUTTON ANIMATIONS ====================
$(".no-glow").click(function () {
    $(this).addClass("d-none");
    $(this).parent().find(".with-glow").removeClass("d-none");

    $(this).parent().addClass("animation-select");
    $(this).parent().siblings().removeClass("animation-select");

    $(this).parent().siblings().find(".with-glow").addClass("d-none");
    $(this).parent().siblings().find(".no-glow").removeClass("d-none");

    $(".tap-to-learn-container").addClass("d-none");
});

// ==================== PNG SEQUENCE ====================
var introStart = 0;

// --------------- INTRO ANIMATION ---------------
let pngSeqframe = 0;
const totalFrames = 180; // Total frames from 00000 to 00180
const frameRate = 1000 / 30; // 30 frames per second
let pngSeqInterval;
const images = [];


function playAnimation() {
    console.log("playAnimation triggered");
    
    // Add delay to ensure DOM is ready
    setTimeout(function() {
        const aiIntroImg = document.getElementById('aiIntroImg');
        console.log("[AI INTRO] Image element:", aiIntroImg);
        console.log("[AI INTRO] Image src before:", aiIntroImg?.src);
        
        if (!aiIntroImg) {
            console.error("[AI INTRO] ERROR: aiIntroImg element not found!");
            return;
        }
        
        console.log("[AI INTRO] Image display:", window.getComputedStyle(aiIntroImg).display);
        console.log("[AI INTRO] Image visibility:", window.getComputedStyle(aiIntroImg).visibility);
        console.log("[AI INTRO] Image opacity:", window.getComputedStyle(aiIntroImg).opacity);
        console.log("[AI INTRO] Image width:", window.getComputedStyle(aiIntroImg).width);
        console.log("[AI INTRO] Image height:", window.getComputedStyle(aiIntroImg).height);
        
        // Check container visibility
        const container = document.querySelector('.png-frame-ai.intro');
        console.log("[AI INTRO] Container:", container);
        if (container) {
            console.log("[AI INTRO] Container display:", window.getComputedStyle(container).display);
            console.log("[AI INTRO] Container visibility:", window.getComputedStyle(container).visibility);
            console.log("[AI INTRO] Container opacity:", window.getComputedStyle(container).opacity);
            console.log("[AI INTRO] Container has d-none class:", container.classList.contains('d-none'));
        }
        
        // Force show the container and image for debugging
        if (container) {
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            container.classList.remove('d-none');
        }
        aiIntroImg.style.display = 'block';
        aiIntroImg.style.visibility = 'visible';
        aiIntroImg.style.opacity = '1';
        
        // Test if webp files are accessible on production
        console.log("[AI INTRO] Testing webp file accessibility...");
        const testFrame = 'assets/Media/AiIntro/Intro%20Animation%20V2_00000.webp';
        fetch(testFrame, { method: 'HEAD' })
            .then(response => {
                console.log(`[AI INTRO] Test frame ${testFrame} - Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
            })
            .catch(error => {
                console.error(`[AI INTRO] Test frame ${testFrame} - Error:`, error);
            });
        
        pngSeqInterval = setInterval(function () {
            if (pngSeqframe < totalFrames) {
                const framePath = `assets/Media/AiIntro/Intro%20Animation%20V2_${pngSeqframe.toString().padStart(5, '0')}.webp`;
                // console.log(`[AI INTRO] Loading frame ${pngSeqframe}/${totalFrames}: ${framePath}`);
                aiIntroImg.src = framePath;
                
                // Check if image loads successfully
                aiIntroImg.onload = function() {
                    console.log(`[AI INTRO] Frame ${pngSeqframe} loaded successfully`);
                    console.log(`[AI INTRO] Image dimensions: ${this.naturalWidth}x${this.naturalHeight}`);
                    console.log(`[AI INTRO] Image display after load:`, window.getComputedStyle(aiIntroImg).display);
                };
                aiIntroImg.onerror = function() {
                    console.error(`[AI INTRO] Failed to load frame ${pngSeqframe}: ${framePath}`);
                };
                
                pngSeqframe++;
            } else {
                introStart += 1;
                pngSeqframe = 0;
                clearInterval(pngSeqInterval);
                console.log("[AI INTRO] Animation complete, starting idle animation");
                playIdleAnimation();
                setTimeout(function() {
                    $('.png-frame-ai.intro').addClass("d-none");
                    $('.png-frame-ai.idle').removeClass("d-none");
                }, 200);
                // aiVO.play();
                // aiMusic.pause();
            }
        }, frameRate);
    }, 500); // 500ms delay to ensure DOM is ready
}

function stopAnimation() {
    clearInterval(pngSeqInterval);
    pngSeqframe = 0;
    aiMusic.pause();
    aiVO.pause();
}


// --------------- IDLE ANIMATION ---------------
let idleFrame = 0;
const idleTotalFrames = 210; // Set total frames for idle animation
const idleFrameRate = 1000 / 30; // Adjust frame rate for idle animation
let idleInterval;
const idleImages = [];

function playIdleAnimation() {
    const aiIdleImg = document.getElementById('aiIdleImg');
    idleFrame = 0;
    console.log("[AI IDLE] Starting idle animation");
    idleInterval = setInterval(function () {
        if (idleFrame < idleTotalFrames) {
            const framePath = `assets/Media/AiIdle/Idle%20Animation%20V2%20${idleFrame.toString().padStart(5, '0')}.webp`;
            // console.log(`[AI IDLE] Loading frame ${idleFrame}/${idleTotalFrames}: ${framePath}`);
            aiIdleImg.src = framePath;
            idleFrame++;
        } else {
            console.log("[AI IDLE] Looping animation - resetting to frame 0");
            // idleFrame = 0; // Reset for looping animation
        }
    }, idleFrameRate);
}

function stopIdleAnimation() {
    clearInterval(idleInterval);
    idleFrame = 0;
}


// --------------- AR INTRO ANIMATION ---------------
let arIntroFrame = 0;
const arIntroTotalFrames = 280; // Set total frames for AR intro animation
const arIntroFrameRate = 1000 / 30; // Adjust frame rate for AR intro animation
let arIntroInterval;
const arIntroImages = [];

function playArIntroAnimation() {
    const arIntroImg = document.getElementById('arIntroImg');
    arIntro.play();

    if (window.arIntro && arIntro.readyState >= 2) {
            arIntro.play().catch(e => {
            console.log("arIntro delayed play failed:", e);
            });
    }
    if (window.arIntro && arIntro.readyState >= 2) {
        console.log("arIntro - playing." )
            arIntro.play().catch(function(e){ console.log('arIntro  play failed:', e); });
    }

    arIntroInterval = setInterval(function () {
        if (arIntroFrame < arIntroTotalFrames) {
            arIntroImg.src = `assets/Media/${localLanguage}/ARIntro/ARHair_Intro_${arIntroFrame.toString().padStart(5, '0')}.webp`;
            arIntroFrame++;
        } else {
            stopArIntroAnimation();
            playArIdleAnimation();
        }
    }, arIntroFrameRate);
}


function stopArIntroAnimation() {
    $('.png-frame-ar.intro').addClass("d-none");
    clearInterval(arIntroInterval);
    arIntroFrame = 0;
    arIntro.pause();
}

// --------------- AR IDLE ANIMATION ---------------
let arIdleFrame = 0;
const arIdleTotalFrames = 261; // Set total frames for AR idle animation
const arIdleFrameRate = 1000 / 30; // Adjust frame rate for AR idle animation
let arIdleInterval;
const arIdleImages = [];

function playArIdleAnimation() {
    $('.png-frame-ar.idle').removeClass("d-none");
    const arIdleImg = document.getElementById('arIdleImg');
    arIdleInterval = setInterval(function () {
        if (arIdleFrame < arIdleTotalFrames) {
            arIdleImg.src = `assets/Media/${localLanguage}/ARIdle/ARBear_Idle_${arIdleFrame.toString().padStart(5, '0')}.webp`;
            arIdleFrame++;
        } else {
            arIdleFrame = 0; // Reset for looping animation
        }
    }, arIdleFrameRate);
}


function stopArIdleAnimation() {
    $('.png-frame-ar.idle').addClass("d-none");
    clearInterval(arIdleInterval);
    arIdleFrame = 0;
}

// --------------- AR GIFT ANIMATION ---------------
let arGiftFrame = 0;
const arGiftTotalFrames = 191; // Set total frames for AR gift animation
const arGiftFrameRate = 1000 / 30; // Adjust frame rate for AR gift animation
let arGiftInterval;
const arGiftImages = [];

var timeoutGift = 0;

function playArGiftAnimation() {
    arGiftFrame = 0;
    clearInterval(arGiftInterval);
    $('.png-frame-ar.gift').removeClass("d-none");
    arGift.currentTime = 0;
    timeoutGift = setTimeout(function() {
        arGift.play();
    }, 1300);

    const arGiftImg = document.getElementById('arGiftImg');
    arGiftInterval = setInterval(function () {
        if (arGiftFrame < arGiftTotalFrames) {
            arGiftImg.src = `assets/Media/${localLanguage}/ARGift/ARBear_Gift_${arGiftFrame.toString().padStart(5, '0')}.webp`;

            arGiftFrame++;
            if (arGiftFrame == 170) {
                $(".shop-now-popup").removeClass("op-0-1");
            }
        }
        else {
            stopArGiftAnimation();
            playArIdleAnimation();
        }
    }, arGiftFrameRate);
}

function stopArGiftAnimation() {
    $('.png-frame-ar.gift').addClass("d-none");
    clearInterval(arGiftInterval);
    arGiftFrame = 0;
    arGift.pause();
    clearTimeout(timeoutGift);

    $(".gadget-container .gadget-item:nth-child(1)").removeClass("animation-select");
    $(".gadget-container .gadget-item:nth-child(1) .with-glow").addClass("d-none");
    $(".gadget-container .gadget-item:nth-child(1) .no-glow").removeClass("d-none");
}

$(".shop-now-popup .close-popup").click(function () {
    $(".shop-now-popup").addClass("op-0-1");
});

// --------------- AR BLOWER ANIMATION ---------------
let arBlowerFrame = 0;
const arBlowerTotalFrames = 261; // Set total frames for AR blower animation
const arBlowerFrameRate = 1000 / 30; // Adjust frame rate for AR blower animation
let arBlowerInterval;
const arBlowerImages = [];


function playArBlowerAnimation() {
    arBlowerFrame = 0;
    clearInterval(arBlowerInterval);
    $('.png-frame-ar.blower').removeClass("d-none");
    arBlower.currentTime = 0;
    arBlower.play();

    const arBlowerImg = document.getElementById('arBlowerImg');
    arBlowerInterval = setInterval(function () {
        if (arBlowerFrame < arBlowerTotalFrames) {
            arBlowerImg.src = `assets/Media/${localLanguage}/ARBlower/ARBear_Blower_${arBlowerFrame.toString().padStart(5, '0')}.webp`;

            arBlowerFrame++;
        }
        else {
            stopArBlowerAnimation();
            playArIdleAnimation();
        }
    }, arBlowerFrameRate);
}


function stopArBlowerAnimation() {
    $('.png-frame-ar.blower').addClass("d-none");
    clearInterval(arBlowerInterval);
    arBlowerFrame = 0;
    arBlower.pause();

    $(".gadget-container .gadget-item:nth-child(2)").removeClass("animation-select");
    $(".gadget-container .gadget-item:nth-child(2) .with-glow").addClass("d-none");
    $(".gadget-container .gadget-item:nth-child(2) .no-glow").removeClass("d-none");
}


// --------------- AR NAIL POLISH ANIMATION ---------------
let arNailPolishFrame = 0;
const arNailPolishTotalFrames = 387; // Set total frames for AR nail polish animation
const arNailPolishFrameRate = 1000 / 30; // Adjust frame rate for AR nail polish animation
let arNailPolishInterval;
const arNailPolishImages = [];

var timeoutNailPolish = 0;


function playArNailPolishAnimation() {
    arNailPolishFrame = 0;
    clearInterval(arNailPolishInterval);
    $('.png-frame-ar.nail-polish').removeClass("d-none");
    arNailPolish.currentTime = 0;
    timeoutNailPolish = setTimeout(function() {
        arNailPolish.play();
    }, 2000);

    const arNailPolishImg = document.getElementById('arNailPolishImg');
    arNailPolishInterval = setInterval(function () {
        if (arNailPolishFrame < arNailPolishTotalFrames) {
            arNailPolishImg.src = `assets/Media/${localLanguage}/ARNailPolish/ARBear_Nail%20Polish_${arNailPolishFrame.toString().padStart(5, '0')}.webp`;

            arNailPolishFrame++;
        } else {
            stopArNailPolishAnimation();
            playArIdleAnimation();
        }
    }, arNailPolishFrameRate);
}

function stopArNailPolishAnimation() {
    $('.png-frame-ar.nail-polish').addClass("d-none");
    clearInterval(arNailPolishInterval);
    arNailPolishFrame = 0;
    arNailPolish.pause();
    clearTimeout(timeoutNailPolish);

    $(".gadget-container .gadget-item:nth-child(3)").removeClass("animation-select");
    $(".gadget-container .gadget-item:nth-child(3) .with-glow").addClass("d-none");
    $(".gadget-container .gadget-item:nth-child(3) .no-glow").removeClass("d-none");
}


// --------------- AR MIRROR ANIMATION ---------------
let arMirrorFrame = 0;
const arMirrorTotalFrames = 361; // Set total frames for AR mirror animation
const arMirrorFrameRate = 1000 / 30; // Adjust frame rate for AR mirror animation
let arMirrorInterval;
const arMirrorImages = [];



function playArMirrorAnimation() {
    arMirrorFrame = 0;
    clearInterval(arMirrorInterval);
    $('.png-frame-ar.mirror').removeClass("d-none");
    arMirror.currentTime = 0;
    arMirror.play();
    const arMirrorImg = document.getElementById('arMirrorImg');
    arMirrorInterval = setInterval(function () {
        if (arMirrorFrame < arMirrorTotalFrames) {
            arMirrorImg.src = `assets/Media/${localLanguage}/ARMirror/ARHair_Mirror_${arMirrorFrame.toString().padStart(5, '0')}.webp`;

            arMirrorFrame++;
        } else {
            stopArMirrorAnimation();
            playArIdleAnimation();
        }
    }, arMirrorFrameRate);
}

function stopArMirrorAnimation() {
    $('.png-frame-ar.mirror').addClass("d-none");
    clearInterval(arMirrorInterval);
    arMirrorFrame = 0;
    arMirror.pause();

    $(".gadget-container .gadget-item:nth-child(4)").removeClass("animation-select");
    $(".gadget-container .gadget-item:nth-child(4) .with-glow").addClass("d-none");
    $(".gadget-container .gadget-item:nth-child(4) .no-glow").removeClass("d-none");
}

// =============== LOADING IMAGES ===============
let loadedImages = 0; // Tracks loaded images

// Safely calculate total images with fallback values
const introFrames = (typeof totalFrames !== 'undefined') ? totalFrames : 180;
const idleFrames = (typeof idleTotalFrames !== 'undefined') ? idleTotalFrames : 210;

const totalImages =
    introFrames +
    // speakingTotalFrames +
    idleFrames;
    // arIntroFrames +
    // arIdleTotalFrames +
    // arGiftTotalFrames +
    // arBlowerTotalFrames +
    // arNailPolishTotalFrames +
    //arMirrorTotalFrames; // Calculate total frames

let loadedAudio = 0; // Tracks loaded audio
const totalAudio = 7; // Number of audio files


$(".on-sound").click(function () {
    enableMic();
    afterAccess();
    aiMusic.play();
    aiVO.play();

    setTimeout(function() {
        aiMusic.pause();
        aiMusic.currentTime = 0;
        aiVO.pause();
        aiVO.currentTime = 0;
    }, 10);

    setTimeout(function() {
        console.log('=== Audio Debug Info ===');
        console.log('aiMusic element:', aiMusic);
        console.log('aiMusic.src:', aiMusic ? aiMusic.src : 'undefined');
        console.log('aiMusic.readyState:', aiMusic ? aiMusic.readyState : 'undefined');
        console.log('aiMusic.error:', aiMusic ? aiMusic.error : 'undefined');
        
        console.log('aiVO element:', aiVO);
        console.log('aiVO.src:', aiVO ? aiVO.src : 'undefined');
        console.log('aiVO.readyState:', aiVO ? aiVO.readyState : 'undefined');
        console.log('aiVO.error:', aiVO ? aiVO.error : 'undefined');
        
        try {
            if (aiMusic) {
                console.log('Attempting to play aiMusic...');
                aiMusic.play().catch(e => {
                    console.error('Error playing aiMusic:', e.message);
                    console.error('aiMusic error details:', e);
                });
            } else {
                console.error('aiMusic is undefined or null');
            }
            
            if (aiVO) {
                console.log('Attempting to play aiVO...');
                aiVO.play().catch(e => {
                    console.error('Error playing aiVO:', e.message);
                    console.error('aiVO error details:', e);
                });
            } else {
                console.error('aiVO is undefined or null');
            }
        } catch (error) {
            console.error('Exception during audio playback:', error);
        }
        
        playAnimation();
    }, 2000);
});


// designed new implementation to load aiintroadnimations 

function loadIntroAnimations(){
    loadAiAnimations()
    loadAiAudio()
}


function loadArAnimations(){
    loadArAnimations()
    loadArAudio()
}




// Creating a new loading experience for intro frames.

function loadAiAnimations() {
    console.log("=== loadAiAnimations: start ===");
    
    // Safely access totalFrames and idleTotalFrames with fallback values
    const introFrames = (typeof totalFrames !== 'undefined') ? totalFrames : 180;
    const idleFrames = (typeof idleTotalFrames !== 'undefined') ? idleTotalFrames : 210;
    
    console.log('totalFrames:', introFrames);
    console.log('idleTotalFrames:', idleFrames);
    
    // Initialize AR loadedAudio if not set
    if (typeof window.arloadedAudio === 'undefined') {
        window.arloadedAudio = 0;
    }
    
    const animations = [
         { totalFrames: introFrames, path: 'assets/Media/AiIntro/Intro Animation V2_{frame}.webp', target: images, name: 'Intro Animation' },
         { totalFrames: idleFrames, path: 'assets/Media/AiIdle/Idle Animation V2 {frame}.webp', target: idleImages, name: 'Idle Animation' },

    ];

    window.aiOverrideTotalImages = animations.reduce((sum, a) => sum + (a.totalFrames || 0), 0);
    console.log('loadAiAnimations: override totalImages =', window.aiOverrideTotalImages);
    window.ailoadedImages = 0;

    console.log('Starting to preload animations...');
    animations.forEach(({ totalFrames, path, target, name }) => {
        console.log("preloadIntroImages call:", name, totalFrames);
        preloadIntroImages(totalFrames, path, target, name);
    });
}

function loadAiAudio() {
    const audioFiles = [
        aiVO,
        aiMusic,
        aiMusic2,
        dummySound,
    ];

    preloadIntroAudio(audioFiles, aiTotalAudio);
}



// =============== LOADING AI IMAGES AND AUDIO ===============
window.ailoadedImages = window.ailoadedImages || 0; // Tracks loaded AI images

// Use existing introFrames and idleFrames from above
window.aitotalImages = introFrames + idleFrames;

window.aiTotalAudio = 4; // Number of audio files



function preloadIntroImages(totalFrames, pathTemplate, targetArray, animationName) {
    if (targetArray.__preloading) return;
    const planned = targetArray.__plannedTotal || 0;
    if (planned >= totalFrames && targetArray.length >= totalFrames) {
        updateintroLoadingBar(window.aitotalImages, window.aiTotalAudio);
        return;
    }
    targetArray.__preloading = true;
    targetArray.__plannedTotal = totalFrames;
    const startIndex = targetArray.length;
    for (let i = startIndex; i < totalFrames; i++) {
        const img = new Image();
        img.src = pathTemplate.replace('{frame}', i.toString().padStart(5, '0'));
        targetArray.push(img);
        // console.log("preloadIntroImages:", animationName, i, img.src);
        img.onload = () => {
            window.ailoadedImages++;
            // console.log('ailoadedImages', window.ailoadedImages, 'of', window.aitotalImages, animationName);
            updateintroLoadingBar(window.aiOverrideTotalImages || window.aitotalImages, window.aiTotalAudio);
            if (window.ailoadedImages >= window.aitotalImages) {
                targetArray.__preloading = false;
            }
        };

        img.onerror = () => {
            console.error(`Failed to load ${animationName} frame: ${img.src}`);
            window.ailoadedImages++;
            console.log('ailoadedImages', window.ailoadedImages, 'of', window.aitotalImages, animationName);
            updateintroLoadingBar(window.aiOverrideTotalImages || window.aitotalImages, window.aiTotalAudio);
            if (window.ailoadedImages >= window.aitotalImages) {
                targetArray.__preloading = false;
            }
        };
    }
}

function preloadIntroAudio(audioArray, aiTotalAudio) {
    if (window.TEST_MODE) {
        window.loadedAudio = aiTotalAudio;
        updateintroLoadingBar(window.aiOverrideTotalImages || window.aitotalImages, window.aiTotalAudio);
        return;
    }
    
    // Initialize AR loadedAudio if not set
    if (typeof window.arloadedAudio === 'undefined') {
        window.arloadedAudio = 0;
    }
    
    audioArray.forEach((audio, index) => {
        audio.oncanplaythrough = () => {
            window.loadedAudio++;
            updateintroLoadingBar(window.aiOverrideTotalImages || window.aitotalImages, window.aiTotalAudio);
        };

        audio.onerror = () => {
            console.error(`Failed to load audio: ${audio.src}`);
            window.loadedAudio++;
            updateintroLoadingBar(window.aiOverrideTotalImages || window.aitotalImages, window.aiTotalAudio);
        };
    });
}



function updateintroLoadingBar(totalImages, totalAudio) {
    console.log('=== updateintroLoadingBar called ===');
    console.log('loadedImages:', window.ailoadedImages);
    
    // Ensure loadedAudio is a valid number
    let loadedAudio = window.loadedAudio || 0;
    if (isNaN(loadedAudio)) {
        loadedAudio = 0;
        window.loadedAudio = 0;
    }
    console.log('loadedAudio:', loadedAudio);
    console.log('totalImages:', totalImages);
    console.log('totalAudio:', totalAudio);

    const denom = (totalImages + totalAudio) || 1;
    const effectiveDenom = (window.TEST_MODE ? totalImages : denom);
    const effectiveLoadedAudio = (window.TEST_MODE ? 0 : loadedAudio);
    let progress = Math.floor(((window.ailoadedImages || 0) + effectiveLoadedAudio) / effectiveDenom * 100);
    
    console.log('Progress calculation:', {
        numerator: (window.ailoadedImages || 0) + effectiveLoadedAudio,
        denominator: effectiveDenom,
        progress: progress + '%'
    });
    
    if (window.TEST_MODE && (window.ailoadedImages || 0) >= totalImages) {
        progress = 100;
    }
    
    console.log('Setting loading bar to:', progress + '%');
    
    // Update loading bar with visual feedback
    const progressBar = document.getElementById("loading-bar");
    const progressText = document.querySelector(".loading-percentage");
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        console.log(`Loading bar width set to: ${progress}%`);
    } else {
        console.error('Loading bar element not found!');
    }
    
    if (progressText) {
        progressText.textContent = `Loading your experience: ${progress}%`;
        console.log(`Loading text set to: Loading your experience: ${progress}%`);
    } else {
        console.error('Loading percentage element not found!');
    }

    if (progress >= 98) {
        console.log('Progress >= 98%, hiding loading container');
        $(".loading-container").addClass("d-none");
        $(".custom-popup").removeClass("d-none");
        $(".popup-container").removeClass("d-none");
    }
}



// =============== LOADING AR IMAGES AND AUDIO ===============
    // we need to make sure the loader is called only once.
// =============== LOADING AR IMAGES AND AUDIO ===============

window.arloadedImages = window.arloadedImages || 0; // Tracks loaded AR images

// Safely calculate AR total images with fallback values
const arIntroFrames = (typeof arIntroTotalFrames !== 'undefined') ? arIntroTotalFrames : 120;
const arIdleFrames = (typeof arIdleTotalFrames !== 'undefined') ? arIdleTotalFrames : 150;
const arGiftFrames = (typeof arGiftTotalFrames !== 'undefined') ? arGiftTotalFrames : 90;
const arBlowerFrames = (typeof arBlowerTotalFrames !== 'undefined') ? arBlowerTotalFrames : 180;
const arNailPolishFrames = (typeof arNailPolishTotalFrames !== 'undefined') ? arNailPolishTotalFrames : 200;
const arMirrorFrames = (typeof arMirrorTotalFrames !== 'undefined') ? arMirrorTotalFrames : 160;

const artotalImages = arIntroFrames + arIdleFrames + arGiftFrames + arBlowerFrames + arNailPolishFrames + arMirrorFrames;
const arTotalAudio = 5; // Number of audio files



function loadArAnimations() {
    // Use global AR frame constants that were already declared above

    const animations = [
        { totalFrames: arIntroFrames, path: 'assets/Media/EN/ARIntro/ARHair_Intro_{frame}.webp', target: arIntroImages, name: 'AR Intro Animation' },
        { totalFrames: arIdleFrames, path: 'assets/Media/EN/ARIdle/ARBear_Idle_{frame}.webp', target: arIdleImages, name: 'AR Idle Animation' },
        { totalFrames: arGiftFrames, path: 'assets/Media/EN/ARGift/ARBear_Gift_{frame}.webp', target: arGiftImages, name: 'AR Gift Animation' },
        { totalFrames: arBlowerFrames, path: 'assets/Media/EN/ARBlower/ARBear_Blower_{frame}.webp', target: arBlowerImages, name: 'AR Blower Animation' },
        { totalFrames: arNailPolishFrames, path: 'assets/Media/EN/ARNailPolish/ARBear_Nail Polish_{frame}.webp', target: arNailPolishImages, name: 'AR Nail Polish Animation' },
        { totalFrames: arMirrorFrames, path: 'assets/Media/EN/ARMirror/ARHair_Mirror_{frame}.webp', target: arMirrorImages, name: 'AR Mirror Animation' }
    ];

    window.arOverrideTotalImages = animations.reduce((sum, a) => sum + (a.totalFrames || 0), 0);
    console.log('loadArAnimations: override totalImages =', window.arOverrideTotalImages);
    window.arloadedImages = 0;

    animations.forEach(({ totalFrames, path, target, name }) => {
        console.log("preloadArImages call:", name, totalFrames);
        preloadImages(totalFrames, path, target, name);
    });
}

function loadArAudio() {
    console.log("[loadArAudio] Called");
    console.log("[loadArAudio] Audio elements:", { 
        arIntro: arIntro ? arIntro.src : 'null', 
        arGift: arGift ? arGift.src : 'null',
        arBlower: arBlower ? arBlower.src : 'null',
        arNailPolish: arNailPolish ? arNailPolish.src : 'null',
        arMirror: arMirror ? arMirror.src : 'null'
    });
    
    // Debug: Check if jQuery selectors are working
    console.log("[loadArAudio] jQuery selector test:", {
        "$('#ar-intro')[0]": $("#ar-intro")[0],
        "$('#ar-gift')[0]": $("#ar-gift")[0],
        "$('#ar-blower')[0]": $("#ar-blower")[0],
        "$('#ar-nail-polish')[0]": $("#ar-nail-polish")[0],
        "$('#ar-mirror')[0]": $("#ar-mirror")[0]
    });
    
    // Check if audio elements exist
    if (!arIntro || !arGift || !arBlower || !arNailPolish || !arMirror) {
        const missingAudios = [];
        if (!arIntro) missingAudios.push('arIntro');
        if (!arGift) missingAudios.push('arGift');
        if (!arBlower) missingAudios.push('arBlower');
        if (!arNailPolish) missingAudios.push('arNailPolish');
        if (!arMirror) missingAudios.push('arMirror');
        
        const errorMsg = `[loadArAudio] Missing audio elements: ${missingAudios.join(', ')}`;
        console.error(errorMsg);
        alert(`ERROR: AR Audio elements not found!\n\nMissing: ${missingAudios.join(', ')}\n\nPlease check that the HTML audio elements exist in the page.`);
        return;
    }
    
    console.log("[loadArAudio] All audio elements found, proceeding with preload");
    const audioFiles = [
        arIntro,
        arGift,
        arBlower,
        arNailPolish,
        arMirror
    ];

    preloadAudio(audioFiles, arTotalAudio, 'AR Audio');
}




function preloadImages(totalFrames, pathTemplate, targetArray, animationName) {
    if (targetArray.__preloading) return;
    const planned = targetArray.__plannedTotal || 0;
    if (planned >= totalFrames && targetArray.length >= totalFrames) {
        updateLoadingBar(window.arOverrideTotalImages || artotalImages, arTotalAudio);
        return;
    }
    targetArray.__preloading = true;
    targetArray.__plannedTotal = totalFrames;
    const startIndex = targetArray.length;
    for (let i = startIndex; i < totalFrames; i++) {
        const img = new Image();
        img.src = pathTemplate.replace('{frame}', i.toString().padStart(5, '0'));
        targetArray.push(img);
        console.log("preloadImages:", animationName, i, img.src);
        img.onload = () => {
            window.arloadedImages++;
            console.log("[preloadImages] Image loaded. Calling updateLoadingBar with:", { arloadedImages: window.arloadedImages, arOverrideTotalImages: window.arOverrideTotalImages, artotalImages: artotalImages, arTotalAudio: arTotalAudio });
            updateLoadingBar(window.arOverrideTotalImages || artotalImages, arTotalAudio);
            if (window.arloadedImages >= (window.arOverrideTotalImages || artotalImages)) {
                targetArray.__preloading = false;
            }
        };

        img.onerror = () => {
            console.error(`Failed to load ${animationName} frame: ${img.src}`);
            // Don't count failed image loads - only count successful ones
            console.log("[preloadImages] Image error. Calling updateLoadingBar with:", { arloadedImages: window.arloadedImages, arOverrideTotalImages: window.arOverrideTotalImages, artotalImages: artotalImages, arTotalAudio: arTotalAudio });
            updateLoadingBar(window.arOverrideTotalImages || artotalImages, arTotalAudio);
            if (window.arloadedImages >= (window.arOverrideTotalImages || artotalImages)) {
                targetArray.__preloading = false;
            }
        };

    console.log("preloadImages:", animationName, "totalFrames:", totalFrames, "i:", i);
    }
}

function preloadAudio(audioArray, totalAudio, animationName) {
    console.log('[preloadAudio] Called with:', { audioArrayLength: audioArray.length, totalAudio, animationName });
    console.log('[preloadAudio] Audio elements:', audioArray.map(a => a ? a.src : 'null'));
    
    // Check for null audio elements
    const nullAudios = audioArray.filter(a => !a);
    if (nullAudios.length > 0) {
        const errorMsg = `[preloadAudio] Found ${nullAudios.length} null audio elements in ${animationName}`;
        console.error(errorMsg);
        alert(`ERROR: ${nullAudios.length} audio elements are missing in ${animationName}!\n\nPlease check that all HTML audio elements exist in the page.`);
        return;
    }
    
    if (window.TEST_MODE) {
        window.arloadedAudio = totalAudio;
        updateLoadingBar(window.arOverrideTotalImages || artotalImages, totalAudio);
        return;
    }
    
    // Initialize arloadedAudio if not set
    if (typeof window.arloadedAudio === 'undefined') {
        window.arloadedAudio = 0;
    }
    
    audioArray.forEach((audio, index) => {
        console.log("preloadAudio:", animationName, index, audio ? audio.src : 'null audio');
        
        if (!audio) {
            console.error(`[preloadAudio] Audio element ${index} is null`);
            // Don't count null audio as loaded
            updateLoadingBar(window.arOverrideTotalImages || artotalImages, totalAudio);
            return;
        }
        
        audio.oncanplaythrough = () => {
            console.log(`[preloadAudio] Audio ${index} loaded successfully`);
            window.arloadedAudio++;
            console.log("[preloadAudio] Audio loaded. Calling updateLoadingBar with:", { arloadedAudio: window.arloadedAudio, arOverrideTotalImages: window.arOverrideTotalImages, artotalImages: artotalImages, totalAudio: totalAudio });
            updateLoadingBar(window.arOverrideTotalImages || artotalImages, totalAudio);
        };

        audio.onerror = () => {
            console.error(`Failed to load audio: ${audio.src}`);
            alert(`ERROR: Failed to load audio file!\n\nFile: ${audio.src}\n\nPlease check that the audio file exists and is accessible.`);
            // Don't count failed audio as loaded - only count successful loads
            console.log("[preloadAudio] Audio error. Calling updateLoadingBar with:", { arloadedAudio: window.arloadedAudio, arOverrideTotalImages: window.arOverrideTotalImages, artotalImages: artotalImages, totalAudio: totalAudio });
            updateLoadingBar(window.arOverrideTotalImages || artotalImages, totalAudio);
        };
        console.log("preloadAudio:", animationName, "totalAudio:", totalAudio, "index:", index);
    });
}



function updateLoadingBar(totalImages, totalAudio) {
    console.log('[updateLoadingBar] Called with:', { totalImages, totalAudio, arloadedImages: window.arloadedImages, arloadedAudio: window.arloadedAudio });

    const ti = Number(window.arOverrideTotalImages || totalImages) || 0;
    const ta = Number(totalAudio) || 0;
    const denom = (ti + ta) || 1;
    
    // Calculate actual progress based on loaded items, not attempted loads
    const loadedImages = window.arloadedImages || 0;
    const loadedAudio = window.arloadedAudio || 0;
    
    // Calculate progress percentage
    let progress = Math.floor((loadedImages + loadedAudio) / denom * 100);
    
    // Ensure progress doesn't exceed 100%
    progress = Math.min(progress, 100);
    
    // Debug: Check if we're stuck at 99% or close to completion
    if (progress >= 98) {
        console.log('[updateLoadingBar] NEAR COMPLETION DEBUG:', {
            progress,
            loadedImages,
            arloadedAudio: window.arloadedAudio,
            totalImages: ti,
            totalAudio: ta,
            totalExpected: ti + ta,
            totalLoaded: loadedImages + window.arloadedAudio,
            missing: (ti + ta) - (loadedImages + window.arloadedAudio),
            percentage: ((loadedImages + window.arloadedAudio) / denom * 100).toFixed(2)
        });
        
        // If we're missing exactly 1 asset, force completion
        if ((ti + ta) - (loadedImages + window.arloadedAudio) <= 1) {
            console.log('[updateLoadingBar] Forcing completion - only 1 asset missing');
            progress = 100;
        }
    }
    
    console.log('[updateLoadingBar] Calculated progress:', progress, '%');
    console.log('[updateLoadingBar] Loaded items:', { loadedImages, loadedAudio, totalImages: ti, totalAudio: ta });
    console.log('[updateLoadingBar] Progress details:', { 
        loadedImages, 
        loadedAudio, 
        totalItems: ti + ta, 
        percentage: ((loadedImages + loadedAudio) / denom * 100).toFixed(2) 
    });
    
    // Update the loading bar and percentage
    const $loadingBar = $("#loading-bar-ar");
    const $loadingPercentage = $(".loading-percentage-ar");
    
    console.log(`[updateLoadingBar] Updating AR loading bar to: ${progress}%`);
    
    if ($loadingBar.length) {
        $loadingBar.css("width", `${progress}%`);
        console.log(`[updateLoadingBar] Set loading bar width to: ${progress}%`);
    } else {
        console.warn("[updateLoadingBar] Loading bar element not found!");
    }
    
    if ($loadingPercentage.length) {
        $loadingPercentage.text(`${progress}%`);
        console.log(`[updateLoadingBar] Set loading percentage text to: ${progress}%`);
    } else {
        console.warn("[updateLoadingBar] Loading percentage element not found!");
    }

    // Only consider loading complete when we reach 100%
    if (progress >= 97) {
        console.log("[updateLoadingBar] Loading complete at 100%, hiding loading containers.");
        
        // Hide loading containers
        $(".loading-container-aranimation").addClass("d-none");
        $(".popup-container").addClass("d-none");
        $(".loading-container").addClass("d-none");
        
        // Show custom-popup after loading is complete
        $(".custom-popup").removeClass("d-none");
        clickToPlay = 1; // Ensure clickToPlay is set here
        
        // Resolve the promise if it exists
        if (window.arLoadingResolve) {
            console.log("[updateLoadingBar] Resolving AR loading promise at 100% progress");
            window.arLoadingComplete = true;
            
            window.arLoadingResolve({ 
                success: true, 
                cached: false, 
                message: "AR assets loaded successfully",
                progress: progress
            });
            // Clean up the resolve function
            window.arLoadingResolve = null;
            window.arLoadingReject = null;
        }
    }
}
