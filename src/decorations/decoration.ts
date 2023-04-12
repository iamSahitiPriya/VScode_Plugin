import * as vscode from "vscode";

export const greenDecorationType = vscode.window.createTextEditorDecorationType(
  {
    color: "#32CD32",
    backgroundColor: "#696969",
  }
);

export const yellowDecorationType =
  vscode.window.createTextEditorDecorationType({
    color: "#FFFF00",
    backgroundColor: "#696969",
  });
