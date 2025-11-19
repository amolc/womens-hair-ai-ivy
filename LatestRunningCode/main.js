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


function enableMic() {
    recognition.start();

    setTimeout(offMic, 100);
    function offMic() {
        recognition.stop();
    }
}

async function enableCamera() {
    enableMic();
    try {
        // Request access to the rear camera
        const constraints = {
            video: { facingMode: { ideal: 'environment' } }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Set the video stream as the video source
        video.srcObject = stream;
        loadAllAnimations();
        loadAllAudio();
        $(".camera-prompt").addClass("d-none");
        $(".custom-popup").removeClass("d-none");

    } catch (error) {
        // Handle errors (e.g., permissions denied, no camera found)
        console.log(`Error: ${error.message}`);
    }
}
// $('.click-camera').on('click', enableCamera);

$(".click-camera").click(function () {
    enableCamera();
});



// ==================== AFTER ACCESS OPEN ELEMENTS ====================
// open this after all permissions are granted
function afterAccess() {
    $(".custom-popup").addClass("d-none");
    // ---------- CUSTOM CALLS ----------
    // $(".splash-page").removeClass("d-none");
    $(".all-prompts-container").addClass("d-none");
    $(".splash-page")[0].play();
    cameraPrompt.addClass("d-none");
    mainContainer.addClass("no-bg");

    setTimeout(doAfterLoad500, 500);
    function doAfterLoad500() {
        aiChat.removeClass("d-none");
    }

    setTimeout(doAfterLoad3000, 3000);
    function doAfterLoad3000() {
        // setTimeout(doAfterLoad1000, 1000);
        // function doAfterLoad1000() {
        $(".splash-page").addClass("d-none");
        $(".splash-page")[0].pause();

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

var popWhole = $("#pop-whole")[0];
popWhole.load();

$(".click-to-play").click(function () {
    clickToPlay += 1;
    // $(".ivybears-header").addClass("d-none");
    $(".hold-to-speak.outside").removeClass("op-0-1");
    $(".hold-to-speak.outside").addClass("startVoice");
    $(".ai-chat .menu-container").removeClass("menu-done");
    $(".chatbot_inner_2").addClass("d-none");
    $(".mic-guide").addClass("d-none");
    $(".suggestions-slider").removeClass("d-none");
    $(".chatbot__box").addClass("op-0");
    $(".ai-chat.back-button").addClass("d-none");

    $(".ai-chat").removeClass("op-1");
    $(".ai-chat").addClass("op-0");
    $(".ar-into-animation").removeClass("d-none");

    setTimeout(doAfterLoad, 500);
    function doAfterLoad() {
        $(".ai-chat").addClass("d-none");
        $(".ar-into-animation").removeClass("op-0");
        $(".ar-into-animation").addClass("op-1");

        $('.suggestions-slider').slick('unslick');
    }
    $(".chatbot__chat.incoming").removeClass("listen-text");
    $(".sound-toggle.off").removeClass("d-none");
    $(".sound-toggle.on").addClass("d-none");
    stopAllSpeech();
    stopAnimation();
    // stopAnimateSpeaking();
    stopIdleAnimation();
    aiMusic2.currentTime = 0;
    aiMusic2.play();


    // if first clicked
    if (clickToPlay <= 1) {
        popWhole.currentTime = 0;
        popWhole.play();
        setTimeout(doAfterLoad500, 500);
        function doAfterLoad500() {
            $(".png-sequence-ar").removeClass("d-none");
            playArIntroAnimation();
        }

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
    }

    else {
        playArIdleAnimation();
    }
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
    const aiIntroImg = document.getElementById('aiIntroImg');
    pngSeqInterval = setInterval(function () {
        if (pngSeqframe < totalFrames) {
            aiIntroImg.src = `assets/Media/AiIntro/Intro%20Animation%20V2_${pngSeqframe.toString().padStart(5, '0')}.webp`;
            pngSeqframe++;
        } else {
            introStart += 1;
            pngSeqframe = 0;
            clearInterval(pngSeqInterval);
            playIdleAnimation();
            setTimeout(doAfterLoad, 200);
            function doAfterLoad() {
                $('.png-frame-ai.intro').addClass("d-none");
                $('.png-frame-ai.idle').removeClass("d-none");
            }
            // aiVO.play();
            // aiMusic.pause();
        }
    }, frameRate);
}

function stopAnimation() {
    clearInterval(pngSeqInterval);
    pngSeqframe = 0;
    aiMusic.pause();
    aiVO.pause();
}


// --------------- SPEAKING ANIMATION ---------------
// let speakingFrame = 0;
// const speakingTotalFrames = 550;
// const speakingFrameRate = 1000 / 30;
// let speakingInterval;
// const speakingImages = [];

// function playSpeakingAnimation() {
//     const aiSpeakingImg = document.getElementById('aiSpeakingImg');
//     speakingInterval = setInterval(function () {
//         if (speakingFrame < speakingTotalFrames) {
//             aiSpeakingImg.src = `assets/Media/AiSpeaking/Speaking%20Animation%20V2_${speakingFrame.toString().padStart(5, '0')}.webp`;
//             speakingFrame++;
//         } else {
//             speakingFrame = 0; // Reset for looping animation
//         }
//     }, speakingFrameRate);
// }

// function stopSpeakingAnimation() {
//     clearInterval(speakingInterval);
//     speakingFrame = 0;
// }

// --------------- IDLE ANIMATION ---------------
let idleFrame = 0;
const idleTotalFrames = 210; // Set total frames for idle animation
const idleFrameRate = 1000 / 30; // Adjust frame rate for idle animation
let idleInterval;
const idleImages = [];

function playIdleAnimation() {
    const aiIdleImg = document.getElementById('aiIdleImg');
    idleFrame = 0;
    idleInterval = setInterval(function () {
        if (idleFrame < idleTotalFrames) {
            aiIdleImg.src = `assets/Media/AiIdle/Idle%20Animation%20V2%20${idleFrame.toString().padStart(5, '0')}.webp`;
            idleFrame++;
        } else {
            idleFrame = 0; // Reset for looping animation
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
const arIdleTotalFrames = 260; // Set total frames for AR idle animation
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
const arGiftTotalFrames = 190; // Set total frames for AR gift animation
const arGiftFrameRate = 1000 / 30; // Adjust frame rate for AR gift animation
let arGiftInterval;
const arGiftImages = [];

var timeoutGift = 0;
// function playArGiftAnimation() {
//     arGiftFrame = 0;
//     clearInterval(arGiftInterval);
//     $('.png-frame-ar.gift').removeClass("d-none");
//     arGift.currentTime = 0;
//     timeoutGift = setTimeout(giftVODelay, 1300);
//     function giftVODelay() {
//         arGift.play();
//     }
//     arGiftInterval = setInterval(function () {
//         if (arGiftFrame < arGiftTotalFrames) {
//             $('.png-frame-ar.gift').css(
//                 'background',
//                 `url('assets/Media/ARGift/ARBear_Gift_${arGiftFrame.toString().padStart(5, '0')}.webp') no-repeat`
//             );

//             arGiftFrame++;

//             if (arGiftFrame == 170) {
//                 $(".shop-now-popup").removeClass("op-0-1");
//             }
//         }


//         else {
//             stopArGiftAnimation();
//             playArIdleAnimation();

//         }
//     }, arGiftFrameRate);
// }

function playArGiftAnimation() {
    arGiftFrame = 0;
    clearInterval(arGiftInterval);
    $('.png-frame-ar.gift').removeClass("d-none");
    arGift.currentTime = 0;
    timeoutGift = setTimeout(giftVODelay, 1300);
    function giftVODelay() {
        arGift.play();
    }

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
const arBlowerTotalFrames = 350; // Set total frames for AR blower animation
const arBlowerFrameRate = 1000 / 30; // Adjust frame rate for AR blower animation
let arBlowerInterval;
const arBlowerImages = [];

// function playArBlowerAnimation() {
//     arBlowerFrame = 0;
//     clearInterval(arBlowerInterval);
//     $('.png-frame-ar.blower').removeClass("d-none");
//     arBlower.currentTime = 0;
//     arBlower.play();
//     arBlowerInterval = setInterval(function () {
//         if (arBlowerFrame < arBlowerTotalFrames) {
//             $('.png-frame-ar.blower').css(
//                 'background',
//                 `url('assets/Media/ARBlower/ARBear_Blower_${arBlowerFrame.toString().padStart(5, '0')}.webp') no-repeat`
//             );

//             arBlowerFrame++;
//         }
//         else {
//             stopArBlowerAnimation();
//             playArIdleAnimation();
//         }
//     }, arBlowerFrameRate);
// }

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
const arNailPolishTotalFrames = 400; // Set total frames for AR nail polish animation
const arNailPolishFrameRate = 1000 / 30; // Adjust frame rate for AR nail polish animation
let arNailPolishInterval;
const arNailPolishImages = [];

var timeoutNailPolish = 0;
// function playArNailPolishAnimation() {
//     arNailPolishFrame = 0;
//     clearInterval(arNailPolishInterval);
//     $('.png-frame-ar.nail-polish').removeClass("d-none");
//     arNailPolish.currentTime = 0;
//     timeoutNailPolish = setTimeout(doAfterLoad2000, 2000);
//     function doAfterLoad2000() {
//         arNailPolish.play();
//     }
//     arNailPolishInterval = setInterval(function () {
//         if (arNailPolishFrame < arNailPolishTotalFrames) {
//             $('.png-frame-ar.nail-polish').css(
//                 'background',
//                 `url('assets/Media/ARNailPolish/ARBear_Nail%20Polish_${arNailPolishFrame.toString().padStart(5, '0')}.webp') no-repeat`
//             );

//             arNailPolishFrame++;
//         } else {
//             stopArNailPolishAnimation();
//             playArIdleAnimation();
//         }
//     }, arNailPolishFrameRate);
// }

function playArNailPolishAnimation() {
    arNailPolishFrame = 0;
    clearInterval(arNailPolishInterval);
    $('.png-frame-ar.nail-polish').removeClass("d-none");
    arNailPolish.currentTime = 0;
    timeoutNailPolish = setTimeout(doAfterLoad2000, 2000);
    function doAfterLoad2000() {
        arNailPolish.play();
    }

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
const arMirrorTotalFrames = 360; // Set total frames for AR mirror animation
const arMirrorFrameRate = 1000 / 30; // Adjust frame rate for AR mirror animation
let arMirrorInterval;
const arMirrorImages = [];

// function playArMirrorAnimation() {
//     arMirrorFrame = 0;
//     clearInterval(arMirrorInterval);
//     $('.png-frame-ar.mirror').removeClass("d-none");
//     arMirror.currentTime = 0;
//     arMirror.play();
//     arMirrorInterval = setInterval(function () {
//         if (arMirrorFrame < arMirrorTotalFrames) {
//             $('.png-frame-ar.mirror').css(
//                 'background',
//                 `url('assets/Media/ARMirror/ARHair_Mirror_${arMirrorFrame.toString().padStart(5, '0')}.webp') no-repeat`
//             );

//             arMirrorFrame++;
//         } else {
//             stopArMirrorAnimation();
//             playArIdleAnimation();
//         }
//     }, arMirrorFrameRate);
// }

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
const totalImages =
    totalFrames +
    // speakingTotalFrames +
    idleTotalFrames +
    arIntroTotalFrames +
    arIdleTotalFrames +
    arGiftTotalFrames +
    arBlowerTotalFrames +
    arNailPolishTotalFrames +
    arMirrorTotalFrames; // Calculate total frames

let loadedAudio = 0; // Tracks loaded audio
const totalAudio = 7; // Number of audio files

function updateLoadingBar() {
    const progress = Math.floor((loadedImages + loadedAudio) / (totalImages + totalAudio) * 100);
    document.getElementById("loading-bar").style.width = `${progress}%`;
    document.querySelector(".loading-percentage").textContent = `${progress}%`;

    // Hide loading bar when complete
    // if (loadedImages + loadedAudio === totalImages + totalAudio) {

    // }

    if (progress >= 98) {
        $(".popup-container").removeClass("d-none");
        $(".loading-container").addClass("d-none");
    }
    console.log(progress);
}

function preloadImages(totalFrames, pathTemplate, targetArray, animationName) {
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = pathTemplate.replace('{frame}', i.toString().padStart(5, '0'));
        targetArray.push(img);

        img.onload = () => {
            loadedImages++;
            updateLoadingBar();
        };

        img.onerror = () => {
            console.error(`Failed to load ${animationName} frame: ${img.src}`);
            loadedImages++;
            updateLoadingBar(); // Still update progress even on error
        };
    }
}

function preloadAudio(audioArray, totalAudio) {
    audioArray.forEach((audio, index) => {
        audio.oncanplaythrough = () => {
            loadedAudio++;
            updateLoadingBar();
        };

        audio.onerror = () => {
            console.error(`Failed to load audio: ${audio.src}`);
            loadedAudio++;
            updateLoadingBar(); // Still update progress even on error
        };
    });
}


$(".on-sound").click(function () {
    afterAccess();
    aiMusic.play();
    aiVO.play();

    setTimeout(doAfterLoad10, 10);
    function doAfterLoad10() {
        aiMusic.pause();
        aiMusic.currentTime = 0;
        aiVO.pause();
        aiVO.currentTime = 0;
    }

    setTimeout(doAfterLoad3000, 3000);
    function doAfterLoad3000() {
        aiMusic.play();
        aiVO.play();
        playAnimation();
    }
});

function loadAllAnimations() {

    const animations = [
        { totalFrames: totalFrames, path: 'assets/Media/AiIntro/Intro Animation V2_{frame}.webp', target: images, name: 'Intro Animation' },
        // { totalFrames: speakingTotalFrames, path: 'assets/Media/AiSpeaking/Speaking Animation V2_{frame}.webp', target: speakingImages, name: 'Speaking Animation' },
        { totalFrames: idleTotalFrames, path: 'assets/Media/AiIdle/Idle Animation V2 {frame}.webp', target: idleImages, name: 'Idle Animation' },
        { totalFrames: arIntroTotalFrames, path: 'assets/Media/'+ localLanguage +'/ARIntro/ARHair_Intro_{frame}.webp', target: arIntroImages, name: 'AR Intro Animation' },
        { totalFrames: arIdleTotalFrames, path: 'assets/Media/'+ localLanguage +'/ARIdle/ARBear_Idle_{frame}.webp', target: arIdleImages, name: 'AR Idle Animation' },
        { totalFrames: arGiftTotalFrames, path: 'assets/Media/'+ localLanguage +'/ARGift/ARBear_Gift_{frame}.webp', target: arGiftImages, name: 'AR Gift Animation' },
        { totalFrames: arBlowerTotalFrames, path: 'assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_{frame}.webp', target: arBlowerImages, name: 'AR Blower Animation' },
        { totalFrames: arNailPolishTotalFrames, path: 'assets/Media/'+ localLanguage +'/ARNailPolish/ARBear_Nail Polish_{frame}.webp', target: arNailPolishImages, name: 'AR Nail Polish Animation' },
        { totalFrames: arMirrorTotalFrames, path: 'assets/Media/'+ localLanguage +'/ARMirror/ARHair_Mirror_{frame}.webp', target: arMirrorImages, name: 'AR Mirror Animation' }
    ];

    animations.forEach(({ totalFrames, path, target, name }) => {
        preloadImages(totalFrames, path, target, name);
    });
}

function loadAllAudio() {
    const audioFiles = [
        aiVO,
        aiMusic,
        aiMusic2,
        dummySound,
        arIntro,
        arGift,
        arBlower,
        arNailPolish,
        arMirror
    ];

    preloadAudio(audioFiles, totalAudio);
}