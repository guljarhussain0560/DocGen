**Project Overview**
=====================

**Tech Stack & Architecture Style**
-----------------------------------

The project utilizes a diverse set of technologies, including:

* **Programming Languages**: Python is the primary language used throughout the project.
* **Frameworks**: Streamlit, Flask, and FastAPI are used as web frameworks, while Starlette is used as a web framework for the Birthday Song Generator.
* **Database**: No explicit database is used in the project, suggesting that data is stored in memory or external services.
* **Libraries**: Various libraries are used for tasks such as natural language processing (NLP), machine learning (ML), and data manipulation (e.g., pandas, requests, pydantic).
* **Design Patterns**: The project employs a modular design pattern, with each example living in its own directory and having its own entry point.

**Directory Breakdown**
------------------------

The project is organized into several directories, each containing a specific example or application:

* `AI_Presentation_Architect`: A Streamlit application for creating presentations.
* `Birthday_Song_Generator`: A FastAPI application for generating birthday songs.
* `Indic Soundbox AI`: A Flask application for text-to-speech synthesis and other NLP tasks.
* `Live_Video_Transcription`: A Flask application for live video transcription.
* `Multilingual_Chatbot`: A chatbot application using the requests library.
* `Multilingual_Customer_Feedback_Analyzer`: A feedback analyzer application using the requests library.
* `QuickStart_Chatbot`: A chatbot application using the requests library.
* `Regional_Code_Helper`: A coding assistant application using the requests library.
* `Regional_Doubt_Solver`: Not present in the repository.
* `Travel_Planner`: Not present in the repository.
* `ai-graph-generator`: Not present in the repository.
* `govt_scheme_summmarizer`: Not present in the repository.
* `sarvam-podcast-generator`: A Node.js application using the package.json file.

**Core Entrypoints**
---------------------

Each example has its own entry point, which is typically a Python file (e.g., `app.py`, `main.py`, `chatbot.py`). These entry points import other modules and files as needed to run the application.

* `AI_Presentation_Architect/app.py`: The entry point for the AI Presentation Architect application.
* `Birthday_Song_Generator/backend/main.py`: The entry point for the Birthday Song Generator application.
* `Indic Soundbox AI/app.py`: The entry point for the Indic Soundbox AI application.
* `Live_Video_Transcription/app.py`: The entry point for the Live Video Transcription application.
* `Multilingual_Chatbot/chatbot.py`: The entry point for the Multilingual Chatbot application.
* `QuickStart_Chatbot/chatbot.py`: The entry point for the QuickStart Chatbot application.
* `Regional_Code_Helper/coding_assistant.py`: The entry point for the Regional Code Helper application.

**Setup & Dependencies Summary**
---------------------------------

To run the project, you will need to install the dependencies listed in the `requirements.txt` files for each example. The following dependencies are common across multiple examples:

* `requests`
* `python-dotenv`
* `Flask`
* `FastAPI`
* `Starlette`

Additionally, some examples require specific dependencies, such as:

* `Birthday_Song_Generator`: `annotated-types`, `anyio`, `click`, `exceptiongroup`, `h11`, `idna`, `pydantic`, `pydantic_core`, `sniffio`, `starlette`, `typing-inspection`, `typing_extensions`, `uvicorn`
* `Indic Soundbox AI`: `Flask`, `requests`, `python-dotenv`
* `Live_Video_Transcription`: `Flask`, `Flask-SocketIO`, `python-socketio`, `eventlet`, `pydub`, `sarvamai`, `yt-dlp`, `gunicorn`, `python-engineio`, `websockets`
* `Multilingual_Chatbot`: `requests`
* `Multilingual_Customer_Feedback_Analyzer`: `requests`
* `QuickStart_Chatbot`: `requests`
* `Regional_Code_Helper`: `requests`
* `sarvam-podcast-generator`: `package.json` file (Node.js dependencies)

Note that some examples may require additional dependencies or setup steps not listed here.