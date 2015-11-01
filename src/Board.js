import React, { Component } from 'react';
import render from './engine/react-renderer/renderer';

export default class Board extends Component {

  propTypes: {
    game: React.PropTypes.object.isRequired
  }

  render() {
    const game = this.props.game;
    return (
      <div>
        {render(game)}
      </div>
    );
  }
}
