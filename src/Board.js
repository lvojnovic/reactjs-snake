import React from 'react';

import Tile from './Tile.js';

class Board extends React.Component {
  renderTile(i) {
    return (
      <Tile
        key={i}
        occupied={this.props.snake.some((s) => s.pos === i)}
        food={this.props.food === i}
      />
    );
  }

  render() {
    const boardSize = this.props.boardSize;
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
        onKeyDown={this.props.changeDirection}
        tabIndex={0}
      >
        {board}
      </div>
    );
  }
}

export default Board;
