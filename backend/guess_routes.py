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

    if not isinstance(guess, str) or len(guess) != 5:
        return jsonify({
            "message": "Guess must be exactly 5 letters"
        }), 400

    if not guess.isalpha():
        return jsonify({
            "message": "Guess must contain only letters"
        }), 400

    guess = guess.upper()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            games.id,
            games.guesses_used,
            games.completed_at,
            words.word
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
        return jsonify({"message": "Game not found"}), 404

    if game["completed_at"] is not None:
        cursor.close()
        connection.close()
        return jsonify({"message": "Game is already completed"}), 400

    target = game["word"]

    result = []

    for i in range(5):
        if guess[i] == target[i]:
            result.append("correct")
        elif guess[i] in target:
            result.append("present")
        else:
            result.append("absent")

    guesses_used = game["guesses_used"] + 1

    is_correct = all(status == "correct" for status in result)

    if is_correct:
        cursor.execute(
            """
            UPDATE games
            SET guesses_used = %s,
                is_won = 1,
                completed_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (guesses_used, game_id)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "guess": guess,
            "result": result,
            "game_status": "won"
        }), 200

    if guesses_used >= 5:
        cursor.execute(
            """
            UPDATE games
            SET guesses_used = %s,
                is_won = 0,
                completed_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (guesses_used, game_id)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "guess": guess,
            "result": result,
            "game_status": "lost"
        }), 200

    cursor.execute(
        """
        UPDATE games
        SET guesses_used = %s
        WHERE id = %s
        """,
        (guesses_used, game_id)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "guess": guess,
        "result": result,
        "game_status": "playing"
    }), 200