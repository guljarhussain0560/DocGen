**Indic Soundbox AI Module Documentation**
=====================================

**Overview**
------------

This module, `main.js`, is a JavaScript file responsible for handling audio recording, processing, and speech synthesis in the Indic Soundbox AI project. It utilizes the Web Audio API, MediaRecorder API, and Fetch API to interact with the Flask backend. The module's primary function is to enable users to record audio, transcribe it using ASR (Automatic Speech Recognition), detect the language, and respond with a synthesized speech using TTS (Text-to-Speech).

**Functions/Classes**
--------------------

### `createSoundBars()`

* **Signature:** `createSoundBars()`
* **Parameters:** None
* **Return Value:** None
* **Description:** Initializes the sound bar container by creating a specified number of sound bars.
* **Usage Example:**
```javascript
createSoundBars();
```

### `updateSoundBars()`

* **Signature:** `updateSoundBars()`
* **Parameters:** None
* **Return Value:** None
* **Description:** Updates the sound bars based on the audio frequency data.
* **Usage Example:**
```javascript
updateSoundBars();
```

### `setStatus(message, isError = false)`

* **Signature:** `setStatus(message, isError = false)`
* **Parameters:**
	+ `message`: The status message to display.
	+ `isError`: A boolean indicating whether the message is an error (default: `false`).
* **Return Value:** None
* **Description:** Updates the status message element with the provided message and color.
* **Usage Example:**
```javascript
setStatus("Recording started");
```

### `startVad(stream)`

* **Signature:** `startVad(stream)`
* **Parameters:**
	+ `stream`: The audio stream to process.
* **Return Value:** None
* **Description:** Initializes the Voice Activity Detection (VAD) components and starts processing the audio stream.
* **Usage Example:**
```javascript
startVad(stream);
```

### `stopVad()`

* **Signature:** `stopVad()`
* **Parameters:** None
* **Return Value:** None
* **Description:** Stops the VAD components and resets the sound bars.
* **Usage Example:**
```javascript
stopVad();
```

### `stopRecordingDueToSilence()`

* **Signature:** `stopRecordingDueToSilence()`
* **Parameters:** None
* **Return Value:** None
* **Description:** Stops the recording due to silence detection.
* **Usage Example:**
```javascript
stopRecordingDueToSilence();
```

### `processAudioPipeline()`

* **Signature:** `processAudioPipeline()`
* **Parameters:** None
* **Return Value:** None
* **Description:** Processes the recorded audio using ASR, LID, and TTS.
* **Usage Example:**
```javascript
processAudioPipeline();
```

### `playResponseAudio(audioId)`

* **Signature:** `playResponseAudio(audioId)`
* **Parameters:**
	+ `audioId`: The ID of the audio to play.
* **Return Value:** None
* **Description:** Plays the response audio using the provided ID.
* **Usage Example:**
```javascript
playResponseAudio(audioId);
```

### `sendASR(wavBlob)`

* **Signature:** `sendASR(wavBlob)`
* **Parameters:**
	+ `wavBlob`: The audio blob to send for ASR.
* **Return Value:** A promise resolving to the ASR transcript.
* **Description:** Sends the audio blob to the Flask backend for ASR processing.
* **Usage Example:**
```javascript
sendASR(wavBlob).then(transcript => console.log(transcript));
```

### `sendLID(text)`

* **Signature:** `sendLID(text)`
* **Parameters:**
	+ `text`: The text to send for LID.
* **Return Value:** A promise resolving to the LID result.
* **Description:** Sends the text to the Flask backend for LID processing.
* **Usage Example:**
```javascript
sendLID(text).then(result => console.log(result));
```

### `sendChat(userText)`

* **Signature:** `sendChat(userText)`
* **Parameters:**
	+ `userText`: The user's text to send for chat.
* **Return Value:** A promise resolving to the chat response.
* **Description:** Sends the user's text to the Flask backend for chat processing.
* **Usage Example:**
```javascript
sendChat(userText).then(reply => console.log(reply));
```

### `sendTTS(text, langCode)`

* **Signature:** `sendTTS(text, langCode)`
* **Parameters:**
	+ `text`: The text to send for TTS.
	+ `langCode`: The language code for TTS.
* **Return Value:** A promise resolving to the TTS response.
* **Description:** Sends the text and language code to the Flask backend for TTS processing.
* **Usage Example:**
```javascript
sendTTS(text, langCode).then(response => console.log(response));
```

**Dependencies**
----------------

* `MediaRecorder`: Used for recording audio.
* `Web Audio API`: Used for audio processing and synthesis.
* `Fetch API`: Used for sending requests to the Flask backend.
* `FormData`: Used for sending form data to the Flask backend.

**Usage Examples**
-----------------

### Recording Audio

```javascript
micBtn.onclick = async () => {
  // ...
};
```

### Processing Audio Pipeline

```javascript
processAudioPipeline().then(() => console.log("Audio pipeline processed"));
```

### Playing Response Audio

```javascript
playResponseAudio(audioId).then(() => console.log("Response audio played"));
```

**Edge Cases & Warnings**
-------------------------

* Make sure to handle errors and exceptions properly when using the `MediaRecorder` and `Fetch API`.
* Ensure that the Flask backend is properly configured and running before using this module.
* Be aware of the limitations and constraints of the `Web Audio API` and `MediaRecorder API`.
* Use the `sendASR`, `sendLID`, `sendChat`, and `sendTTS` functions carefully, as they send requests to the Flask backend.