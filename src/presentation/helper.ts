import * as vscode from "vscode";
import Signal from "../types/Signal";

export const getCommentDecorationsOptions = (
    editor: vscode.TextEditor,
    map: Map<number, number>
  ) => {
    const options: {
      hoverMessage?: vscode.MarkdownString;
      range: vscode.Range;
    }[] = [];
  
    map.forEach((value, key) => {
      const lineIndex = key;
      const endOfLine = editor.document.lineAt(lineIndex).range.end;
      options.push({
        range: new vscode.Range(endOfLine, endOfLine),
      });
    });
    return options;
  };
  
  export const addCommentsToLine = (
    map: Map<number, number>,
    ranges: vscode.Range[]
  ) => {
    ranges.forEach((range) => {
      const rangeLine = range.start.line;
      if (map.get(rangeLine)) {
        let prevFrequecy = map.get(rangeLine) || 0;
        prevFrequecy++;
        map.set(rangeLine, prevFrequecy);
      } else {
        map.set(rangeLine, 1);
      }
    });
  };
  
  export const getHighlightDecorationsOption = (
    ranges: vscode.Range[],
    markdownString: vscode.MarkdownString
  ) => {
    const options = ranges.map((range) => {
      console.log(range.start.line);
  
      return {
        hoverMessage: markdownString,
        range: range,
      };
    });
    return options;
  };
  
  export const getCodeTriggerRanges = (
    editor: vscode.TextEditor,
    text: string,
    signal: Signal
  ) => {
    let match;
    const ranges: vscode.Range[] = [];
    for (const trigger of signal.codeTriggers) {
      while ((match = trigger.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const lineText = editor.document.lineAt(startPos.line).text;
        if (lineText.slice(0, 2) === "//") {
          continue;
        }
        const endPos = editor.document.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
      }
      match = undefined;
    }
    return ranges;
  };