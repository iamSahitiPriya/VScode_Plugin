import * as vscode from "vscode";
import Signal from "../models/Signal";
import {
  getActiveSignalsFromFileTriggers,
  removeActiveSignals,
} from "./helper";
export default async function notifyOnFileTriggers(
  editor: vscode.TextEditor,
  context: vscode.ExtensionContext
) {
  const signals: Signal[] = context.workspaceState.get("signals") || [];
  const activeSignals = getActiveSignalsFromFileTriggers(editor, signals);
  if (activeSignals.length > 0) {
    const result = await vscode.window.showInformationMessage(
      "Found #default signal(s) related to this project",
      "View signals",
      "Ignore all signal(s)"
    );
    if (!result) {
      return;
    }
    if (result === "Ignore all signal(s)") {
      removeActiveSignals(activeSignals, context);
    }
    if (result === "View signals") {
      vscode.commands.executeCommand(
        "sensible-default.openQuickPicks",
        activeSignals
      );
    }
  }
}
