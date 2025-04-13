from app import create_app
import logging
from flask_cors import CORS
from dotenv import load_dotenv
from app.utils.db_loader import initialize_cache

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # Initialize the cache system
    initialize_cache()
    
    # Create and run the Flask app
    app = create_app()
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"]
        }
    })
    logger.info("Starting Flask server...")
    app.run(host="0.0.0.0", port=8080, debug=True)