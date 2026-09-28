export const evaluateGuess = (guess, target) => {
  const result = Array(5).fill("absent");
  const targetLetters = target.split("");
  const guessLetters = guess.split("");

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = "correct";
      targetLetters[i] = null;
      guessLetters[i] = null;
    }
  }

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