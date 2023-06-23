import * as vscode from "vscode";

export const highlightDecorationType =
  vscode.window.createTextEditorDecorationType({
    color: "#790890",
    fontWeight: "bold",
  });

export const commentDecorationType =
  vscode.window.createTextEditorDecorationType({
    after: {
      margin: "0 0 0 1em",
      contentText:
        "Found related #default signals. Hover over the higlighted text to get more info...",
      fontStyle: "italic",
      color: "gray",
    },
  });
