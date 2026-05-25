**Indic Soundbox AI - Text-to-Speech (TTS) Module**
=====================================================

**Overview**
------------

The `tts.py` module is part of the Indic Soundbox AI project, responsible for text-to-speech synthesis. It utilizes the Sarvam TTS API to generate audio from input text. This module is designed to handle chunking for texts longer than the API's character limit and provides a flexible way to customize the synthesis process.

**Functions/Classes**
---------------------

### `_clean_text_for_tts(text_input)`

**Signature:** `def _clean_text_for_tts(text_input: str) -> str`

**Parameters:**

* `text_input`: The input text to be cleaned (str)

**Return Value:**

* The cleaned text (str)

**Description:** Removes common markdown, multiple spaces, and emojis from the input text.

**Usage Example:**
```python
cleaned_text = _clean_text_for_tts("Hello, **world**! 🌎")
print(cleaned_text)  # Output: "Hello world"
```

### `_call_sarvam_tts(text_chunk, lang_code, speaker='shubh', model='bulbul:v3')`

**Signature:** `def _call_sarvam_tts(text_chunk: str, lang_code: str, speaker: str = 'shubh', model: str = 'bulbul:v3') -> str`

**Parameters:**

* `text_chunk`: The text chunk to be synthesized (str)
* `lang_code`: The language code for the synthesis (str)
* `speaker`: The speaker name (str, default: 'shubh')
* `model`: The TTS model to use (str, default: 'bulbul:v3')

**Return Value:**

* The base64 encoded audio data (str)

**Description:** Calls the Sarvam TTS API to synthesize the input text chunk.

**Usage Example:**
```python
base64_audio = _call_sarvam_tts("Hello world", "en-US")
print(base64_audio)
```

### `_chunk_text_boundary_aware(text, max_length)`

**Signature:** `def _chunk_text_boundary_aware(text: str, max_length: int) -> list[str]`

**Parameters:**

* `text`: The input text to be chunked (str)
* `max_length`: The maximum length of each chunk (int)

**Return Value:**

* A list of chunked text (list[str])

**Description:** Chunks the input text into smaller pieces while respecting sentence and word boundaries.

**Usage Example:**
```python
text = "This is a very long sentence that needs to be chunked."
chunks = _chunk_text_boundary_aware(text, 50)
print(chunks)
```

### `_concatenate_wav_from_base64_list(base64_audio_list)`

**Signature:** `def _concatenate_wav_from_base64_list(base64_audio_list: list[str]) -> str`

**Parameters:**

* `base64_audio_list`: A list of base64 encoded audio data (list[str])

**Return Value:**

* The concatenated base64 encoded audio data (str)

**Description:** Concatenates a list of base64 encoded audio data into a single string.

**Usage Example:**
```python
base64_audio_list = ["audio1", "audio2", "audio3"]
final_audio = _concatenate_wav_from_base64_list(base64_audio_list)
print(final_audio)
```

### `text_to_speech(text, lang_code, speaker='shubh', model='bulbul:v3')`

**Signature:** `def text_to_speech(text: str, lang_code: str, speaker: str = 'shubh', model: str = 'bulbul:v3') -> str`

**Parameters:**

* `text`: The input text to be synthesized (str)
* `lang_code`: The language code for the synthesis (str)
* `speaker`: The speaker name (str, default: 'shubh')
* `model`: The TTS model to use (str, default: 'bulbul:v3')

**Return Value:**

* The base64 encoded audio data (str)

**Description:** Converts the input text to speech using the Sarvam TTS API.

**Usage Example:**
```python
text = "Hello world"
lang_code = "en-US"
base64_audio = text_to_speech(text, lang_code)
print(base64_audio)
```

**Dependencies**
----------------

* `requests`: Used for making API calls to the Sarvam TTS API.
* `re`: Used for regular expression cleaning of the input text.
* `base64`: Used for encoding and decoding audio data.
* `wave`: Used for handling WAV audio files.
* `dotenv`: Used for loading environment variables from a `.env` file.

**Usage Examples**
------------------

### Basic Usage
```python
text = "Hello world"
lang_code = "en-US"
base64_audio = text_to_speech(text, lang_code)
print(base64_audio)
```

### Chunking Example
```python
text = "This is a very long sentence that needs to be chunked."
chunks = _chunk_text_boundary_aware(text, 50)
print(chunks)
```

### Concatenation Example
```python
base64_audio_list = ["audio1", "audio2", "audio3"]
final_audio = _concatenate_wav_from_base64_list(base64_audio_list)
print(final_audio)
```

**Edge Cases & Warnings**
-------------------------

* The Sarvam TTS API has a character limit of 2500 characters. If the input text exceeds this limit, it will be chunked into smaller pieces.
* The `text_to_speech` function will raise an exception if the input text is empty or whitespace-only.
* The `text_to_speech` function will raise an exception if the Sarvam TTS API returns an error response.
* The `concatenate_wav_from_base64_list` function will raise an exception if the input list is empty or contains invalid audio data.