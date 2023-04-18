import * as vscode from "vscode";
import Signal from "../models/Signal";

export default async (signal: Signal,context:vscode.ExtensionContext) => {
    const currentSignals: Signal[] =
      (await context.workspaceState.get("signals")) || [];
    const updatedSignals = currentSignals.filter(
      (curSignal) => curSignal.name !== signal.name
    );
    await context.workspaceState.update("signals", updatedSignals);
  }