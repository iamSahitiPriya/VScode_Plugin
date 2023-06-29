// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import signals from "./data/signals";
import addCommandToOpenDocument from "./commands/openDocument";
import addCommandToRemoveSignal from "./commands/removeSignal";
import addCommandToOpenQuickPicks from "./commands/openQuickPicks";
import SupportedLanguages from "./utils/SupportedLanguages";
import addStylesToCodeTriggers from "./presentation/codeTriggerStyles";
import {
  activeTextEditorChangeHandler,
  openDocumentHandler,
  textChangeHandler,
} from "./handlers/handlers";
import { startBranchCheck } from "./sdp/git";
import notifyOnFileTriggers from "./presentation/fileTriggerStyles";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let isTriggered = false;
function setSignals(context: vscode.ExtensionContext) {
  context.workspaceState.update("signals", signals);
}

export function activate(context: vscode.ExtensionContext) {
  setSignals(context);
  addCommandToRemoveSignal(context);
  if (!isTriggered) {
    addCommandToOpenDocument(context);
  }
  addCommandToOpenQuickPicks(context);
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const editor = vscode.window.activeTextEditor;

  if (editor) {
    if (SupportedLanguages.isSupportedLanguage(editor.document.languageId)) {
      startBranchCheck();
      notifyOnFileTriggers(editor, context); 6
      addStylesToCodeTriggers(editor, context);
    }
  }

  // Listen for text document open events
  vscode.workspace.onDidOpenTextDocument((document) => {
    if (!isTriggered) {
      isTriggered = true;
      openDocumentHandler(document, context);
    }
  });

  // Listen for text document change events
  vscode.workspace.onDidChangeTextDocument((event) => {
    textChangeHandler(event, context);
  });

  // Listen for text editor change events
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && !isTriggered) {
      activeTextEditorChangeHandler(editor, context);
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() { }
