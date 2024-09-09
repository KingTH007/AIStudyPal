from flask import Flask, request, jsonify
import pyttsx3
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Initialize Text-to-Speech engine
engine = pyttsx3.init()

def text_to_speech(text):
    """Convert text to speech and save it as an audio file."""
    audio_file_path = 'response.mp3'
    engine.save_to_file(text, audio_file_path)
    engine.runAndWait()
    return audio_file_path

def fetch_question():
    """Fetch a question (mock example)."""
    question = "What is the capital of the Philippines?"
    return question

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
    
    # Simple logic for feedback
    if user_text.lower() == "manila":
        response_text = "Correct! The capital of the Philippines is Manila."
    else:
        response_text = "Incorrect. The correct answer is Manila."

    # Convert response text to speech (optional step if saving files)
    text_to_speech(response_text)

    # Send back the response text
    return jsonify({'response': response_text})

if __name__ == '__main__':
    if os.path.exists('response.mp3'):
        os.remove('response.mp3')
    app.run(debug=True)
