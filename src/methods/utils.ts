import * as vscode from "vscode";
import Signal from "../types/Signal";

export const getMarkDownString = (signal: Signal) => {
  const markdownString = new vscode.MarkdownString();
  markdownString.supportHtml = true;
  markdownString.appendMarkdown(`### ${signal.name}`);
  markdownString.appendText("\n");
  markdownString.appendMarkdown(`<p>${signal.description}</p>`);
  markdownString.appendText("\n");
  markdownString.appendMarkdown(
    `Click <b>[here](${signal.document})</b> for more information on this signal.`
  );
  markdownString.appendText("\n");
  markdownString.appendMarkdown(
    `Click <b>[here](command:sensible-default.removeSignal?${encodeURIComponent(
      JSON.stringify([signal])
    )})</b> to ignore this signal.`
  );
  markdownString.appendText("\n");
  markdownString.isTrusted = true;
  return markdownString;
};

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
