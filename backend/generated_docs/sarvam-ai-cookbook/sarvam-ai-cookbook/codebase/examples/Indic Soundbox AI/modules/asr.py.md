**Indic Soundbox AI - ASR Module**
=====================================

**Overview**
------------

The `asr.py` module is part of the Indic Soundbox AI project and provides a function for speech-to-text conversion using the Sarvam ASR API. This module is responsible for sending audio data to the Sarvam API and returning the transcribed text.

**Functions/Classes**
---------------------

### `speech_to_text(audio_blob)`

#### Signature
```python
def speech_to_text(audio_blob):
```

#### Parameters

* `audio_blob`: The audio data to be transcribed.

#### Return Values

* The transcribed text as a string.

#### Usage Example
```python
import os
from dotenv import load_dotenv
from asr import speech_to_text

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

audio_blob = b'audio_data'  # Replace with actual audio data
transcript = speech_to_text(audio_blob)
print(transcript)
```

#### Description

This function sends the provided `audio_blob` to the Sarvam ASR API and returns the transcribed text. It requires the `SARVAM_API_KEY` environment variable to be set.

### `load_dotenv()`

#### Signature
```python
load_dotenv()
```

#### Parameters

* None

#### Return Values

* None

#### Usage Example
```python
import os
from dotenv import load_dotenv
from asr import load_dotenv

load_dotenv()
```

#### Description

This function loads the environment variables from the `.env` file.

### `os.getenv("SARVAM_API_KEY")`

#### Signature
```python
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
```

#### Parameters

* None

#### Return Values

* The value of the `SARVAM_API_KEY` environment variable.

#### Usage Example
```python
import os
from dotenv import load_dotenv
from asr import os

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
```

#### Description

This function retrieves the value of the `SARVAM_API_KEY` environment variable.

**Dependencies**
----------------

* `requests`: Used for making HTTP requests to the Sarvam ASR API.
* `os`: Used for accessing environment variables.
* `dotenv`: Used for loading environment variables from the `.env` file.

**Usage Examples**
------------------

### Real-world Example

```python
import os
from dotenv import load_dotenv
from asr import speech_to_text

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

audio_blob = b'audio_data'  # Replace with actual audio data
transcript = speech_to_text(audio_blob)
print(transcript)
```

### Edge Cases & Warnings
-------------------------

* Make sure to set the `SARVAM_API_KEY` environment variable before using this module.
* The `speech_to_text()` function raises a `ValueError` if the `SARVAM_API_KEY` is not set.
* The `speech_to_text()` function raises an exception if the Sarvam ASR API request fails.
* This module assumes that the audio data is in WAV format. If the audio data is in a different format, you may need to modify the `files` dictionary in the `speech_to_text()` function.