import { useState } from "react";
import "./App.css";
import { evaluateGuess } from "./utils/evaluateGuess";

function App() {
  const words = [
  "APPLE",
  "HOUSE",
  "MANGO",
  "TRAIN",
  "PLANT",
  "GRAPE",
  "CHAIR",
  "TABLE",
  "BRAIN",
  "CLOUD",
  ];

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameResult, setGameResult] = useState(null);

  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      return;
    }

    if (guesses.length >= 5 || gameResult) {
      return;
    }

    const guess = currentGuess.toUpperCase();
    const result = evaluateGuess(guess, targetWord);

    setGuesses([...guesses, guess]);
    setStatuses([...statuses, result]);
    setCurrentGuess("");

    if (guess === targetWord) {
      setGameResult("win");
      return;
    }

    if (guesses.length === 4) {
      setGameResult("loss");
    }
  };
  
  const startNewGame = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setStatuses([]);
    setCurrentGuess("");
    setGameResult(null);
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
        disabled={guesses.length >= 5}
      />
        
      <button
        onClick={handleGuess}
        disabled={guesses.length >= 5}
      >
      Guess
      </button>
      </div>
      {gameResult && (
        <div className="popup-overlay">
          <div className="popup">
            {gameResult === "win" ? (
            <>
              <h2>🎉 Congratulations!</h2>
              <p>You guessed the word correctly.</p>
            </>
          ) : (
            <>
              <h2>Better luck next time!</h2>
              <p>The correct word was:</p>
              <strong>{targetWord}</strong>
            </>
          )}

          <button onClick={startNewGame}>OK</button>
        </div>
  </div>
)}
    </div>
  );
}

export default App;