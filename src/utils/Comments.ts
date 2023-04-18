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


