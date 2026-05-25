**Indic Soundbox AI - Language Identification Module (lid.py)**
===========================================================

**Overview**
------------

The `lid.py` module is part of the Indic Soundbox AI project and provides a function to identify the language and script of a given text using the Sarvam LID API. This module is designed to be used in conjunction with other Indic Soundbox AI modules to perform various NLP tasks.

**Functions/Classes**
---------------------

### `identify_language(text)`

#### Signature
```python
def identify_language(text: str) -> dict
```

#### Parameters

* `text`: The text to identify the language and script for. It can be a string of any length.

#### Return Values

* A dictionary containing the language and script codes.

#### Usage Example
```python
import os
from dotenv import load_dotenv
from lid import identify_language

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

text = "Hello, how are you?"
language_data = identify_language(text)
print(language_data)  # Output: {'language': 'en', 'script': 'latn'}
```

#### Description

This function sends the input text to the Sarvam LID API and returns the language and script codes. It first checks if the `SARVAM_API_KEY` environment variable is set. If not, it raises a `ValueError`. It then constructs the API request headers and payload, sends the request, and checks the response status code. If the response is not OK, it raises an exception. Finally, it returns the language and script codes from the API response.

**Dependencies**
----------------

* `requests`: Used to send the API request to the Sarvam LID API.
* `os`: Used to load environment variables.
* `dotenv`: Used to load environment variables from a `.env` file.

**Usage Examples**
------------------

### Example 1: Identifying Language and Script of a Single Text

```python
import os
from dotenv import load_dotenv
from lid import identify_language

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

text = "Hello, how are you?"
language_data = identify_language(text)
print(language_data)  # Output: {'language': 'en', 'script': 'latn'}
```

### Example 2: Identifying Language and Script of Multiple Texts

```python
import os
from dotenv import load_dotenv
from lid import identify_language

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

texts = ["Hello, how are you?", "Bonjour, comment allez-vous?", "नमस्ते"]
language_data = [identify_language(text) for text in texts]
print(language_data)
# Output: [{'language': 'en', 'script': 'latn'}, {'language': 'fr', 'script': 'latn'}, {'language': 'sa', 'script': 'deva'}]
```

**Edge Cases & Warnings**
-------------------------

* Make sure to set the `SARVAM_API_KEY` environment variable before using this module.
* The Sarvam LID API has usage limits and requirements. Please refer to their documentation for more information.
* This module assumes that the Sarvam LID API is available and responding correctly. If the API is down or responding incorrectly, this module will raise an exception.