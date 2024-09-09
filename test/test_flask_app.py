import pytest
from app import app  # Import your Flask app instance

@pytest.fixture
def client():
    # Setup code for the test client
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_homepage(client):
    """Test that the homepage returns a 200 status code."""
    response = client.get('/')
    assert response.status_code == 200

def test_api(client):
    """Test that the API endpoint works correctly."""
    response = client.get('/api/questions')
    assert response.status_code == 200
    assert b'question' in response.data  # Check if 'question' is part of the response

