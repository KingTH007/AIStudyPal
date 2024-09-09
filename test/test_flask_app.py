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

# test_basic.py
def test_example():
    assert 1 + 1 == 2
  
