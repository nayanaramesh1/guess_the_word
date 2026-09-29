import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [gameId, setGameId] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameResult, setGameResult] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const register = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setLoginMessage(data.message);
      return;
    }

    setLoginMessage("Registration successful. Please login.");
    setIsRegistering(false);
    setPassword("");
  } catch (error) {
    console.error(error);
    setLoginMessage("Unable to connect to server");
  }
};

  const login = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setLoginMessage(data.message);
      return;
    }

    setUser(data);
    setLoginMessage("");

    startGame(data.user_id);
  } catch (error) {
    console.error("Login error:", error);
    setLoginMessage("Unable to connect to server");
  }
};

  const startGame = async (userId) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/game/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify({
        user_id: userId,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        setGameResult("limit");
      } else {
        console.error(data.message);
      }

      return;
    }

    setGameId(data.game_id);

  } catch (error) {
    console.error("Error starting game:", error);
  }
};

const handleGuess = async () => {
  if (currentGuess.length !== 5) {
    return;
  }

  if (guesses.length >= 5 || gameResult || !gameId) {
    return;
  }

  const guess = currentGuess.toUpperCase();

  try {
    const response = await fetch("http://127.0.0.1:5000/api/game/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_id: gameId,
        guess: guess,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    setGuesses([...guesses, guess]);
    setStatuses([...statuses, data.result]);
    setCurrentGuess("");

    // Check if the guess is completely correct
    const isCorrect = data.result.every(
      (status) => status === "correct"
    );

    if (isCorrect) {
      setGameResult("win");
      return;
    }

    // Check if this was the fifth and final guess
    if (guesses.length === 4) {
      setGameResult("loss");
    }

  } catch (error) {
    console.error("Error submitting guess:", error);
  }
};
  
  const startNewGame = async () => {
  setGuesses([]);
  setStatuses([]);
  setCurrentGuess("");
  setGameResult(null);
  setGameId(null);

  try {
    const response = await fetch("http://127.0.0.1:5000/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user.user_id,
    }),
  });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        setGameResult("limit");
      } else {
        console.error(data.message);
      }

      return;
    }

    setGameId(data.game_id);

  } catch (error) {
    console.error("Error starting new game:", error);
  }
};

return (
  <div className="game">
    {!user ? (
      <>
  <div className="login-container">
    <div className="login-card">
      <h1>Guess the Word</h1>

      <p className="login-subtitle">
  {isRegistering
    ? "Create an account to start playing"
    : "Sign in to start playing"}
</p>

      <div className="login-form">
        <label>Username</label>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
        className="login-button"
        onClick={isRegistering ? register : login}
        >
        {isRegistering ? "Register" : "Login"}
        </button>

        {loginMessage && (
          <p className="login-message">{loginMessage}</p>
        )}
        <button
  className="register-link"
  onClick={() => {
    setIsRegistering(!isRegistering);
    setLoginMessage("");
  }}
>
  {isRegistering
    ? "Already have an account? Login"
    : "Don't have an account? Register"}
</button>
      </div>
    </div>
  </div>
</>
    ) : (
      <>
        <h1>Guess the Word</h1>

        <p>Welcome {user.username}</p>

        <div className="board">
          {Array.from({ length: 25 }).map((_, index) => {
            const row = Math.floor(index / 5);
            const column = index % 5;

            const letter = guesses[row]?.[column] || "";

            return (
              <div
                className={`tile ${statuses[row]?.[column] || ""}`}
                key={index}
              >
                {letter}
              </div>
            );
          })}
        </div>

        <div className="guess-input">
          <input
            type="text"
            maxLength="5"
            value={currentGuess}
            onChange={(event) => setCurrentGuess(event.target.value)}
            placeholder="Enter your guess"
            disabled={guesses.length >= 5 || gameResult}
          />

          <button
            onClick={handleGuess}
            disabled={guesses.length >= 5 || gameResult}
          >
            Guess
          </button>
        </div>

        {gameResult && (
          <div className="popup-overlay">
            <div className="popup">

              {gameResult === "limit" ? (
                <>
                  <h2>Daily Limit Reached</h2>
                  <p>You have used all 3 games for today.</p>
                  <p>Please come back tomorrow.</p>
                </>
              ) : gameResult === "win" ? (
                <>
                  <h2>🎉 Congratulations!</h2>
                  <p>You guessed the word correctly.</p>
                </>
              ) : (
                <>
                  <h2>Better luck next time!</h2>
                  <p>You have used all 5 guesses.</p>
                </>
              )}

              {gameResult !== "limit" && (
                <button onClick={startNewGame}>OK</button>
              )}

            </div>
          </div>
        )}
      </>
    )}
  </div>
);
}

export default App;