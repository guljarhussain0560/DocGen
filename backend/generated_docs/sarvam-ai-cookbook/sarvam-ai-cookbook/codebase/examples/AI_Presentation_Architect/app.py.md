**AI Presentation Architect Module**
=====================================

**Overview**
------------

This module provides a Streamlit web application for creating multilingual presentations using AI-powered content generation. It utilizes the Sarvam AI API for chat completions and translation. The application allows users to input a topic, select a language, and specify the number of slides. The AI then generates content in English, translates it to the chosen language, and creates a PowerPoint presentation.

**Functions/Classes**
---------------------

### `generate_english_presentation(topic: str, api_key: str, slide_count: int) -> list`

Generates presentation content (titles and bullet points) in English using the Chat API.

*   **Parameters:**
    *   `topic`: The topic of the presentation.
    *   `api_key`: The Sarvam AI API key.
    *   `slide_count`: The number of slides to generate.
*   **Return Value:** A list of dictionaries containing the presentation content.
*   **Usage Example:**
```python
english_slides = generate_english_presentation("Machine Learning", "your_api_key", 5)
print(english_slides)
```

### `translate_content(text: str, target_lang: str, api_key: str) -> str`

Translates text to the target language using the Translate API.

*   **Parameters:**
    *   `text`: The text to translate.
    *   `target_lang`: The target language code (e.g., "en-IN" for English).
    *   `api_key`: The Sarvam AI API key.
*   **Return Value:** The translated text.
*   **Usage Example:**
```python
translated_text = translate_content("Hello, World!", "hi-IN", "your_api_key")
print(translated_text)
```

### `create_powerpoint_presentation(slides: list, topic: str, target_lang_name: str) -> io.BytesIO`

Creates a PowerPoint presentation from the slide content.

*   **Parameters:**
    *   `slides`: A list of dictionaries containing the presentation content.
    *   `topic`: The topic of the presentation.
    *   `target_lang_name`: The name of the target language.
*   **Return Value:** A byte stream containing the PowerPoint presentation.
*   **Usage Example:**
```python
ppt_file_stream = create_powerpoint_presentation(english_slides, "Machine Learning", "Hindi")
print(ppt_file_stream)
```

**Dependencies**
----------------

*   `streamlit`: For building the web application.
*   `requests`: For making API requests to the Sarvam AI API.
*   `json`: For parsing JSON responses from the API.
*   `io`: For working with byte streams.
*   `pandas`: Not used in this module, but imported for potential future use.
*   `pptx`: For creating PowerPoint presentations.
*   `pydantic`: Not used in this module, but imported for potential future use.

**Usage Examples**
------------------

### Creating a Presentation

```python
import streamlit as st
from ai_presentation_architect import generate_english_presentation, translate_content, create_powerpoint_presentation

# Generate English content
english_slides = generate_english_presentation("Machine Learning", "your_api_key", 5)

# Translate content to Hindi
translated_slides = [
    {
        'title': translate_content(s['title'], "hi-IN", "your_api_key"),
        'content': translate_content(s['content'], "hi-IN", "your_api_key")
    } for s in english_slides
]

# Create a PowerPoint presentation
ppt_file_stream = create_powerpoint_presentation(translated_slides, "Machine Learning", "Hindi")

# Display the presentation
st.download_button(
    label="Download Presentation (.pptx)",
    data=ppt_file_stream,
    file_name="machine_learning_hindi.pptx",
    mime="application/vnd.openxmlformats-officedocument.presentationml.presentation"
)
```

**Edge Cases & Warnings**
-------------------------

*   Make sure to replace `"your_api_key"` with your actual Sarvam AI API key.
*   The `generate_english_presentation` function may take a moment to complete, depending on the complexity of the topic and the number of slides.
*   The `translate_content` function may not work correctly if the target language is not supported by the Sarvam AI API.
*   The `create_powerpoint_presentation` function may not work correctly if the slide content is not in the correct format.