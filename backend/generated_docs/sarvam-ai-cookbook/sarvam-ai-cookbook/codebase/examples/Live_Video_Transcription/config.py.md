**Live Video Transcription Configuration Module**
=====================================================

**Overview**
------------

This module, `config.py`, is responsible for storing configuration settings for the Live Video Transcription application. It provides a centralized location for storing API keys, server settings, audio processing parameters, API settings, Flask configuration, file upload settings, and logging configuration.

**Functions/Classes**
---------------------

### Configuration Variables

The module exports several configuration variables that can be accessed and used throughout the application.

#### Sarvam AI Configuration

* `SARVAM_API_KEY`: The API key for the Sarvam AI service. It can be set using the `os.getenv` function or hardcoded as a default value.

```python
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "YOUR_API_KEY")
```

#### Server Configuration

* `HOST`: The hostname or IP address of the server.
* `PORT`: The port number used by the server.
* `DEBUG`: A boolean flag indicating whether the server is in debug mode.

```python
HOST = "0.0.0.0"
PORT = 5001
DEBUG = False
```

#### Audio Processing Settings

* `AUDIO_SAMPLE_RATE`: The sample rate of the audio data.
* `AUDIO_CHANNELS`: The number of audio channels.
* `CHUNK_DURATION_MS`: The duration of each audio chunk in milliseconds.

```python
AUDIO_SAMPLE_RATE = 16000
AUDIO_CHANNELS = 1
CHUNK_DURATION_MS = 3000  # 3 seconds
```

#### API Settings

* `API_LANGUAGE`: The language used by the API. Options include "en-IN", "hi", and "unknown".
* `API_TIMEOUT`: The timeout value for API requests in seconds.

```python
API_LANGUAGE = "unknown"  # Options: "en-IN", "hi", "unknown"
API_TIMEOUT = 10.0  # seconds
```

#### Flask Configuration

* `SECRET_KEY`: The secret key used by Flask for security purposes.
* `CORS_ALLOWED_ORIGINS`: The list of allowed origins for CORS requests.

```python
SECRET_KEY = "live_transcription_demo_secret_key"
CORS_ALLOWED_ORIGINS = "*"
```

#### File Upload Settings

* `MAX_CONTENT_LENGTH`: The maximum allowed content length for file uploads in bytes.
* `UPLOAD_FOLDER`: The folder path where uploaded files are stored.

```python
MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500MB
UPLOAD_FOLDER = "static"
```

#### Logging Configuration

* `LOG_LEVEL`: The logging level used by the application. Options include "DEBUG", "INFO", "WARNING", and "ERROR".

```python
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
```

**Dependencies**
----------------

The module imports the following external libraries:

* `os`: The `os` module is used to access environment variables and perform file system operations.

**Usage Examples**
-----------------

To use this module, simply import it and access the configuration variables as needed. Here's an example:

```python
from config import SARVAM_API_KEY, HOST, PORT

# Use the Sarvam AI API key
api_key = SARVAM_API_KEY

# Use the server configuration
server_host = HOST
server_port = PORT
```

**Edge Cases & Warnings**
-------------------------

* Make sure to set the `SARVAM_API_KEY` environment variable before running the application.
* The `HOST` and `PORT` values should be set to the desired server configuration.
* The `DEBUG` flag should be set to `True` for development purposes and `False` for production.
* The `LOG_LEVEL` should be set to the desired logging level.
* The `MAX_CONTENT_LENGTH` should be set to a reasonable value based on the expected file upload sizes.
* The `UPLOAD_FOLDER` should be set to a valid folder path where uploaded files can be stored.