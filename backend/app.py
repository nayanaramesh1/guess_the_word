from flask import Flask
from flask_cors import CORS
from game_routes import game_bp
from guess_routes import guess_bp
from auth_routes import auth_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(game_bp)
app.register_blueprint(guess_bp)
app.register_blueprint(auth_bp)


@app.route("/api/health", methods=["GET"])
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True)