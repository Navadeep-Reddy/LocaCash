from flask import Flask
from app.routes.atm_routes import atm_bp
from app.routes.analysis_routes import analysis_bp

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(atm_bp)
    app.register_blueprint(analysis_bp)
    
    return app
