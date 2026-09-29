from flask import Blueprint, jsonify, request
from db import get_db_connection

admin_bp = Blueprint("admin", __name__)

def is_admin(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT role
        FROM users
        WHERE id = %s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    return user and user["role"] == "ADMIN"


@admin_bp.route("/api/admin/daily-report", methods=["GET"])
def daily_report():
    user_id = request.args.get("user_id")

    if not user_id or not is_admin(user_id):
        return jsonify({"message": "Admin access required"}), 403
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            DATE(g.started_at) AS game_date,
            COUNT(DISTINCT g.user_id) AS unique_players,
            COUNT(g.id) AS total_games,
            COALESCE(SUM(CASE WHEN g.is_won = 1 THEN 1 ELSE 0 END), 0) AS games_won,
            COALESCE(SUM(CASE WHEN g.is_won = 0 THEN 1 ELSE 0 END), 0) AS games_lost
        FROM games g
        GROUP BY DATE(g.started_at)
        ORDER BY game_date DESC
        """
    )

    report = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(report), 200


@admin_bp.route("/api/admin/user-report", methods=["GET"])
def user_report():
    user_id = request.args.get("user_id")

    if not user_id or not is_admin(user_id):
        return jsonify({"message": "Admin access required"}), 403
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            u.id AS user_id,
            u.username,
            u.created_at,
            COUNT(g.id) AS total_games,
            COALESCE(SUM(CASE WHEN g.is_won = 1 THEN 1 ELSE 0 END), 0) AS games_won,
            COALESCE(SUM(CASE WHEN g.is_won = 0 THEN 1 ELSE 0 END), 0) AS games_lost
        FROM users u
        LEFT JOIN games g ON u.id = g.user_id
        WHERE u.role = 'PLAYER'
        GROUP BY u.id, u.username, u.created_at
        ORDER BY u.username
        """
    )

    report = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(report), 200