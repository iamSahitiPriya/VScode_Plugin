import * as vscode from "vscode";

export const addCommandToOpenDocument = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sensible-default.openDefaultsDocument",
      () => {
        const sensibleDefaultDocumentUrl =
          "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1076bcff033_0_1556";
        vscode.env.openExternal(vscode.Uri.parse(sensibleDefaultDocumentUrl));
      }
    )
  );
};
