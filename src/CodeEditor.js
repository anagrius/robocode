import React, { Component } from 'react';
import * as AI from './engine/ai.js';

require('./CodeEditor.css');

const CodeMirror = require('codemirror/lib/codemirror.js');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/dracula.css');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/hint/javascript-hint.js');
require('codemirror/addon/lint/lint.js');
require('codemirror/addon/lint/lint.css');
require('codemirror/addon/lint/javascript-lint.js');

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

    // Auto Complete

    CodeMirror.commands.autocomplete = function(cm) {
      cm.showHint({hint: CodeMirror.hint.javascript});
    };

    const orig = CodeMirror.hint.javascript;
    CodeMirror.hint.javascript = function(cm) {
      const inner = orig(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
      inner.list.push("AI");

      const fnNames = AI.createFns().map(item => item.name);
      inner.list = inner.list.concat(fnNames);
      return inner;
    };

    this.codemirror = new CodeMirror(element, {
      value: this.state.code || "",
      mode:  "javascript",
      theme: "dracula",
      lineNumbers: true,
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
      matchBrackets: true,
      extraKeys: {"Ctrl-Space": "autocomplete"},
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
