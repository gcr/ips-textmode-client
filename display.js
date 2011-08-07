var rl = require('readline');

exports.display = function(compl){
  // Creates a readline interface that doesn't stink quite as much ;)
  var i = rl.createInterface(process.stdin, process.stdout, complete);

  function startsWith(str, x) {
    return str.toLowerCase().slice(0,x.length) == x.toLowerCase();
  }

  function pickCase(word, target) {
    if (target.length && target.toLowerCase() == target) {
      return word.toLowerCase();
    } else if (target.length > 1 && target.toUpperCase() == target) {
      return word.toUpperCase();
    } else {
      return word;
    }
  }
  function complete(line) {
    var words = line.split(" "),
        lastWord = words[words.length-1].replace(/@/g, "");
    var possibleCompletions = compl()
                              .filter(function(x) {
                                        return startsWith(x, lastWord);
                                      })
                              .map(function(word) {
                                     return pickCase(word, lastWord);
                              });
    return [possibleCompletions, lastWord];
  }

  i._refreshLine = function() {
    if (this._closed) return;

    // Cursor to left edge.
    this.output.cursorTo(0);

    // Write the prompt and the current buffer content.
    this.output.write(this._prompt);
    var availableCols = rl.columns - this._promptLength - 1;

    // BUG: Moving the cursor right while output is truncated can be bad
    // for your health.
    if (this.line.length > availableCols) {
      // Truncate from the start or the end?
      if (this.cursor < availableCols-3) {
        // Truncate from the end.
        this.output.write(this.line.slice(0, availableCols-3)+"...");
        // Erase to right.
        this.output.clearLine(1);
        // Move cursor to original position.
        this.output.cursorTo(this._promptLength + this.cursor);
      } else {
        // Truncate from the start.
        this.output.write("..." + this.line.slice(
                            this.cursor-availableCols+3,
                            this.cursor
                          ));
        // Erase to right.
        this.output.clearLine(1);
        // Move cursor to original position.
        this.output.cursorTo(rl.columns);
      }
    } else {
      this.output.write(this.line);
      // Erase to right.
      this.output.clearLine(1);
      // Move cursor to original position.
      this.output.cursorTo(this._promptLength + this.cursor);
    }

  };
  i._insertString = function(c) {
    //BUG: Problem when adding tabs with following content.
    //     Perhaps the bug is in _refreshLine(). Not sure.
    //     A hack would be to insert spaces instead of literal '\t'.
    if (this.cursor < this.line.length) {
      var beg = this.line.slice(0, this.cursor);
      var end = this.line.slice(this.cursor, this.line.length);
      this.line = beg + c + end;
      this.cursor += c.length;
      this._refreshLine();
    } else {
      this.line += c;
      this.cursor += c.length;
      if (this._promptLength + this.cursor > rl.columns-1) {
        this._refreshLine();
      } else {
        this.output.write(c);
      }
    }
  };
  i._line = function() {
    var line = this._addHistory();
    //this.output.write('\r\n');
    // Cursor to left edge.
    this.output.cursorTo(0);
    // Erase to right.
    this.output.clearLine(1);
    this._onLine(line);
  };

  i.out = function(str) {
    i.output.cursorTo(0);
    i.output.clearLine(1);
    i.output.write(str);
    i.output.write("\n");
    i._refreshLine();
  };

  return i;
};
