from flask import Flask
import logging
from app.routes.atm_routes import atm_bp
from app.routes.analysis_routes import analysis_bp
from app.utils.db_loader import initialize_cache

logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(atm_bp)
    app.register_blueprint(analysis_bp)
    
    # Initialize cache when app is created (only in production)
    if app.config.get('ENV') != 'development':
        logger.info("Production environment detected, initializing cache...")
        initialize_cache()
    
    return app
