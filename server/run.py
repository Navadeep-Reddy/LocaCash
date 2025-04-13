from app import create_app
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = create_app()
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"]
    }
})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)