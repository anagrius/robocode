import React, { Component } from 'react';
import render from './engine/react-renderer/renderer';

export default class Board extends Component {

  propTypes: {
    game: React.PropTypes.object.isRequired,
    reset: React.PropTypes.func.isRequired,
  }

  render() {
    const {game, reset} = this.props;
    return (
      <div>
        {render(game, reset)}
      </div>
    );
  }
}
