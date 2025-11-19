

const countriesVO = {
  GB: "Intro Ai VO.mp3#t=0.001",
  DE: "ADA-DE-VO.mp3#t=0.001",
  SG: "ADA-DE-VO.mp3#t=0.001",
  PH: "ADA-DE-VO.mp3#t=0.001"
};

const countriesARVO = {
  GB: "ARIntro VO.mp3#t=0.001",
  DE: "ARIntro-VO-DE.mp3#t=0.001",
  SG: "ARIntro-VO-DE.mp3#t=0.001",
  PH: "ARIntro-VO-DE.mp3#t=0.001"
};

const arARVO = [
  {
    GB: 'Blower VO.mp3#t=0.001',
    DE: 'Blower-VO-DE.mp3#t=0.001',
    SG: 'Blower-VO-DE.mp3#t=0.001',
    PH: 'Blower-VO-DE.mp3#t=0.001'
  },
  {
    GB: 'Mirror VO.mp3#t=0.001',
    DE: 'Mirror-VO-DE.mp3#t=0.001',
    SG: 'Mirror-VO-DE.mp3#t=0.001',
    PH: 'Mirror-VO-DE.mp3#t=0.001'
  },
  {
    GB: 'Nail Polish VO.mp3#t=0.001',
    DE: 'Nail-Polish-VO-DE.mp3#t=0.001',
    SG: 'Nail-Polish-VO-DE.mp3#t=0.001',
    PH: 'Nail-Polish-VO-DE.mp3#t=0.001'
  },
  {
    GB: 'Gift VO.mp3#t=0.001',
    DE: 'Gift-VO-DE.mp3#t=0.001',
    SG: 'Gift-VO-DE.mp3#t=0.001',
    PH: 'Gift-VO-DE.mp3#t=0.001'
  }
]

const imgLoc = [
  {   
    GB: "assets/Click to play - CTA.svg",
    DE: "assets/loc/img/DE/Click to play - CTA.svg",
    SG: "assets/loc/img/DE/Click to play - CTA.svg",
    PH: "assets/loc/img/DE/Click to play - CTA.svg"
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


  const introtext = {
          US: "Hi I'm Ada, your artificial health advisor. Ask me anything and I'll try to help you!",
          EN: "Hi I'm Ada, your artificial health advisor. Ask me anything and I'll try to help you!",
          GB: "Hi I'm Ada, your artificial health advisor. Ask me anything and I'll try to help you!",
          IN: "Hi I'm Ada, your artificial health advisor. Ask me anything and I'll try to help you!",
          DE: "Hallo, ich bin Ada, deine künstliche Gesundheitsberaterin. Frag mich alles und ich werde versuchen, dir zu helfen!",
          SG: "Hi I'm Ada, your artificial health advisor. Ask me anything and I'll try to help you!"
        };

var localCountryCode = '';
var localLanguage = '';

function runTranslation(countryCode) {
  
   console.log('runTranslation', countryCode);
   const introText = introtext[countryCode] || introtext['GB'];
   document.querySelector('p.introtxt').textContent = introText;

}

window.addEventListener("load", () => {
  // Check if Geolocation is available

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  function onSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      getCountryFromCoordinates(lat, lng);
    }

    function onError(error) {
      console.log("Unable to retrieve location. " + error.message);
    }

    function getCountryFromCoordinates(lat, lng) {
      // Call backend geolocation endpoint instead of directly calling Google Maps API
      const requestBody = {
        latitude: lat,
        longitude: lng
      };

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
            console.log(`You are in ${data.country_code}.`);

            // if(["SG"].includes(data.country_code)) {
            if(["SG", "PH"].includes(data.country_code)) {
              localCountryCode = 'GB';
            } else if([].includes(data.country_code)) {
              localCountryCode = 'DE';
            } 
            else {
              localCountryCode = data.country_code; //ai.js
            }

            // localLanguage = ["DE","PH"].includes(localCountryCode) ? "DE" : "EN"; //main.js
            localLanguage = ["DE"].includes(localCountryCode) ? "DE" : "EN"; //main.js

            runTranslation(localCountryCode);

          } else {
            console.log("Unable to find country data: " + (data.error || "Unknown error"));
          }
        })
        .catch((err) => {
          console.log("Geolocation request failed: " + err);
        });
    }
});