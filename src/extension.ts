// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  highlightDecorationType,
  commentDecorationType,
} from "./decorations/decoration";
import codeTriggers from "./data/codeTriggers";
import { addCommandToOpenDocument } from "./methods/utils";
import SupportedLanguages from "./methods/SupportedLanguages";
import { getMarkDownString } from "./methods/utils";
import fileTriggers from "./data/fileTriggers";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // Register a new decoration type for the "react" keyword

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
      notifyOnFileTriggers(editor);
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
    for (const trigger of fileTriggers) {
      if (fileName.includes(trigger.filePattern)) {
        const result = await vscode.window.showInformationMessage(
          "Found default document related to this file",
          "Open"
        );
        if (result) {
          vscode.env.openExternal(
            vscode.Uri.parse(trigger.signals[0].document)
          );
        }
      }
    }
  }

  function addStylesToCodeTriggers(editor: vscode.TextEditor) {
    const text = editor.document.getText();
    const hightlightDecorations: vscode.DecorationOptions[] = [];
    const commentDecorations: vscode.DecorationOptions[] = [];
    const commentedLines: number[] = [];
    let match;
    for (const trigger of codeTriggers) {
      while ((match = trigger.regex.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const lineText = editor.document.lineAt(startPos.line).text;
        if (lineText.slice(0, 2) === "//") {
          continue;
        }
        const endPos = editor.document.positionAt(
          match.index + match[0].length
        );
        const markdownString = getMarkDownString(trigger.signals);
        const highlightDecoration = {
          hoverMessage: markdownString,
          range: new vscode.Range(startPos, endPos),
        };
        hightlightDecorations.push(highlightDecoration);
        //add comment decoration to the line only if it is not present
        if (commentedLines.find((num) => num === startPos.line) === undefined) {
          const endOfLine = editor.document.lineAt(startPos.line).range.end;
          const commentDecoration = {
            range: new vscode.Range(endOfLine, endOfLine),
          };
          commentDecorations.push(commentDecoration);
          commentedLines.push(startPos.line);
        }
      }
      match = undefined;
    }
    editor.setDecorations(commentDecorationType, commentDecorations);
    editor.setDecorations(highlightDecorationType, hightlightDecorations);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
