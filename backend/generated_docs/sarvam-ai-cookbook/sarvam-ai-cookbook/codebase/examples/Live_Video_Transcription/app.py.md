**Live Video Transcription Module**
=====================================

**Overview**
------------

This module provides a Flask-based server for live video transcription and translation. It utilizes the Sarvam AI API for speech-to-text and translation services. The server exposes several endpoints for handling client connections, audio chunks, and translation requests.

**Functions/Classes**
---------------------

### `create_silence_base64()`

```python
def create_silence_base64():
    """Create silence audio for Sarvam API"""
    # ...
```

*   **Signature:** `create_silence_base64()`
*   **Parameters:** None
*   **Return Value:** Silence audio as Base64-encoded string
*   **Usage Example:**

    ```python
silence_b64 = create_silence_base64()
```

### `combine_silence_and_audio(audio_base64)`

```python
def combine_silence_and_audio(audio_base64):
    """Combine 1 second silence with audio data into single Base64 chunk"""
    # ...
```

*   **Signature:** `combine_silence_and_audio(audio_base64)`
*   **Parameters:** `audio_base64` (Base64-encoded audio data)
*   **Return Value:** Combined silence and audio as Base64-encoded string
*   **Usage Example:**

    ```python
combined_audio = combine_silence_and_audio(audio_base64)
```

### `process_audio_chunk(audio_data)`

```python
def process_audio_chunk(audio_data):
    """Process audio chunk with Sarvam AI - EXACT pattern from simple_transcriber.py"""
    # ...
```

*   **Signature:** `process_audio_chunk(audio_data)`
*   **Parameters:** `audio_data` (Base64-encoded audio data)
*   **Return Value:** Transcription text
*   **Usage Example:**

    ```python
transcription = process_audio_chunk(audio_data)
```

### `process_audio_chunk_translation(audio_data)`

```python
def process_audio_chunk_translation(audio_data):
    """Process audio chunk with Sarvam AI translation streaming"""
    # ...
```

*   **Signature:** `process_audio_chunk_translation(audio_data)`
*   **Parameters:** `audio_data` (Base64-encoded audio data)
*   **Return Value:** Translation text
*   **Usage Example:**

    ```python
translation = process_audio_chunk_translation(audio_data)
```

### `add_transcription_to_queue(transcription_data)`

```python
def add_transcription_to_queue(transcription_data):
    """Add transcription to both WebSocket and polling queue"""
    # ...
```

*   **Signature:** `add_transcription_to_queue(transcription_data)`
*   **Parameters:** `transcription_data` (transcription text and metadata)
*   **Return Value:** None
*   **Usage Example:**

    ```python
add_transcription_to_queue({"text": transcription, "timestamp": timestamp})
```

### `add_translation_to_queue(translation_data)`

```python
def add_translation_to_queue(translation_data):
    """Add translation to both WebSocket and polling queue"""
    # ...
```

*   **Signature:** `add_translation_to_queue(translation_data)`
*   **Parameters:** `translation_data` (translation text and metadata)
*   **Return Value:** None
*   **Usage Example:**

    ```python
add_translation_to_queue({"text": translation, "timestamp": timestamp})
```

**Dependencies**
----------------

*   **Flask:** Web framework for building the server
*   **Flask-SocketIO:** Library for handling WebSocket connections
*   **Sarvam AI API:** External API for speech-to-text and translation services
*   **pydub:** Library for audio processing and manipulation
*   **base64:** Built-in library for encoding and decoding Base64 strings

**Usage Examples**
------------------

### Starting the Server

```python
if __name__ == "__main__":
    logger.info("Starting Live Transcription Demo Server...")
    logger.info("Open http://localhost:5001 in your browser")
    socketio.run(app, debug=False, host="0.0.0.0", port=5001)
```

### Handling Client Connections

```python
@socketio.on("connect")
def handle_connect():
    """Handle client connection"""
    logger.info(f"Client connected: {request.sid}")
    active_clients.add(request.sid)
    emit("status", {"message": "Connected to transcription service"})
```

### Processing Audio Chunks

```python
@socketio.on("audio_chunk")
def handle_audio_chunk(data):
    """Handle incoming audio chunk from client"""
    try:
        # ...
        transcription = process_audio_chunk(audio_base64)
        # ...
    except Exception as e:
        logger.error(f"Error processing audio chunk: {e}")
        emit("error", {"message": f"Processing error: {str(e)}"})
```

### Processing Translation Chunks

```python
@socketio.on("translation_chunk")
def handle_translation_chunk(data):
    """Handle incoming audio chunk for translation"""
    try:
        # ...
        translation = process_audio_chunk_translation(audio_base64)
        # ...
    except Exception as e:
        logger.error(f"Error processing translation chunk: {e}")
        emit("error", {"message": f"Translation processing error: {str(e)}"})
```

**Edge Cases & Warnings**
-------------------------

*   **Audio Chunk Size Limitation:** The server has a limitation on the size of audio chunks that can be processed. If the chunk size exceeds this limit, the server may crash or produce incorrect results.
*   **Translation Chunk Processing Time:** The server has a limitation on the processing time for translation chunks. If the processing time exceeds this limit, the server may crash or produce incorrect results.
*   **Client Connection Disconnection:** If a client connection is disconnected, the server may not be able to process any further audio or translation chunks from that client.
*   **Server Restart:** If the server is restarted, all active client connections will be lost, and any pending audio or translation chunks will be discarded.