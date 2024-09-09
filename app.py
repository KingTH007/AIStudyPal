from flask import Flask, render_template, request, jsonify
import pyttsx3
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Initialize Text-to-Speech engine
engine = pyttsx3.init()

# Mock question list for demonstration
questions = [
    "Ano ang capital ng Pilipinas?",
    "Ano ang pinakamataas na bundok sa Pilipinas?",
    "Sino ang pambansang bayani ng Pilipinas?",
]

def text_to_speech(text):
    """Convert text to speech and save it as an audio file."""
    audio_file_path = 'response.mp3'
    engine.save_to_file(text, audio_file_path)
    engine.runAndWait()
    return audio_file_path

def fetch_question():
    """Fetch a random question from the list."""
    import random
    return random.choice(questions)

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/get_question', methods=['GET'])
def get_question():
    """API endpoint to fetch a question."""
    question = fetch_question()
    return jsonify({'question': question})

@app.route('/process_voice', methods=['POST'])
def process_voice():
    """Process user's voice input and respond."""
    data = request.get_json()
    user_text = data.get('text')
    question = data.get('question')
    
    # Simple logic for feedback (mock example)
    if user_text.lower() in ["manila", "mt. apo", "jose rizal"]:
        response_text = "Tama! Ang sagot mo ay tama."
    else:
        response_text = "Mali. Ang tamang sagot ay Manila."

    # Convert response text to speech
    text_to_speech(response_text)

    # Send back the response text
    return jsonify({'response': response_text})

if __name__ == '__main__':
    if os.path.exists('response.mp3'):
        os.remove('response.mp3')
    app.run(debug=True)

# test_flask_app.py
import pytest
from app import app  # Import your Flask app from wherever it's defined

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_question(client):
    """Test the /get_question API."""
    response = client.get('/get_question')
    assert response.status_code == 200
    assert 'question' in response.get_json()

