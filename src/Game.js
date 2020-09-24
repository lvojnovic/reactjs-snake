import React from 'react';

import Board from './Board.js';
import Options from './Options.js';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState(20);

    this.gameOver = this.gameOver.bind(this);
    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.restart = this.restart.bind(this);
    this.handleTickChange = this.handleTickChange.bind(this);
  }

  componentDidMount() {
    this.timerId = setInterval(
      () => this.tick(),
      this.state.tickInterval
    );
  }

  handleTickChange(event) {
    const newInterval = event.target.value;
    const newIntervalNumber = +newInterval;
    this.setState({
        tickInterval: newIntervalNumber
    }, () => {
      clearInterval(this.timerId);
      this.timerId = setInterval(
        () => this.tick(),
        newIntervalNumber
      );
    });
  }

  randomPos(boardSize) {
    return getRandomInt(boardSize*boardSize);
  }

  getInitialState(boardSize) {
    return  {
      running: true,
      tickInterval: 300,
      boardSize: boardSize,
      directionChanges: [],
      food: this.randomPos(boardSize),
      snake: [{
        pos: boardSize*boardSize/2 + boardSize/2,
        direction: 'right'
      }]
    };
  }

  randomFood() {
    var pos = this.randomPos(this.state.boardSize);
    while(this.state.snake.map((s) => s.pos).includes(pos)) {
      pos = this.randomPos(this.state.boardSize);
    }
    return pos;
  }

  movePos(pos, direction) {
    const bs = this.state.boardSize;
    const move = {
      up: (pos) => pos < bs ? bs*bs-bs+pos : pos - 1*bs,
      down: (pos) => (pos + bs)%(bs*bs),
      right: (pos) => ((pos+1)%bs === 0) ? pos+1-bs : pos+1,
      left: (pos) => pos === 0 ? bs-1 : ((pos-1)%bs === bs-1) ? pos-1+bs : pos-1
    };

    return move[direction](pos);
  }

  moveSnake() {
    return this.state.snake.map((snakeTile) => {
        let newPos = this.movePos(snakeTile.pos, snakeTile.direction);
        let change = this.state.directionChanges.find((d) => d.pos === newPos);
        return {pos: newPos, direction: change ? change.direction : snakeTile.direction};
    });
  }

  tick() {
    let newSnake = this.moveSnake();
    let head = newSnake[0];

    let foundFood = head.pos === this.state.food;
    if (foundFood) {
        const newHead = {pos: this.movePos(this.state.food, head.direction), direction:head.direction};
        newSnake.unshift(newHead);
    }
    let collision = this.state.snake.map((s) => s.pos).includes(newSnake[0].pos);
    if (collision) {
        this.gameOver();
        clearInterval(this.timerId);
        return;
    }

    this.setState({
      snake: newSnake,
      food: foundFood ? this.randomFood() : this.state.food,
      directionChanges: this.state.directionChanges.filter((d) => newSnake.some((s) => s.pos === d.pos))
    });
  }

  getDirectionFromEvent(event) {
    const mapping = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    return mapping[event.key];
  }

  isNewDirectionValid(newDirection) {
    const opposite = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    let snake = this.state.snake;
    if (snake.length > 1 && opposite[snake[0].direction] === newDirection) return false;

    let isChangeAlreadySetForThisPosition = this.state.directionChanges.map((d) => d.pos).includes(snake[0].pos);
    if (isChangeAlreadySetForThisPosition) return false;

    return true;
  }

  changeDirection(event) {
    let newDirection = this.getDirectionFromEvent(event);
    if (!newDirection) return;

    if(!this.isNewDirectionValid(newDirection)) return;

    let snake = this.state.snake;
    snake[0].direction = newDirection;
    let directionChange = {pos:snake[0].pos, direction: newDirection};

    this.setState({
      snake: snake,
      directionChanges: this.state.directionChanges.concat([directionChange])
    });
  }

  gameOver() {
    this.setState({
      running: false
    });
  }

  handleBoardSizeChange(event) {
    const newSize = event.target.value;
    if (!isNaN(newSize) && newSize > 0 && newSize%10 === 0) {
        const boardSize = +newSize;
        this.setState(this.getInitialState(boardSize));
    }
  }

  restart() {
    this.setState(this.getInitialState(this.state.boardSize));
  }

  render() {
    return (
      <div>
        <div>
          {"SNAKE" + (this.state.running ? '' : ' GAME OVER!')}
        </div>
        <Options
          boardSize={this.state.boardSize}
          onBoardSizeChange={this.handleBoardSizeChange}
          restart={this.restart}
          tickInterval={this.state.tickInterval}
          onTickChange={this.handleTickChange}
        />
        <Board
          boardSize={this.state.boardSize}
          snake={this.state.snake}
          food={this.state.food}
          changeDirection={this.changeDirection}
        />
      </div>
    );
  }
}

export default Game;
