// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import signals from "./data/signals";
import  addCommandToOpenDocument  from "./commands/openDocument";
import SupportedLanguages from "./utils/SupportedLanguages";
import Signal from "./types/Signal";
import addStylesToCodeTriggers from "./presentation/codeTriggerStyles";
import { activeTextEditorChangeHandler, openDocumentHandler, textChangeHandler } from "./handlers/handlers";
import notifyOnFileTriggers from "./presentation/fileTriggerStyles";
import removeSignal from "./commands/removeSignal";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function setSignals(context: vscode.ExtensionContext) {
  context.workspaceState.update("signals", signals);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sensible-default.removeSignal",
      (signal: Signal) => {
        removeSignal(signal, context);
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
      notifyOnFileTriggers(editor,context);
      addStylesToCodeTriggers(editor, context);
    }
  }

  // Listen for text document open events
  vscode.workspace.onDidOpenTextDocument((document) => {
    openDocumentHandler(document, context);
  });

  // Listen for text document change events
  vscode.workspace.onDidChangeTextDocument((event) => {
    textChangeHandler(event, context);
  });

  // Listen for text editor change events
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if(editor){
      activeTextEditorChangeHandler(editor, context);
    }
    
  });  
}

// This method is called when your extension is deactivated
export function deactivate() {}
