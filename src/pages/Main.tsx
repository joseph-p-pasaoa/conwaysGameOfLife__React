/*
JOSEPH P. PASAOA
Homepage Component | Tribute to Conway's Game of Life
*/



/* TODOS
- connect interval input to clock
- foresight coloration option (black = not going to die, red = going to die)
- grid units customization
- grid size customization
- draggable toggling of cells
*/



/* IMPORTS */
import React, { useState } from 'react';

import useInterval from '../customhooks/useInterval';
import '../App.scss';
import Controls from '../components/Controls';
import FeedbackDisplay from '../components/FeedbackDisplay';
import MatrixDisplay from '../components/MatrixDisplay';



/* TYPING */
interface Array<T> {
  fill(value: T): Array<T>;
}



/* SIDEKICK FUNCTION CREATEMATRIX  */
const createMatrix = (height: number, length: number): boolean[][] => {
  const output: boolean[][] = [];
  for (let row = 0; row < height; row++) {
    const newRow: boolean[] = new Array<boolean>(length).fill(false);
    output.push(newRow);
  }
  return output;
}



/* APP COMPONENT */
const App = () => {
  const defaultMatrix = createMatrix(36, 54);

  const [boolMatrix, setBoolMatrix] = useState(defaultMatrix);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [tickInterval, setTickInterval] = useState(1000);  // number in milliseconds (ms)
  const [ticksPassed, setTicksPassed] = useState(0);

  useInterval(() => {
    runOneTick();
  }, isClockRunning ? tickInterval : null);



  // HELPER FUNCTIONS
  const countAliveNeighbors = (inputCoordinates: [number, number]): number => {
    const [inputRow, inputCol] = inputCoordinates;
    let numOfAliveNeighbors = 0;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        const [currentRow, currentCol] =  [inputRow + rowOffset, inputCol + colOffset];
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }
        if (
          boolMatrix[currentRow] &&
          boolMatrix[currentRow][currentCol]
          ) numOfAliveNeighbors += 1;
      }
    }
    return numOfAliveNeighbors;
  }

  const evalCellNextStatus = (inputCoordinates: [number, number]): boolean => {
    const [inputRow, inputCol] = inputCoordinates;
    if (boolMatrix[inputRow] === undefined || boolMatrix[inputRow][inputCol] === undefined) {
      throw Error('out-of-bounds');
    }
    const inputCellIsAlive = boolMatrix[inputRow][inputCol];
    const numOfAliveNeighbors = countAliveNeighbors([inputRow, inputCol]);
    if (inputCellIsAlive) {
      if (numOfAliveNeighbors === 2 || numOfAliveNeighbors === 3) {
        return true;
      }
    } else if (numOfAliveNeighbors === 3) {
      return true;
    }
    return false;
  }

  const runOneTick = (): void => {
    const newMatrix: boolean[][] = [];
    for (let row = 0; row < boolMatrix.length; row++) {
      const newRow: boolean[] = [];
      for (let col = 0; col < boolMatrix[row].length; col++) {
        const coordinates: [number, number] = [row, col];
        const outcome = evalCellNextStatus(coordinates);
        newRow.push(outcome);
      }
      newMatrix.push(newRow);
    }

    setTicksPassed(ticksPassed + 1);
    setBoolMatrix(newMatrix);
  }



  // EVENT HANDLERS
  const handleClickCell = (targetCoordinates: [number, number]) => {
    const [targetRow, targetCol] = targetCoordinates;
    const newBoolMatrix = [ ...boolMatrix ];
    newBoolMatrix[targetRow][targetCol] = !newBoolMatrix[targetRow][targetCol];
    setBoolMatrix(newBoolMatrix);
  }

  const handleToggleClock = () => {
    setIsClockRunning(!isClockRunning);
  }



  // ORIGINAL LOGIC TESTING
  // const board = new Board(5, 10);
  // board.toggleNode([0, 1]);
  // board.toggleNode([1, 1]);
  // board.toggleNode([2, 1]);
  // board.toggleNode([2, 2]);
  // board.toggleNode([1, 3]);
  // board.toggleNode([2, 7]);
  // board.toggleNode([3, 7]);
  // board.toggleNode([3, 8]);
  // console.log(board.countAliveNeighbors([2, 3]) === 1);
  // console.log(board.countAliveNeighbors([1, 1]) === 3);
  // console.log(board.countAliveNeighbors([4, 6]) === 0);
  // console.log(board.evalCellNextStatus([2, 3]) === false);
  // console.log(board.evalCellNextStatus([1, 1]) === true);
  // console.log(board.evalCellNextStatus([4, 6]) === false);
  // console.log(board.matrix);
  // board.runOneTick();
  // console.log(board.matrix);
  // board.runOneTick();
  // console.log(board.matrix);



  // RETURN
  return (
    <div className='Homepage'>
      Tribute to Conway's Game of Life. Developed by Joseph P. Pasaoa.<br />
      <Controls
        isClockRunning={isClockRunning}
        runOneTick={runOneTick}
        handleToggleClock={handleToggleClock}
      />
      <FeedbackDisplay
        isClockRunning={isClockRunning}
        ticksPassed={ticksPassed}
      />
      <MatrixDisplay
        boolMatrix={boolMatrix}
        handleClickCell={handleClickCell}
      />
    </div>
  );
}



/* EXPORT */
export default App;