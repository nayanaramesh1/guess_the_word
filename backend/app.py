from flask import Flask
from game_routes import game_bp

app = Flask(__name__)
app.register_blueprint(game_bp)


@app.route("/api/health", methods=["GET"])
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True)