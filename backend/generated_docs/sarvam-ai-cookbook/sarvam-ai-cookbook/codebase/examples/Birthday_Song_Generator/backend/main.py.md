**Birthday Song Generator Documentation**
=====================================

**Overview**
------------

This module, `main.py`, is part of the Birthday Song Generator project, which utilizes the FastAPI framework to create a web application that generates birthday songs based on user input. The application accepts user answers to various questions and uses the Sarvam AI API to generate a funny and rhyming birthday song.

**Functions/Classes**
--------------------

### `read_root` Function

```python
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
```

* **Signature:** `read_root(request: Request) -> HTMLResponse`
* **Parameters:** `request: Request` (the incoming HTTP request)
* **Return Value:** `HTMLResponse` (the rendered HTML template)
* **Usage Example:**

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
```

This function handles GET requests to the root URL (`"/"`) and returns the rendered HTML template for the index page.

### `generate_song` Function

```python
@app.post("/generate-song")
async def generate_song(data: UserAnswers):
    # ...
```

* **Signature:** `generate_song(data: UserAnswers) -> dict`
* **Parameters:** `data: UserAnswers` (the user's answers to the questions)
* **Return Value:** `dict` (a dictionary containing the generated birthday song)
* **Usage Example:**

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserAnswers(BaseModel):
    answers: list[str]

@app.post("/generate-song")
async def generate_song(data: UserAnswers):
    # ...
```

This function handles POST requests to the `/generate-song` endpoint and generates a birthday song based on the user's answers.

### `UserAnswers` Class

```python
class UserAnswers(BaseModel):
    answers: list[str]
```

* **Signature:** `UserAnswers(answers: list[str])`
* **Parameters:** `answers: list[str]` (the user's answers to the questions)
* **Return Value:** `UserAnswers` (an instance of the `UserAnswers` class)
* **Usage Example:**

```python
from pydantic import BaseModel

class UserAnswers(BaseModel):
    answers: list[str]

user_answers = UserAnswers(answers=["answer1", "answer2", "answer3"])
```

This class represents the user's answers to the questions and is used as a parameter for the `generate_song` function.

**Dependencies**
----------------

### `fastapi`

* **Import:** `from fastapi import FastAPI, Request`
* **Usage:** The FastAPI framework is used to create the web application.

### `fastapi.responses`

* **Import:** `from fastapi.responses import HTMLResponse`
* **Usage:** The `HTMLResponse` class is used to return the rendered HTML template.

### `fastapi.templating`

* **Import:** `from fastapi.templating import Jinja2Templates`
* **Usage:** The `Jinja2Templates` class is used to render the HTML template.

### `pydantic`

* **Import:** `from pydantic import BaseModel`
* **Usage:** The `BaseModel` class is used to define the `UserAnswers` class.

### `requests`

* **Import:** `import requests`
* **Usage:** The `requests` library is used to make a POST request to the Sarvam AI API.

### `dotenv`

* **Import:** `from dotenv import load_dotenv`
* **Usage:** The `load_dotenv` function is used to load the `.env` file and retrieve the Sarvam API key.

**Usage Examples**
-----------------

### Generating a Birthday Song

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserAnswers(BaseModel):
    answers: list[str]

@app.post("/generate-song")
async def generate_song(data: UserAnswers):
    name = data.answers[0]
    color = data.answers[1]
    hobby = data.answers[2]
    friend = data.answers[3]
    food = data.answers[4]
    place = data.answers[5]
    memory = data.answers[6]
    habit = data.answers[7]
    nickname = data.answers[8]
    wish = data.answers[9]

    prompt = f"""
        Generate a joyful birthday song in simple English.
        Make it a bit offensive, roasting, and rhyming using the given details. Try to use all of this information and give me a funny 12-line song. No need for chorus:
        Full name and age: {name}
        If your friend was a color, what color would they be and why?: {color}
        Favorite hobby or something they do all the time: {hobby}
        Best buddy and a funny memory: {friend}
        Favorite food: {food}
        Dream travel destination: {place}
        Recent funny or happy moment: {memory}
        Quirky or adorable habit: {habit}
        Funny nickname: {nickname}
        Embarrassing moment they secretly enjoy: {wish}
    """

    response = requests.post(
        "https://api.sarvam.ai/v1/chat/completions",
        headers={
            "api-subscription-key": os.getenv("SARVAM_API_KEY")
        },
        json={
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": "sarvam-m"
        },
    )

    result = response.json()
    content = result["choices"][0]["message"]["content"]
    print(content)

    return {"quotes": content}
```

This example shows how to use the `generate_song` function to generate a birthday song based on the user's answers.

**Edge Cases & Warnings**
-------------------------

### Sarvam API Key

* **Warning:** The Sarvam API key is retrieved from the `.env` file using the `load_dotenv` function. Make sure to replace the placeholder value with your actual API key.
* **Edge Case:** If the Sarvam API key is not set or is invalid, the `generate_song` function will fail.

### User Input Validation

* **Warning:** The `UserAnswers` class does not perform any input validation. Make sure to validate the user's input before passing it to the `generate_song` function.
* **Edge Case:** If the user's input is invalid or missing, the `generate_song` function may fail or produce unexpected results.