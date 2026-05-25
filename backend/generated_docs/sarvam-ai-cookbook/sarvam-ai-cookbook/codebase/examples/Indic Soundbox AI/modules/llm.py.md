**Indic Soundbox AI - LLM Module**
=====================================

**Overview**
------------

This module, `llm.py`, is part of the Indic Soundbox AI project and provides a function to interact with the Sarvam Chat Completion API. It loads merchant context from a markdown file and uses it to generate responses to user input.

**Functions/Classes**
---------------------

### `load_merchant_context()`

Loads merchant context from the markdown file `merchant_context.md`.

```python
def load_merchant_context():
    """Loads merchant context from the markdown file."""
    try:
        with open(MERCHANT_CONTEXT_FILE, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return ""
```

**Usage Example:**
```python
merchant_context = load_merchant_context()
print(merchant_context)
```

### `get_chat_completion(user_text)`

Sends user text to the Sarvam Chat Completion API with merchant context.

```python
def get_chat_completion(user_text):
    """
    Sends user text to Sarvam Chat Completion API with merchant context.
    """
    # ...
```

**Usage Example:**
```python
user_text = "क्या मैं अपनी दुकान की जानकारी डाल सकता हूँ?"
response = get_chat_completion(user_text)
print(response)
```

**Dependencies**
----------------

* `requests`: For making HTTP requests to the Sarvam Chat Completion API.
* `os`: For loading environment variables.
* `dotenv`: For loading environment variables from a `.env` file.

**Usage Examples**
------------------

### Real-World Example:

```python
user_text = "क्या मैं अपनी दुकान की जानकारी डाल सकता हूँ?"
response = get_chat_completion(user_text)
print(response)
```

### Example with Merchant Context:

```python
merchant_context = load_merchant_context()
user_text = "क्या मैं अपनी दुकान की जानकारी डाल सकता हूँ?"
response = get_chat_completion(user_text)
print(response)
```

**Edge Cases & Warnings**
-------------------------

* Make sure to set the `SARVAM_API_KEY` environment variable before using this module.
* The `merchant_context.md` file should be in the same directory as this module.
* The Sarvam Chat Completion API may have usage limits or requirements for authentication. Please check their documentation for more information.
* This module assumes that the Sarvam Chat Completion API is available and responding correctly. If the API is down or returns an error, this module will raise an exception.