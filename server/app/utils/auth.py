import os
import jwt
from functools import wraps
from flask import request, jsonify
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Get your Supabase JWT secret from environment variables
JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET')
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

def get_token_from_header():
    """Extract the JWT token from the Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    parts = auth_header.split()
    if parts[0].lower() != 'bearer' or len(parts) != 2:
        return None
    
    return parts[1]

def decode_token(token):
    """Decode and verify the JWT token"""
    try:
        # For Supabase JWT validation
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=['HS256'],
            options={"verify_signature": True}
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def requires_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_header()
        
        if not token:
            return jsonify({"error": "Authorization token is missing"}), 401
        
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Add the user info to the Flask request object
        request.user = payload
        
        return f(*args, **kwargs)
    
    return decorated