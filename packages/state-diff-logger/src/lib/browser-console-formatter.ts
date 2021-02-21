import BaseFormatter from './base-formatter';

function consoleColor(style) {
  return function (text) {
    return {
      text: `%c${text}`,
      style,
    };
  };
  // return (
  //   (chalk && chalk[name]) ||
  //   function(...args) {
  //     return args;
  //   }
  // );
}

let colors = {
  added: consoleColor(
    'background: green; color: #fff; padding: 4px; border-radius: 2px'
  ),
  deleted: consoleColor(
    'text-decoration: line-trough ;background: red; color: #fff; padding: 4px; border-radius: 2px'
  ),
  movedestination: consoleColor(
    'background: gray; color: #fff; padding: 4px; border-radius: 2px'
  ),
  moved: consoleColor(
    'background: yellow; color: #fff; padding: 4px; border-radius: 2px'
  ),
  unchanged: consoleColor(
    'background: gray; color: #fff; padding: 4px; border-radius: 2px'
  ),
  error: consoleColor(
    'background: red; color: #fff; padding: 4px; border-radius: 2px'
  ),
  textDiffLine: consoleColor(
    'background: gray; color: #fff; padding: 4px; border-radius: 2px'
  ),
  unset: consoleColor(
    'background: unset; color: unset padding: 4px; border-radius: unset'
  ),
};

class BrowserConsoleFormatter extends BaseFormatter {
  constructor() {
    super();
    this.includeMoveDestinations = false;
  }

  prepareContext(context) {
    super.prepareContext(context);
    context.styles = [];
    context.indent = function (levels) {
      this.indentLevel =
        (this.indentLevel || 0) + (typeof levels === 'undefined' ? 1 : levels);
      this.indentPad = new Array(this.indentLevel + 1).join('  ');
      this.outLine();
    };
    context.outLine = function () {
      this.buffer.push(`%c\n${this.indentPad || ''}`);
      this.styles.push(
        'background: unset; color: unset padding: 4px; border-radius: unset'
      );
    };
    context.out = function (...args) {
      for (let i = 0, l = args.length; i < l; i++) {
        let lines = args[i].split('\n');
        let text = lines.join(`\n${this.indentPad || ''}`);
        if (this.color && this.color[0]) {
          const result = this.color[0](text);
          text = result.text;
          const style = result.style;
          this.styles.push(style);
        }
        this.buffer.push(text);
      }
    };
    context.pushColor = function (color) {
      this.color = this.color || [];
      this.color.unshift(color);
    };
    context.popColor = function () {
      this.color = [];
      this.color.unshift(colors.unset);
    };
  }

  typeFormattterErrorFormatter(context, err) {
    context.pushColor(colors.error);
    context.out(`[ERROR]${err}`);
    context.popColor();
  }

  formatValue(context, value) {
    context.out(JSON.stringify(value, null, 2));
  }

  formatTextDiffString(context, value) {
    let lines = this.parseTextDiff(value);
    context.indent();
    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i];
      context.pushColor(colors.textDiffLine);
      context.out(`${line.location.line},${line.location.chr} `);
      context.popColor();
      let pieces = line.pieces;
      for (
        let pieceIndex = 0, piecesLength = pieces.length;
        pieceIndex < piecesLength;
        pieceIndex++
      ) {
        let piece = pieces[pieceIndex];
        context.pushColor(colors[piece.type]);
        context.out(piece.text);
        context.popColor();
      }
      if (i < l - 1) {
        context.outLine();
      }
    }
    context.indent(-1);
  }

  rootBegin(context, type, nodeType) {
    context.pushColor(colors[type]);
    if (type === 'node') {
      context.out(nodeType === 'array' ? '[' : '{');
      context.indent();
    }
  }

  rootEnd(context, type, nodeType) {
    if (type === 'node') {
      context.indent(-1);
      context.out(nodeType === 'array' ? ']' : '}');
    }
    context.popColor();
  }

  nodeBegin(context, key, leftKey, type, nodeType) {
    context.pushColor(colors[type]);
    context.out(`${leftKey}: `);
    if (type === 'node') {
      context.out(nodeType === 'array' ? '[' : '{');
      context.indent();
    }
  }

  nodeEnd(context, key, leftKey, type, nodeType, isLast) {
    if (type === 'node') {
      context.indent(-1);
      context.out(nodeType === 'array' ? ']' : `}${isLast ? '' : ','}`);
    }
    if (!isLast) {
      context.outLine();
    }
    context.popColor();
  }

  /* jshint camelcase: false */
  /* eslint-disable camelcase */

  format_unchanged(context, delta, left) {
    if (typeof left === 'undefined') {
      return;
    }
    this.formatValue(context, left);
  }

  format_movedestination(context, delta, left) {
    if (typeof left === 'undefined') {
      return;
    }
    this.formatValue(context, left);
  }

  format_node(context, delta, left) {
    // recurse
    this.formatDeltaChildren(context, delta, left);
  }

  format_added(context, delta) {
    this.formatValue(context, delta[0]);
  }

  format_modified(context, delta) {
    context.pushColor(colors.deleted);
    this.formatValue(context, delta[0]);
    context.popColor();
    context.out(' => ');
    context.pushColor(colors.added);
    this.formatValue(context, delta[1]);
    context.popColor();
  }

  format_deleted(context, delta) {
    this.formatValue(context, delta[0]);
  }

  format_moved(context, delta) {
    context.out(`==> ${delta[1]}`);
  }

  format_textdiff(context, delta) {
    this.formatTextDiffString(context, delta[0]);
  }
}

/* eslint-enable camelcase */

/* jshint camelcase: true */

export default BrowserConsoleFormatter;

let defaultInstance;

export const format = (delta, left) => {
  if (!defaultInstance) {
    defaultInstance = new BrowserConsoleFormatter();
  }
  return defaultInstance.format(delta, left);
};

export function log(delta, left) {
  console.log(format(delta, left));
}
