from flask import Flask, request, jsonify
import pyttsx3
import requests
import speech_recognition as sr

app = Flask(__name__)

# Initialize Text-to-Speech engine
engine = pyttsx3.init()

def text_to_speech(text):
    """Convert text to speech and save it as an audio file."""
    engine.save_to_file(text, 'response.mp3')
    engine.runAndWait()
    return 'response.mp3'

def fetch_question():
    """Fetch a question about Filipino culture from an API."""
    # For demonstration purposes, we're using a mock API endpoint.
    # Replace with an actual API that provides Filipino questions/topics.
    response = requests.get('http://version1.api.memegenerator.net/get_question')
    
    if response.status_code == 200:
        question = response.json().get('question')
        return question
    else:
        return "Could not fetch question. Please try again later."

@app.route('/get_question', methods=['GET'])
def get_question():
    """API endpoint to fetch a question."""
    question = fetch_question()
    return jsonify({'question': question})

@app.route('/process_voice', methods=['POST'])
def process_voice():
    # Get the text from the POST request
    data = request.get_json()
    user_text = data.get('text')
    
    # Example response logic: simple echo response
    response_text = f"I heard you say: {user_text}. Let's move to the next question."
    
    # Convert response text to speech
    audio_file = text_to_speech(response_text)
    
    # Send back the response and the audio file URL
    return jsonify({'response': response_text, 'audio_file': audio_file})

if __name__ == '__main__':
    # Run the app
    app.run(debug=True)