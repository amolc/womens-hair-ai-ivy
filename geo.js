// In Geo.js write an onload function that gives us the counry and voiceLanguage

console.log("[GEO] geo.js - version 2.1")
let localCountryCode = 'GB';
let localLanguage = 'EN';
let sessionData = {};

const countriesVO = {
  GB: "Intro-Ai-VO.mp3#t=0.001",
  DE: "ADA-DE-VO.mp3#t=0.001",
  SG: "ADA-DE-VO.mp3#t=0.001",
  PH: "ADA-DE-VO.mp3#t=0.001"
};

const countriesARVO = {
  GB: "ARIntro-VO.mp3#t=0.001",
  DE: "ARIntro-VO-DE.mp3#t=0.001",
  SG: "ARIntro-VO-DE.mp3#t=0.001",
  PH: "ARIntro-VO-DE.mp3#t=0.001"
};

const arARVO = [
  {
    GB: 'Blower-VO.mp3#t=0.001',
    DE: 'Blower-VO-DE.mp3#t=0.001',
    SG: 'Blower-VO-DE.mp3#t=0.001',
    PH: 'Blower-VO-DE.mp3#t=0.001'
  },
  {
    GB: 'Mirror-VO.mp3#t=0.001',
    DE: 'Mirror-VO-DE.mp3#t=0.001',
    SG: 'Mirror-VO-DE.mp3#t=0.001',
    PH: 'Mirror-VO-DE.mp3#t=0.001'
  },
  {
    GB: 'Nail-Polish-VO.mp3#t=0.001',
    DE: 'Nail-Polish-VO-DE.mp3#t=0.001',
    SG: 'Nail-Polish-VO-DE.mp3#t=0.001',
    PH: 'Nail-Polish-VO-DE.mp3#t=0.001'
  },
  {
    GB: 'Gift-VO.mp3#t=0.001',
    DE: 'Gift-VO-DE.mp3#t=0.001',
    SG: 'Gift-VO-DE.mp3#t=0.001',
    PH: 'Gift-VO-DE.mp3#t=0.001'
  }
]

const imgLoc = [
  {   
    GB: "assets/Click-to-play-CTA.svg",
    DE: "assets/loc/img/DE/Click-to-play-CTA.svg",
    SG: "assets/loc/img/DE/Click-to-play-CTA.svg",
    PH: "assets/loc/img/DE/Click-to-play-CTA.svg"
  },
  {   
    GB: "assets/shop-online-btn.webp",
    DE: "assets/loc/img/DE/shop-online-btn.webp",
    SG: "assets/loc/img/DE/shop-online-btn.webp",
    PH: "assets/loc/img/DE/shop-online-btn.webp"
  },
  {   
    GB: "assets/ada-new-title.png",
    DE: "assets/loc/img/DE/ada-new-title.png",
    SG: "assets/loc/img/DE/ada-new-title.png",
    PH: "assets/loc/img/DE/ada-new-title.png"
  },
  {   
    GB: "assets/ask-me-anyting.svg",
    DE: "assets/loc/img/DE/ask-me-anyting.svg",
    SG: "assets/loc/img/DE/ask-me-anyting.svg",
    PH: "assets/loc/img/DE/ask-me-anyting.svg"
  },
  {   
    GB: "assets/tap-to-speak.svg",
    DE: "assets/loc/img/DE/tap-to-speak.svg",
    SG: "assets/loc/img/DE/tap-to-speak.svg",
    PH: "assets/loc/img/DE/tap-to-speak.svg"
  },
  {   
    GB: "assets/tap-to-stop.svg",
    DE: "assets/loc/img/DE/tap-to-stop.svg",
    SG: "assets/loc/img/DE/tap-to-stop.svg",
    PH: "assets/loc/img/DE/tap-to-stop.svg"
  }

]


const txtSplash = [
  {
    GB: "This augmented reality experience requires access to your device's camera",
    DE: "Diese IvyBears Ai und Augmented Reality Experience erfordert den Zugriff auf Ihre Kamera.",
    SG: "Diese IvyBears Ai und Augmented Reality Experience erfordert den Zugriff auf Ihre Kamera.",
    PH: "Diese IvyBears Ai und Augmented Reality Experience erfordert den Zugriff auf Ihre Kamera."
  },
  {
    GB: "ALLOW ACCESS",
    DE: "ZUGRIFF ERLAUBEN",
    SG: "ZUGRIFF ERLAUBEN",
    PH: "ZUGRIFF ERLAUBEN"
  }
];

const txtAccess = [
  {
    GB: "Allow sounds and music.",
    DE: "Musik & Geräusche zulassen",
    SG: "Musik & Geräusche zulassen",
    PH: "Musik & Geräusche zulassen"
  },
  {
    GB: "ALLOW",
    DE: "ZULASSEN",
    SG: "ZULASSEN",
    PH: "ZULASSEN"
  }
];

const txtLanding = [
  {
    GB: "🐻 What is Ivybears' most popular product?",
    SG: "🐻 Welches ist das beliebteste Produkt von Ivybears?",
    PH: "🐻 Welches ist das beliebteste Produkt von Ivybears?",
    DE: "🐻 Welches ist das beliebteste Produkt von Ivybears?"
  },
  {
    GB: "🍃 Are Ivybears gummies vegan and sugar-free?",
    SG: "🍃 Sind die Gummibärchen von Ivybears vegan und zuckerfrei?",
    PH: "🍃 Sind die Gummibärchen von Ivybears vegan und zuckerfrei?",
    DE: "🍃 Sind die Gummibärchen von Ivybears vegan und zuckerfrei?"
  },
  {
    GB: "🫙 How many products does Ivybears have?",
    SG: "🫙 Wie viele Produkte hat Ivybears?",
    PH: "🫙 Wie viele Produkte hat Ivybears?",
    DE: "🫙 Wie viele Produkte hat Ivybears?"
  },
  {
    GB: "🧪 Do Ivybears contain any artificial ingredients?",
    SG: "🧪 Enthalten Ivybears künstliche Inhaltsstoffe?",
    PH: "🧪 Enthalten Ivybears künstliche Inhaltsstoffe?",
    DE: "🧪 Enthalten Ivybears künstliche Inhaltsstoffe?"
  },
  {
    GB: "💪 How long before Ivybears show visible results?",
    SG: "💪 Wie lange dauert es, bis Ivybears sichtbare Ergebnisse zeigt?",
    PH: "💪 Wie lange dauert es, bis Ivybears sichtbare Ergebnisse zeigt?",
    DE: "💪 Wie lange dauert es, bis Ivybears sichtbare Ergebnisse zeigt?"
  },
  {
    GB: "⚗️ Are Ivybears clinically tested for effectiveness?",
    SG: "⚗️ Wurde die Wirksamkeit von Ivybears klinisch getestet?",
    PH: "⚗️ Wurde die Wirksamkeit von Ivybears klinisch getestet?",
    DE: "⚗️ Wurde die Wirksamkeit von Ivybears klinisch getestet?"
  },
  {
    GB: "Speakingsss",
    // SG: "Spracheingabe...",
    // PH: "Spracheingabe...",
    // DE: "Spracheingabe..."
    SG: "einen Moment bitte…",
    PH: "einen Moment bitte…",
    DE: "einen Moment bitte…"
  },
  {
    GB: "Thinking...",
    // SG: "einen Moment...",
    // PH: "einen Moment...",
    // DE: "einen Moment..."
    SG: "einen Moment bitte…",
    PH: "einen Moment bitte…",
    DE: "einen Moment bitte…"
  }
];

const txtARLanding = [
  {
    GB: "Tap To Learn More",
    SG: "Tippen Sie hier, um mehr zu erfahren",
    PH: "Tippen Sie hier, um mehr zu erfahren",
    DE: "Tippen Sie hier, um mehr zu erfahren"
  }
];

const txtShopNow = [
  {
    GB: "off when you spend over €80 on our website",
    SG: "Rabatt ab einem Einkaufswert von 80€ auf unserer Website",
    PH: "Rabatt ab einem Einkaufswert von 80€ auf unserer Website",
    DE: "Rabatt ab einem Einkaufswert von 80€ auf unserer Website"
  },
  {
    GB: "Promo Code",
    SG: "Gutscheincode",
    PH: "Gutscheincode",
    DE: "Gutscheincode"
  }
];


function setLocalization(browserLang) {
  let lang = localLanguage;
  let country = localCountryCode;
  if (browserLang && browserLang.includes('-')) {
    const parts = browserLang.split('-');
    lang = parts[0].toUpperCase();
    country = parts[1].toUpperCase();
  }
  return { localLanguage: lang, localCountryCode: country };
}

async function generateSessionId() {
  try {
    // Get user timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get browser language and platform
    const browserLang = navigator.language || 'unknown';
    const platform = navigator.platform || 'unknown';
    
    // Get screen resolution for device insights
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Try to get IP address and geolocation using our own API
    let ipAddress = 'unknown';
    let country = 'unknown';
    let city = 'unknown';
    try {
      console.log('[GEO] Fetching geolocation information from our API...');
      const ipResponse = await fetch('https://api-stage.ivybears.ai/api/geolocation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!ipResponse.ok) {
        throw new Error(`Geolocation API responded with status: ${ipResponse.status}`);
      }
      const geoData = await ipResponse.json();
      
      // Extract IP and country from our API response
      ipAddress = geoData.ip_address || 'unknown';
      country = geoData.country_code || geoData.country || 'unknown';
      city = geoData.city || 'unknown';
      
      console.log('[GEO] Geolocation information fetched successfully:', { ipAddress, country, city, geoData });
    } catch (ipError) {
      console.error('[GEO] Geolocation API fetch failed:', ipError);
      // Fallback: use a hashed combination of other identifiers if API fails
      ipAddress = 'local-' + Math.random().toString(36).substr(2, 9);
      console.log('[GEO] Using fallback IP:', ipAddress);
    }
    
    const localization = setLocalization(browserLang);

    const sessionData = {
      timestamp: timestamp,
      ipAddress: ipAddress,
      country: country,
      city: city,
      timezone: timezone,
      platform: platform,
      browserLang: browserLang,
      screenResolution: screenResolution,
      ...localization
    };

    // Save all parameters to localStorage
    localStorage.setItem('session_params', JSON.stringify(sessionData));

    // test the localStorage
    console.log('[GEO] Stored session_params:', localStorage.getItem('session_params'));
    return sessionData;
  } catch (error) {
    // Fallback session data if anything fails
    console.error("[GEO] Error generating session ID:", error);
    const fallbackData = {
        error: "Failed to generate session data",
        details: error.message,
        timestamp: new Date().toISOString()
    };
    return fallbackData;
  }
}

// This function represents the rest of your application
// It will only be called AFTER sessionData is ready.
function initializeApp(data) {
  console.log("[GEO] Application is initializing with session data:", data);
  
  // Set global language and country, defaulting to EN/GB if not DE
  if (data.localCountryCode !== 'DE' && data.localLanguage !== 'DE') {
    localLanguage = 'EN';
    localCountryCode = 'GB';
  } else {
    localLanguage = 'DE';
    localCountryCode = 'DE';
  }

  runTranslation();
}

window.onload = function() {
  try {
    console.log("[GEO] geo.js - version 2.0 loaded");
    console.log('[GEO] Window loaded, generating session ID...');
    generateSessionId().then(sessionData => {
      console.log('[GEO] Session Data is ready:', sessionData);
      
      // Now that sessionData is ready, we can call our next functions
      initializeApp(sessionData);
      encryptSessionData(sessionData);
      console.log('[GEO] All initialization functions completed');
    }).catch(error => {
      console.error('[GEO] Error generating session ID:', error);
    });

  } catch (error) {
    console.error('[GEO] Error in window.onload:', error);
  }
};

function runTranslation() {
  console.log("[GEO] runTranslation called with country code: ", localCountryCode);

  if (countriesVO[localCountryCode] !== null && countriesVO[localCountryCode] !== undefined) {
    // document.getElementById('ai-vo').setAttribute('src','assets/Media/VO/' + countriesVO[localCountryCode]);
    // document.getElementById('ar-intro').setAttribute('src','assets/Media/ARVO/' + countriesARVO[localCountryCode]);

    // document.getElementById('ar-blower').setAttribute('src','assets/Media/ARVO/' + arARVO[0][localCountryCode]);
    // document.getElementById('ar-mirror').setAttribute('src','assets/Media/ARVO/' + arARVO[1][localCountryCode]);
    // document.getElementById('ar-nail-polish').setAttribute('src','assets/Media/ARVO/' + arARVO[2][localCountryCode]);
    // document.getElementById('ar-gift').setAttribute('src','assets/Media/ARVO/' + arARVO[3][localCountryCode]);
  
    //Splash
    // document.querySelector('.camera-prompt .prompt-message h3').textContent = txtSplash[0][localCountryCode];
    // document.querySelector('.camera-prompt .click-camera').textContent = txtSplash[1][localCountryCode];

    //Access
    // document.querySelector('.custom-popup .popup-container h3').textContent = txtAccess[0][localCountryCode];
    // document.querySelector('.custom-popup .popup-container .on-sound').textContent = txtAccess[1][localCountryCode];

    //Landing01
    document.querySelector('.suggestions-slider:nth-child(1) .suggestions-box:nth-child(1) .suggestions-text p').textContent = txtLanding[0][localCountryCode];
    document.querySelector('.suggestions-slider:nth-child(1) .suggestions-box:nth-child(2) .suggestions-text p').textContent = txtLanding[1][localCountryCode];

    //Landing02
    document.querySelector('.suggestions-slider:nth-child(2) .suggestions-box:nth-child(1) .suggestions-text p').textContent = txtLanding[2][localCountryCode];
    document.querySelector('.suggestions-slider:nth-child(2) .suggestions-box:nth-child(2) .suggestions-text p').textContent = txtLanding[3][localCountryCode];

    //Landing03
    document.querySelector('.suggestions-slider:nth-child(3) .suggestions-box:nth-child(1) .suggestions-text p').textContent = txtLanding[4][localCountryCode];
    document.querySelector('.suggestions-slider:nth-child(3) .suggestions-box:nth-child(2) .suggestions-text p').textContent = txtLanding[5][localCountryCode];

    //chatbox prompt
    document.querySelector('.voice-timer p:nth-child(1)').textContent = txtLanding[6][localCountryCode];

    //ARLanding
    document.querySelector('.tap-to-learn-container h2 span.tap-cta').textContent = txtARLanding[0][localCountryCode];

    //Images
    document.querySelectorAll('img.click-to-play').forEach(el => el.src = imgLoc[0][localCountryCode]); // Gift
    document.querySelector('.shop-now-popup a img').src = imgLoc[1][localCountryCode];
    document.querySelector('.animation-sequence-container img:nth-child(1)').src = imgLoc[2][localCountryCode];
    document.querySelector('img.ask-me-anyting').src = imgLoc[3][localCountryCode];
    document.querySelector('#startRecord img').src = imgLoc[4][localCountryCode];
    document.querySelector('#stopRecord img').src = imgLoc[5][localCountryCode];

    //ShopNow
    document.querySelector('.shop-now-inner h3 span.norm').textContent = txtShopNow[0][localCountryCode];
    document.querySelector('.shop-now-inner h3.black').textContent = txtShopNow[1][localCountryCode];

  }

  document.getElementById('arIntroImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARIntro/ARHair_Intro_00000.webp');
  document.getElementById('arIdleImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARIdle/ARBear_Idle_00000.webp');
  document.getElementById('arGiftImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARGift/ARBear_Gift_00000.webp');
  document.getElementById('arBlowerImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_00000.webp');
  document.getElementById('arNailPolishImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_00000.webp');
  document.getElementById('arMirrorImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_00000.webp');

}

/**
 * Simple XOR encryption for session data using fixed salt "rabbithole"
 * 
 * @param {object} sessionData - The session data object to encrypt
 * @returns {string} Encrypted session data as base64 string
 */
function encryptSessionData(sessionData) {
  const ENCRYPT_SALT = "rabbithole";
  
  try {
    // Convert session data to JSON string
    const sessionDataString = JSON.stringify(sessionData);
    console.log('[GEO] Original session data:', sessionDataString);
    
    // Simple XOR encryption
    let encrypted = "";
    for (let i = 0; i < sessionDataString.length; i++) {
      const charCode = sessionDataString.charCodeAt(i);
      const saltCharCode = ENCRYPT_SALT.charCodeAt(i % ENCRYPT_SALT.length);
      encrypted += String.fromCharCode(charCode ^ saltCharCode);
    }
    
    // Return base64 encoded encrypted data
    const base64Encoded = btoa(encrypted);
    console.log('[GEO] Encrypted session data (base64):', base64Encoded);
    
    // Store the encrypted data in localStorage as both sessionId and session_params
    localStorage.setItem('sessionId', base64Encoded);
    console.log('[GEO] Encrypted session data stored in localStorage as both sessionId and session_params');
    
    return base64Encoded;
  } catch (error) {
    console.error('[GEO] Encryption failed:', error);
    // Fallback to base64 encoding only
    const sessionDataString = JSON.stringify(sessionData);
    const base64Encoded = btoa(sessionDataString);
    // Store the fallback data in localStorage as both sessionId and session_params
    localStorage.setItem('sessionId', base64Encoded);
    console.log('[GEO] Fallback: Session data stored with base64 encoding only in both sessionId and session_params');
    return base64Encoded;
  }
}