import React from 'react';

import Tile from './Tile.js';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const boardSize = 10;

const randomPos = () => getRandomInt(boardSize*boardSize);

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.changeDirection = this.changeDirection.bind(this);
  }

  getInitialState() {
    return  {
      directionChanges: [],
      food: randomPos(),
      snake: [{
        pos:boardSize*boardSize/2 + boardSize/2,
        direction: 'right'
      }]
    };
  }

  componentDidMount() {
    this.timerId = setInterval(
      () => this.tick(),
      300
    );
  }

  randomFood() {
    var pos = randomPos();
    while(this.state.snake.map((s) => s.pos).includes(pos)) {
      pos = randomPos();
    }
    return pos;
  }

  movePos(pos, direction) {
    const bs = boardSize;
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
        this.props.onGameOver();
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

  renderTile(i) {
    return (
      <Tile
        key={i}
        occupied={this.state.snake.some((s) => s.pos === i)}
        food={this.state.food === i}
      />
    );
  }

  render() {
    const boardRange = [...Array(boardSize).keys()];
    const board = boardRange.map((row) => {
        return (
            <div
              className="board-row"
              key={row}
            >
              {boardRange.map((col) => this.renderTile(row*boardSize+col))}
            </div>
        );
    });
    return (
      <div
        className="board"
        onKeyDown={this.changeDirection}
        tabIndex={0}
      >
        {board}
      </div>
    );
  }
}

export default Board;
