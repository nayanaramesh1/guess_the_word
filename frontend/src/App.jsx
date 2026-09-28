import { useState } from "react";
import "./App.css";

function App() {
  const targetWord = "APPLE";
  const [guesses, setGuesses] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");

  const evaluateGuess = (guess, target) => {
  const result = Array(5).fill("absent");
  const targetLetters = target.split("");
  const guessLetters = guess.split("");

  // First pass: correct position
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = "correct";
      targetLetters[i] = null;
      guessLetters[i] = null;
    }
  }

  // Second pass: correct letter, wrong position
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === null) {
      continue;
    }

    const targetIndex = targetLetters.indexOf(guessLetters[i]);

    if (targetIndex !== -1) {
      result[i] = "present";
      targetLetters[targetIndex] = null;
    }
  }

    return result;
  };

  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      return;
    }

    const guess = currentGuess.toUpperCase();
    const result = evaluateGuess(guess, targetWord);

    setGuesses([...guesses, guess]);
    setStatuses([...statuses, result]);
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
        />
        
        <button onClick={handleGuess}>Guess</button>
      </div>
    </div>
  );
}

export default App;