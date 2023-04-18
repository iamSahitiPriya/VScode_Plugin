// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  highlightDecorationType,
  commentDecorationType,
} from "./decorations/decoration";
import signals from "./data/signals";
import { addCommandToOpenDocument } from "./methods/utils";
import SupportedLanguages from "./methods/SupportedLanguages";
import { getMarkDownString } from "./methods/utils";
import Signal from "./types/Signal";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function setSignals(context: vscode.ExtensionContext) {
  context.workspaceState.update("signals", signals);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sensible-default.removeSignal",
      async (signal: Signal) => {
        const currentSignals: Signal[] =
          (await context.workspaceState.get("signals")) || [];
        const updatedSignals = currentSignals.filter(
          (curSignal) => curSignal.name !== signal.name
        );
        await context.workspaceState.update("signals", updatedSignals);
      }
    )
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  setSignals(context);

  addCommandToOpenDocument(context);

  const editor = vscode.window.activeTextEditor;

  if (editor) {
    if (SupportedLanguages.isSupportedLanguage(editor.document.languageId)) {
      notifyOnFileTriggers(editor);
      addStylesToCodeTriggers(editor);
    }
  }

  // Listen for text document open events
  vscode.workspace.onDidOpenTextDocument((document) => {
    if (SupportedLanguages.isSupportedLanguage(document.languageId)) {
      updateDecorationsForDocument(document);
    }
  });

  // Listen for text document change events
  vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document === event.document &&
      SupportedLanguages.isSupportedLanguage(event.document.languageId)
    ) {
      addStylesToCodeTriggers(editor);
    }
  });

  // Listen for text editor change events
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (
      editor &&
      SupportedLanguages.isSupportedLanguage(editor.document.languageId)
    ) {
      notifyOnFileTriggers(editor);
      addStylesToCodeTriggers(editor);
    }
  });

  function updateDecorationsForDocument(document: vscode.TextDocument) {
    const editor = vscode.window.visibleTextEditors.find(
      (editor) => editor.document === document
    );
    if (editor) {
      notifyOnFileTriggers(editor);
      addStylesToCodeTriggers(editor);
    }
  }

  async function notifyOnFileTriggers(editor: vscode.TextEditor) {
    const fileName = editor.document.fileName;
    const signals: Signal[] = context.workspaceState.get("signals") || [];
    for (const signal of signals) {
      const triggers = signal.fileTriggers;
      for (const trigger of triggers) {
        if (fileName.includes(trigger)) {
          const result = await vscode.window.showInformationMessage(
            "Found default document related to this file",
            "Open",
            "Ignore Signal"
          );
          if (result === "Open") {
            vscode.env.openExternal(vscode.Uri.parse(signal.document));
          }
          if (result === "Ignore Signal") {
            vscode.commands.executeCommand(
              "sensible-default.removeSignal",
              signal
            );
          }
          if (result) {
            break;
          }
        }
      }
    }
  }

  function addStylesToCodeTriggers(editor: vscode.TextEditor) {
    const text = editor.document.getText();
    const hightlightDecorations: vscode.DecorationOptions[] = [];
    const commentDecorations: vscode.DecorationOptions[] = [];
    // const commentedLines: vscode.Range[] = [];
    const lineTriggerCountMap: Map<number, number> = new Map();
    // let match;
    const signals: Signal[] = context.workspaceState.get("signals") || [];
    for (const signal of signals) {
      const ranges = getCodeTriggerRanges(editor, text, signal);
      addCommentsToLine(lineTriggerCountMap, ranges);
      const markdownString = getMarkDownString(signal);
      const highlightDecorationOptions = getHighlightDecorationsOption(
        ranges,
        markdownString
      );
      highlightDecorationOptions.forEach((options) =>
        hightlightDecorations.push(options)
      );
    }
    const commentDecorationOptions = getCommentDecorationsOptions(
      editor,
      lineTriggerCountMap
    );
    commentDecorationOptions.forEach((option) => {
      console.log(option);
      commentDecorations.push(option);
    });
    editor.setDecorations(commentDecorationType, commentDecorations);
    editor.setDecorations(highlightDecorationType, hightlightDecorations);
  }
}

const getCommentDecorationsOptions = (
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

const addCommentsToLine = (
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

const getHighlightDecorationsOption = (
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

const getCodeTriggerRanges = (
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

// This method is called when your extension is deactivated
export function deactivate() {}
