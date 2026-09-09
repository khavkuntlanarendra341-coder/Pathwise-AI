import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_ai_response(prompt: str) -> str:

    if not GEMINI_API_KEY:
        return "Gemini API key is not configured."

    try:
        response = model.generate_content(prompt)

        if response and response.text:
            return response.text

        return "No response received from Gemini."

    except Exception as e:
        return f"Gemini API error: {str(e)}"