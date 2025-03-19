from flask import Flask
from app.routes.atm_routes import atm_bp

def create_app():
    app = Flask(__name__)

    #registering atm routes bp
    app.register_blueprint(atm_bp)
    return app
