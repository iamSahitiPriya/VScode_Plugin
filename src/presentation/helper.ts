import * as vscode from "vscode";
import Signal from "../models/Signal";

export const getCommentDecorationsOptions = (
  editor: vscode.TextEditor,
  map: Map<number, number>
) => {
  const options: vscode.DecorationOptions[] = [];
  map.forEach((value, key) => {
    const lineIndex = key;
    const endOfLine = editor.document.lineAt(lineIndex).range.end;
    options.push({
      range: new vscode.Range(endOfLine, endOfLine),
    });
  });
  return options;
};

export const updateLineTriggerMap = (
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

export const getActiveSignalsFromFileTriggers = (
  editor: vscode.TextEditor,
  signals: Signal[]
) => {
  const activeSignals: Signal[] = [];
  const fileName = editor.document.fileName;
  for (const signal of signals) {
    const triggers = signal.fileTriggers;
    for (const trigger of triggers) {
      if (fileName.toLowerCase().includes(trigger)) {
        activeSignals.push(signal);
        break;
      }
    }
  }
  return activeSignals;
};

export const removeActiveSignals = async (
  active: Signal[],
  context: vscode.ExtensionContext
) => {
  for (const activeSignal of active) {
    const signals: Signal[] =
      (await context.workspaceState.get("signals")) || [];
    const filteredSignals = signals.filter(
      (signal) => signal.name !== activeSignal.name
    );
    await context.workspaceState.update("signals", filteredSignals);
  }
};
