# `geo.js` Documentation

This document details the contents and functionality of the `geo.js` file.

## Overview

The `geo.js` file is responsible for handling the localization of assets and text based on the user's geographical location. It defines a series of constants that map country codes to localized resources, and it provides a function to apply these resources to the DOM.

## Constants

The following constants are defined in `geo.js`:

- **`countriesVO`**: An object that maps country codes to introductory voice-over audio files.
- **`countriesARVO`**: An object that maps country codes to augmented reality (AR) introductory voice-over audio files.
- **`arARVO`**: An array of objects that map country codes to various AR-related voice-over audio files (e.g., for the blower, mirror, nail polish, and gift).
- **`imgLoc`**: An array of objects that map country codes to localized image assets.
- **`txtSplash`**: An array of objects that map country codes to localized text for the splash screen.
- **`txtAccess`**: An array of objects that map country codes to localized text for the access prompt.
- **`txtLanding`**: An array of objects that map country codes to localized text for the landing page.
- **`txtARLanding`**: An array of objects that map country codes to localized text for the AR landing page.
- **`txtShopNow`**: An array of objects that map country codes to localized text for the "Shop Now" section.

## Functions

### `runTranslation(countryCode)`

This function takes a country code as input and updates the DOM with the appropriate localized assets and text. It performs the following actions:

- Sets the `src` attribute of various audio and image elements to the localized versions.
- Updates the `textContent` of various text elements with the localized strings.

### Geolocation

The file also includes a section that attempts to determine the user's location. It first tries to use the browser's `geolocation` API. If that fails or is not supported, it falls back to an IP-based geolocation service. Once the location is determined, it calls the `runTranslation` function with the appropriate country code.