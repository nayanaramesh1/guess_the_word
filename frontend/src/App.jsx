import { useState } from "react";
import "./App.css";

function App() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");

  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      return;
    }

    setGuesses([...guesses, currentGuess.toUpperCase()]);
    setCurrentGuess("");
  };

  return (
    <div className="game">
      <h1>Guess the Word</h1>

      <div className="board">
        {Array.from({ length: 25 }).map((_, index) => {
          const row = Math.floor(index / 5);
          const column = index % 5;

          const letter = guesses[row]?.[column] || "";

          return (
            <div className="tile" key={index}>
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
        />

        <button onClick={handleGuess}>Guess</button>
      </div>
    </div>
  );
}

export default App;