from flask import Blueprint, request, jsonify
from db import get_db_connection

guess_bp = Blueprint("guess", __name__)


@guess_bp.route("/api/game/guess", methods=["POST"])
def submit_guess():

    data = request.get_json()

    game_id = data.get("game_id")
    guess = data.get("guess")

    if not game_id or not guess:
        return jsonify({
            "message": "game_id and guess are required"
        }), 400

    guess = guess.upper()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT words.word
        FROM games
        JOIN words ON games.word_id = words.id
        WHERE games.id = %s
        """,
        (game_id,)
    )

    game = cursor.fetchone()

    if not game:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Game not found"
        }), 404

    target = game["word"]

    result = []

    for i in range(len(guess)):

        if guess[i] == target[i]:
            result.append("correct")

        elif guess[i] in target:
            result.append("present")

        else:
            result.append("absent")

    cursor.close()
    connection.close()

    return jsonify({
        "guess": guess,
        "result": result
    }), 200