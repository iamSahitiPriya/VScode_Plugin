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
      "Found default document related to this file",
      "View Signals",
      "Ignore All Signal"
    );
    if (!result) {
      return;
    }
    if (result === "Ignore All Signal") {
      removeActiveSignals(activeSignals, context);
    }
    if (result === "View Signals") {
      vscode.commands.executeCommand(
        "sensible-default.openQuickPicks",
        activeSignals
      );
    }
  }
}
