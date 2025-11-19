window.addEventListener("load", () => {
    // Check if Geolocation is available

    const countriesVO = {
      GB: "Intro Ai VO.mp3#t=0.001",
      DE: "ADA-DE-VO.mp3#t=0.001"
    };

    const countriesARVO = {
      GB: "ARIntro VO.mp3#t=0.001",
      DE: "ARIntro-VO-DE.mp3#t=0.001"
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function onSuccess(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log ('latitude' + lat);
        console.log ('longitude' + lng);
        getCountryFromCoordinates(lat, lng);
      }

      function onError(error) {
        console.log("Unable to retrieve location. " + error.message);
      }

      function getCountryFromCoordinates(lat, lng) {
        // 1) Replace with your valid Google Maps Geocoding API key
        const googleApiKey = "AIzaSyAoBfRcqPY61h115UrvUoTGwXfRTO_FnBs"; 
        // 2) Construct the Geocoding API request
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`;

        // 3) Fetch the JSON response
        fetch(geocodeUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "OK" && data.results.length > 0) {
              // Parse address components to find the country
              const addressComponents = data.results[0].address_components;
              const countryComponent = addressComponents.find((component) =>
                component.types.includes("country")
              );

              if (countryComponent) {
                console.log(`You are in ${countryComponent.short_name}.`);
                let country = countryComponent.short_name;
                if (countriesVO[country] !== null && countriesVO[country] !== undefined) {
                  document.getElementById('ai-vo').setAttribute('src','assets/Media/VO/' + countriesVO[country]);
                  document.getElementById('ar-intro').setAttribute('src','assets/Media/ARVO/' + countriesARVO[country]);
                }

              } else {
                console.log("Unable to find country data.");
              }
            } else {
              console.log("Geocoding API error: " + data.status);
            }
          })
          .catch((err) => {
            console.log("Request failed. " + err);
          });
      }
  });
