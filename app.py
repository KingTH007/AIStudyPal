from flask import Flask, request, jsonify
import pyttsx3
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Initialize Text-to-Speech engine
engine = pyttsx3.init()

# Store questions and answers
questions = [
    {"question": "Ano ang capital ng Pilipinas?", "answer": "manila"}
]

def text_to_speech(text):
    """Convert text to speech and save it as an audio file."""
    audio_file_path = 'response.mp3'
    engine.save_to_file(text, audio_file_path)
    engine.runAndWait()
    return audio_file_path

@app.route('/get_question', methods=['GET'])
def get_question():
    """API endpoint to fetch a question."""
    import random
    question = random.choice(questions)
    return jsonify(question)

@app.route('/process_voice', methods=['POST'])
def process_voice():
    """Process user's voice input and respond."""
    data = request.get_json()
    user_text = data.get('text').lower()
    
    # Find the correct answer for the question
    question = data.get('question')
    correct_answer = next((q['answer'] for q in questions if q['question'] == question), "")
    
    if user_text == correct_answer:
        response_text = "Tama! Ang capital ng Pilipinas ay Manila."
    else:
        response_text = f"Mali. Ang tamang sagot ay {correct_answer}. Subukan ulit."

    # Convert response text to speech
    text_to_speech(response_text)

    # Send back the response text
    return jsonify({'response': response_text})

if __name__ == '__main__':
    if os.path.exists('response.mp3'):
        os.remove('response.mp3')
    app.run(debug=True)
