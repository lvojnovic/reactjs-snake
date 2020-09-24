import React from 'react';

//TODO validate min, max
//TODO pause, resume

function Options(props) {
  return (
    <div className="options">
      <div>
        <label>
          Board size (10-40):
          <input
            type="number"
            name="boardSize"
            value={props.boardSize}
            min={10}
            max={40}
            step={10}
            onChange={props.onBoardSizeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Render interval (ms):
          <input
            type="number"
            name="boardSize"
            value={props.tickInterval}
            min={100}
            max={2000}
            step={100}
            onChange={props.onTickChange}
          />
        </label>
      </div>
      <div>
      <button onClick={props.restart}>
        Restart
      </button>
      </div>
    </div>
  );
}

export default Options;
