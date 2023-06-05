import * as vscode from "vscode";
import Signal from "../models/Signal";
import { log } from "console";

export default (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sensible-default.openQuickPicks",
      async (signals: Signal[]) => {
        const signalNames = signals.map((signal) => signal.name);
        const selectedSignalName = await vscode.window.showQuickPick(
          signalNames,
          {
            placeHolder: "Select one of the signals",
          }
        );

        if (!selectedSignalName) {
          return;
        }
        const selectedSignal = signals.find(
          (signal) => signal.name === selectedSignalName
        );
        
        if (selectedSignal) {
          vscode.env.openExternal(vscode.Uri.parse(selectedSignal.document));
        }
      }
    )
  );
};
