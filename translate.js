
// version 1.1 - removed the error on line 26
console.log("geo.js v=2.0");
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
    GB: "Speaking...",
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




var localCountryCode = '';
var localLanguage = '';

// API URL for geolocation requests
// const api_url = 'https://api-stage.ivybears.ai/';


function runTranslation(countryCode) {
  console.log("runTranslation called with country code: " + countryCode);

  if (countriesVO[countryCode] !== null && countriesVO[countryCode] !== undefined) {
    // document.getElementById('ai-vo').setAttribute('src','assets/Media/VO/' + countriesVO[countryCode]);
    // document.getElementById('ar-intro').setAttribute('src','assets/Media/ARVO/' + countriesARVO[countryCode]);

    // document.getElementById('ar-blower').setAttribute('src','assets/Media/ARVO/' + arARVO[0][countryCode]);
    // document.getElementById('ar-mirror').setAttribute('src','assets/Media/ARVO/' + arARVO[1][countryCode]);
    // document.getElementById('ar-nail-polish').setAttribute('src','assets/Media/ARVO/' + arARVO[2][countryCode]);
    // document.getElementById('ar-gift').setAttribute('src','assets/Media/ARVO/' + arARVO[3][countryCode]);
  
    //Splash
    // document.querySelector('.camera-prompt .prompt-message h3').textContent = txtSplash[0][countryCode];
    // document.querySelector('.camera-prompt .click-camera').textContent = txtSplash[1][countryCode];

    //Access
    // document.querySelector('.custom-popup .popup-container h3').textContent = txtAccess[0][countryCode];
    // document.querySelector('.custom-popup .popup-container .on-sound').textContent = txtAccess[1][countryCode];

    //Landing01
    document.querySelector('.suggestions-slider:nth-child(1) .suggestions-box:nth-child(1) .suggestions-text p').textContent = txtLanding[0][countryCode];
    document.querySelector('.suggestions-slider:nth-child(1) .suggestions-box:nth-child(2) .suggestions-text p').textContent = txtLanding[1][countryCode];

    //Landing02
    document.querySelector('.suggestions-slider:nth-child(2) .suggestions-box:nth-child(1) .suggestions-text p').textContent = txtLanding[2][countryCode];
    document.querySelector('.suggestions-slider:nth-child(2) .suggestions-box:nth-child(2) .suggestions-text p').textContent = txtLanding[3][countryCode];

    //Landing03
    document.querySelector('.suggestions-slider:nth-child(3) .suggestions-box:nth-child(1) .suggestions-text p').textContent = txtLanding[4][countryCode];
    document.querySelector('.suggestions-slider:nth-child(3) .suggestions-box:nth-child(2) .suggestions-text p').textContent = txtLanding[5][countryCode];

    //chatbox prompt
    document.querySelector('.voice-timer p:nth-child(1)').textContent = txtLanding[6][countryCode];

    //ARLanding
    document.querySelector('.tap-to-learn-container h2 span.tap-cta').textContent = txtARLanding[0][countryCode];

    //Images
    document.querySelectorAll('img.click-to-play').forEach(el => el.src = imgLoc[0][countryCode]); // Gift
    document.querySelector('.shop-now-popup a img').src = imgLoc[1][countryCode];
    document.querySelector('.animation-sequence-container img:nth-child(1)').src = imgLoc[2][countryCode];
    document.querySelector('img.ask-me-anyting').src = imgLoc[3][countryCode];
    document.querySelector('#startRecord img').src = imgLoc[4][countryCode];
    document.querySelector('#stopRecord img').src = imgLoc[5][countryCode];

    //ShopNow
    document.querySelector('.shop-now-inner h3 span.norm').textContent = txtShopNow[0][countryCode];
    document.querySelector('.shop-now-inner h3.black').textContent = txtShopNow[1][countryCode];

  }

  document.getElementById('arIntroImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARIntro/ARHair_Intro_00000.webp');
  document.getElementById('arIdleImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARIdle/ARBear_Idle_00000.webp');
  document.getElementById('arGiftImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARGift/ARBear_Gift_00000.webp');
  document.getElementById('arBlowerImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_00000.webp');
  document.getElementById('arNailPolishImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_00000.webp');
  document.getElementById('arMirrorImg').setAttribute('src','assets/Media/'+ localLanguage +'/ARBlower/ARBear_Blower_00000.webp');

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
      
      // Try to get IP address (using a free IP API service)
      let ipAddress = 'unknown';
      let country = 'unknown';
      try {
        const ipResponse = await fetch('http://ip-api.com/json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.query || 'unknown';
        country = ipData.country || 'unknown';
      } catch (ipError) {
        // Fallback: use a hashed combination of other identifiers if IP fails
        ipAddress = 'local-' + Math.random().toString(36).substr(2, 9);
      }
      
          // Save all parameters to localStorage
      localStorage.setItem('session_params', JSON.stringify({
        timestamp: timestamp,
        ipAddress: ipAddress,
        country: country,
        timezone: timezone,
        platform: platform,
        browserLang: browserLang,
        screenResolution: screenResolution
      }));

      // Create a meaningful session ID format: timestamp_ip_country_timezone_platform_lang_resolution
      const sessionIdString = `${timestamp}_${ipAddress}_${country}_${timezone}_${platform}_${browserLang}_${screenResolution}`;
      
      // Encrypt the session ID to hide user information
      try {
        const encryptedSessionId = encryptSessionData(sessionIdString);
        console.log("Generated encrypted session ID (original data hidden)");
        return encryptedSessionId;
      } catch (error) {
        console.warn("Session encryption failed, using unencrypted session ID:", error);
        return sessionIdString;
      }
    } catch (error) {
      // Fallback session ID if anything fails
      console.error("Error generating session ID:", error);
      const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Try to encrypt the fallback ID too
      try {
        return encryptSessionData(fallbackId);
      } catch (error) {
        console.warn("Failed to encrypt fallback session ID:", error);
        return fallbackId;
      }
    }
  }


window.addEventListener("load", () => {
  // Try browser geolocation first (requires HTTPS and user permission)
  if ("geolocation" in navigator) {
    console.log("Browser geolocation available, requesting permission...");
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      timeout: 10000, // 10 second timeout
      enableHighAccuracy: false
    });
  } else {
    console.log("Browser geolocation not supported, using server-side fallback");
    getCountryFromCoordinates(); // Call without coordinates to trigger IP geolocation
  }

  function onSuccess(position) {
      console.log("Browser geolocation successful");
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      getCountryFromCoordinates(lat, lng);
    }

    function onError(error) {
      console.log("Browser geolocation failed: " + error.message + ", using server-side fallback");
      getCountryFromCoordinates(); // Call without coordinates to trigger IP geolocation
    }

    function getCountryFromCoordinates(lat, lng) {
      // Call backend geolocation endpoint instead of directly calling Google Maps API
      const requestBody = {};
      
      // Only include coordinates if they were provided
      if (typeof lat !== 'undefined' && typeof lng !== 'undefined') {
        requestBody.latitude = lat;
        requestBody.longitude = lng;
        console.log(`Using browser coordinates: ${lat}, ${lng}`);
      } else {
        console.log("No coordinates provided, using IP-based geolocation");
      }

      // Make request to backend geolocation endpoint
      fetch(api_url + 'api/geolocation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.country_code) {
            console.log(`Geolocation successful: You are in ${data.country_code}. Source: ${data.source || 'unknown'}`);

            // Force DE for German translation testing
            localCountryCode = 'GB';

            // localLanguage = ["DE","PH"].includes(localCountryCode) ? "DE" : "EN"; //main.js
            localLanguage = ["DE"].includes(localCountryCode) ? "DE" : "EN"; //main.js
            console.log("calling runTranslation with country code: " + localCountryCode);
            runTranslation(localCountryCode);

          } else {
            console.log("Geolocation failed: " + (data.error || "Unknown error"));
            // Fallback to default country
            localCountryCode = 'GB';
            localLanguage = 'EN';
            runTranslation(localCountryCode);
          }
        })
        .catch((err) => {
          console.log("Geolocation request failed: " + err);
          // Fallback to default country on network error
         
          localLanguage = 'EN';
          runTranslation(localCountryCode);
        });
    }
});