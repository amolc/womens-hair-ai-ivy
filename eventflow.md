# Application Event Flow

This document outlines the event flow of the web application, from initial page load to user interaction with the AR and chatbot features.

## 1. Initial Page Load and Asset Preloading

1.  **`window.onload` Event**:
    *   The `setVh()` function is called to set the viewport height for consistent styling.
    *   The `enableCamera()` function is triggered, which begins the preloading of assets for the AI chatbot.

2.  **`enableCamera()` Function**:
    *   The loading container is displayed to the user.
    *   `loadAiAnimations()` is called to start preloading the AI chatbot's image sequences (intro and idle animations).
    *   `preloadIntroImages()` is called for each animation, which loads the individual image frames.
    *   `preloadIntroAudio()` is called to load the audio files for the AI chatbot.
    *   The `updateintroLoadingBar()` function is called each time an asset is loaded to update the loading bar's progress.

3.  **Loading Completion**:
    *   Once all AI assets are loaded (`progress >= 98`), the loading container is hidden.
    *   The `afterAccess()` function is called, which displays the AI chatbot interface.

## 2. AI Chatbot Interaction

1.  **`afterAccess()` Function**:
    *   The AI chatbot interface is displayed.
    *   The Slick slider for suggestions is initialized.
    *   The intro animation for the AI chatbot is played.

2.  **User Interaction**:
    *   The user can click on a suggestion or use the "Hold to Speak" button to interact with the chatbot.
    *   The `startVoice()` function is called when the user holds down the "Hold to Speak" button, which starts the speech recognition.
    *   The `endVoice()` function is called when the user releases the button, which stops the speech recognition and sends the user's query to the `getOpenAiData()` function.

3.  **OpenAI API**:
    *   The `getOpenAiData()` function sends the user's query to the OpenAI API.
    *   The API's response is then used to generate the chatbot's audio response using the `getOpenAiTextToSpeech()` function.

4.  **Chatbot Response**:
    *   The chatbot's response is displayed in the chat window.
    *   The audio response is played.
    *   The chatbot's idle animation is played while it is waiting for the user's next input.

## 3. AR Experience

1.  **`.click-to-play` Event**:
    *   When the user clicks the "Click to Play" button, the AR experience is initiated.
    *   The `conditionalArLoader()` function is called to load the AR assets if they are not already cached.

2.  **`conditionalArLoader()` Function**:
    *   If the AR assets are not cached, the loading container is displayed.
    *   `loadArAudio()` is called to load the AR audio files.
    *   `loadArAnimations()` is called to load the AR image sequences.
    *   The `updateLoadingBar()` function is called each time an asset is loaded to update the loading bar's progress.

3.  **AR Intro**:
    *   Once the AR assets are loaded, the `playArIntroAnimation()` function is called.
    *   The AR intro animation and audio are played.
    *   The AR "gadgets" are displayed to the user.

4.  **AR Gadget Interaction**:
    *   The user can click on the AR gadgets to trigger different animations and sounds.
    *   Each gadget has its own `play...Animation()` function (e.g., `playArBlowerAnimation()`, `playArGiftAnimation()`, etc.).

        *   **`playArBlowerAnimation()`**: Plays the hair blower animation and sound.
        *   **`playArGiftAnimation()`**: Plays the gift box animation and sound.
        *   **`playArMirrorAnimation()`**: Plays the mirror animation and sound.
        *   **`playArNailPolishAnimation()`**: Plays the nail polish animation and sound.

## 4. Navigation

1.  **Back Button**:
    *   The user can click the back button to return to the previous screen.
    *   When navigating back from the AR experience, the `stopAllAr()` function is called to stop all AR animations and audio.
    *   When navigating back from the chatbot interface, the `stopAllSpeech()` and `stopAnimation()` functions are called to stop the chatbot's audio and animations.

## 5. Audio Control

1.  **Sound Toggle**:
    *   The user can click the sound toggle button to mute or unmute the application's audio.
    *   The `offSound()` function is called to mute the audio, which pauses all music and voiceovers and stops any text-to-speech audio.
    *   The `onSound()` function is called to unmute the audio, which resumes all music and voiceovers.