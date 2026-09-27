from flask import Flask

app = Flask(__name__)


@app.route("/api/health", methods=["GET"])
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True)