from app import create_app
from flask_cors import CORS


app = create_app()
CORS(app)


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=8080)