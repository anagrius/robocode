import React, { Component } from 'react';

require('./CodeEditor.css');

const storageKey = "__robocode_code";

const defaultOS = require('raw!./programs/default.txt');

export default class CodeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: localStorage.getItem(storageKey) || defaultOS
    };
  }

  codeUpdated(e) {
    localStorage.setItem(storageKey, e.target.value);
  }

  getValue() {
    return this.refs.editor.value;
  }

  render() {
    return (
      <div className="code-editor">
        <textarea
          ref="editor"
          onChange={this.codeUpdated}
          className="code-editor__canvas"
          defaultValue={this.state.code}>
        </textarea>
      </div>
    );
  }
}
