from flask import Blueprint, request, jsonify
from db import get_db_connection
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import re

auth_bp = Blueprint("auth", __name__)


def validate_username(username):
    return (
        len(username) >= 5
        and re.search(r"[A-Z]", username)
        and re.search(r"[a-z]", username)
    )


def validate_password(password):
    return (
        len(password) >= 5
        and re.search(r"[A-Za-z]", password)
        and re.search(r"\d", password)
        and re.search(r"[$%*]", password)
    )


@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if not validate_username(username):
        return jsonify({
            "message": "Username must be at least 5 characters and contain uppercase and lowercase letters"
        }), 400

    if not validate_password(password):
        return jsonify({
            "message": "Password must contain at least 5 characters, a letter, a number, and one of $, %, *"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE username = %s",
        (username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        connection.close()
        return jsonify({"message": "Username already exists"}), 409

    password_hash = generate_password_hash(password)

    cursor.execute(
        """
        INSERT INTO users (username, password_hash, role)
        VALUES (%s, %s, 'PLAYER')
        """,
        (username, password_hash)
    )

    connection.commit()

    user_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Registration successful",
        "user_id": user_id
    }), 201

@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, username, password_hash, role
        FROM users
        WHERE username = %s
        """,
        (username,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"message": "Invalid username or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user["id"],
        "username": user["username"],
        "role": user["role"]
    }), 200