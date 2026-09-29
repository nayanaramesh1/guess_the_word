# Guess the Word

A full-stack web application where players can play a Wordle-style word guessing game, while administrators can view game and user reports.

## Features

### Player

* User registration and login
* Username validation
* Password validation
* Random five-letter target word for each game
* Maximum 5 guesses per game
* Maximum 3 games per player per day
* Green indication for letters in the correct position
* Orange indication for correct letters in the wrong position
* Game win and loss handling

### Admin

* Admin login
* Admin dashboard
* Daily game report
* User-wise game report
* Total games, wins, losses, and unique player statistics
* Admin-only access to reports

## Technologies Used

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Python
* Flask
* PyMySQL
* Flask-CORS
* MySQL

### Security

* Passwords are stored using password hashing.
* Admin endpoints verify the user's role before returning reports.
* Player game limits are enforced by the backend.

## Project Structure

```text
guess_the_word/
│
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── auth_routes.py
│   ├── game_routes.py
│   ├── guess_routes.py
│   ├── admin_routes.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── App.css
│   │   └── ...
│   └── package.json
│
├── .gitignore
└── README.md
```

## Database

The application uses MySQL with the following main tables:

* `users` — stores registered users and their roles
* `words` — stores the available five-letter words
* `games` — stores game sessions, guesses used, completion status, and results

## Running the Project

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Install the required Python packages:

```bash
pip install flask pymysql python-dotenv flask-cors werkzeug
```

Create a `.env` file containing the database configuration required by the application.

Start the Flask server:

```bash
python app.py
```

The backend runs on:

```text
http://127.0.0.1:5000
```

### Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite in the browser.

## Game Rules

1. A player logs in to the application.
2. A random five-letter word is selected for the game.
3. The player can make up to 5 guesses.
4. Each guess must contain exactly 5 letters.
5. Green indicates a correct letter in the correct position.
6. Orange indicates a correct letter in the wrong position.
7. A player can start a maximum of 3 games per day.
8. The game ends when the player guesses the word or uses all 5 guesses.

## Admin Reports

Administrators can access two reports from the dashboard:

### Daily Game Report

Displays:

* Date
* Number of unique players
* Total games
* Games won
* Games lost

### User Report

Displays:

* Username
* Registration date
* Total games
* Games won
* Games lost

Only users with the `ADMIN` role can access these reports.

## Future Improvements

* JWT/session-based authentication
* Logout functionality
* Improved duplicate-letter handling
* More detailed analytics
* Deployment to a cloud platform
