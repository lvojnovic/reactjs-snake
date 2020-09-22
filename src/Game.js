import React from 'react';

import Board from './Board.js';

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      running: true,
    };

    this.gameOver = this.gameOver.bind(this);
  }

  gameOver() {
    this.setState({
      running: false
    });
  }

  render() {
    return (
      <div>
        <div>
          {"SNAKE" + (this.state.running ? '' : ' GAME OVER!')}
        </div>
        <Board onGameOver={this.gameOver} />
      </div>
    );
  }
}

export default Game;
