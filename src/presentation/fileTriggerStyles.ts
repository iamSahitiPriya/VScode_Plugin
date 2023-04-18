import * as vscode from "vscode";
import Signal from "../models/Signal";
export default async function notifyOnFileTriggers(editor: vscode.TextEditor,context: vscode.ExtensionContext) {
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