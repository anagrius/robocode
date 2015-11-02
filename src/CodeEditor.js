import React, { Component } from 'react';

require('./CodeEditor.css');

const CodeMirror = require('codemirror/lib/codemirror.js')
require('codemirror/lib/codemirror.css')
require('codemirror/theme/dracula.css')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/mode/javascript/javascript.js')

const storageKey = "__robocode_code";

const defaultOS = require('raw!./programs/default.txt');

export default class CodeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: localStorage.getItem(storageKey) || defaultOS
    };
  }

  codeUpdated() {
    localStorage.setItem(storageKey, this.codemirror.getValue());
  }

  getValue() {
    return this.codemirror.getValue();
  }

  componentDidMount() {
    const element = this.refs.editor;
    this.codemirror = CodeMirror(element, {
      value: this.state.code || "",
      mode:  "javascript",
      theme: "dracula",
      lineNumbers: true,
      matchBrackets: true
    });

    this.codemirror.on("changes", this.codeUpdated.bind(this));
  }

  render() {
    return (
      <div className="code-editor">
        <div className="code-editor__canvas" ref="editor"></div>
      </div>
    );
  }
}
