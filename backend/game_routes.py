from flask import Blueprint, jsonify, request
from db import get_db_connection

game_bp = Blueprint("game", __name__)


@game_bp.route("/api/game/start", methods=["POST"])
def start_game():
    data = request.get_json()
    user_id = data.get("user_id")
    connection = get_db_connection()
    cursor = connection.cursor()

    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM games
        WHERE user_id = %s
        AND DATE(started_at) = CURDATE()
        """,
        (user_id,)
    )

    games_today = cursor.fetchone()["COUNT(*)"]

    if games_today >= 3:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Daily game limit reached"
        }), 403

    cursor.execute(
        "SELECT id FROM words ORDER BY RAND() LIMIT 1"
    )

    word = cursor.fetchone()

    cursor.execute(
        """
        INSERT INTO games (user_id, word_id)
        VALUES (%s, %s)
        """,
        (user_id, word["id"])
    )

    connection.commit()

    game_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "game_id": game_id
    }), 201