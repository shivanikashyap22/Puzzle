import React, { useEffect, useState } from "react";
import "./Board.css";

import Overlay from "../Overlay/Overlay";
import Tile from "../Tile/Tile";
import Winner from "../Winner/Winner";

const Boards = () => {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning && !gamePaused) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, gamePaused]);

  const toggleTimer = () => {
    setTimerRunning((prevTimerRunning) => !prevTimerRunning);
    setGamePaused(false);
  };

  const togglePause = () => {
    setGamePaused((prevGamePaused) => !prevGamePaused);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const shuffle = () =>
    new Array(16)
      .fill()
      .map((_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map((x, i) => ({ value: x, index: i }));

  const [numbers, setNumbers] = useState([]);
  const [animating, setAnimating] = useState(false);

  const reset = () => setNumbers(shuffle());

  const moveTile = (tile) => {
    const i16 = numbers.find((n) => n.value === 16).index;
    if (
      ![i16 - 1, i16 + 1, i16 - 4, i16 + 4].includes(tile.index) ||
      animating ||
      gamePaused
    )
      return;

    const newNumbers = [...numbers].map((number) => {
      if (number.index !== i16 && number.index !== tile.index) return number;
      else if (number.value === 16) return { value: 16, index: tile.index };

      return { value: tile.value, index: i16 };
    });
    setAnimating(true);
    setNumbers(newNumbers);
    setTimeout(() => setAnimating(false), 200);
  };

  const handleKeyDown = (e) => {
    const i16 = numbers.find((n) => n.value === 16).index;
    if (
      e.keyCode === 37 &&
      !(i16 % 4 === 3) &&
      !gamePaused
    )
      moveTile(numbers.find((n) => n.index === i16 + 1));
    else if (
      e.keyCode === 38 &&
      !(i16 > 11) &&
      !gamePaused
    )
      moveTile(numbers.find((n) => n.index === i16 + 4));
    else if (
      e.keyCode === 39 &&
      !(i16 % 4 === 0) &&
      !gamePaused
    )
      moveTile(numbers.find((n) => n.index === i16 - 1));
    else if (
      e.keyCode === 40 &&
      !(i16 < 4) &&
      !gamePaused
    )
      moveTile(numbers.find((n) => n.index === i16 - 4));
  };

  const handleHelpMe = () => {
    
    if (!timerRunning || gamePaused) return; 
    const i16 = numbers.find((n) => n.value === 16).index;
    const validMoves = [];
    if (!(i16 % 4 === 3)) validMoves.push(numbers.find((n) => n.index === i16 + 1));
    if (!(i16 > 11)) validMoves.push(numbers.find((n) => n.index === i16 + 4));
    if (!(i16 % 4 === 0)) validMoves.push(numbers.find((n) => n.index === i16 - 1));
    if (!(i16 < 4)) validMoves.push(numbers.find((n) => n.index === i16 - 4));
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    moveTile(randomMove);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(reset, []);

  return (
    <>
      <div>
        <h1 className="puzzle">Fifteen Puzzle Game</h1>
        <h1 className="puzzle">Timer: {formatTime(seconds)}</h1>
        <div className="button-wrapper">
          <button onClick={toggleTimer}>
            {timerRunning ? "Stop" : "Start"}
          </button>
          <button onClick={togglePause}>
            {gamePaused ? "Resume" : "Pause"}
          </button>
          <button onClick={reset}>Reset</button>
          <button onClick={handleHelpMe}>Help me</button>
        </div>
      </div>
      <div className="game">
        <div className="board">
          <Overlay size={16} />
          {numbers.map((x, i) => {
            return <Tile key={i} number={x} moveTile={moveTile} />;
          })}
        </div>
        <Winner numbers={numbers} reset={reset} />
      </div>
    </>
  );
};

export default Boards;
