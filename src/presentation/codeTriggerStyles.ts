import * as vscode from "vscode";
import { commentDecorationType, highlightDecorationType } from "../decorations/decoration";
import Signal from "../types/Signal";
import { getMarkDownString } from "../utils/Comments";
import { addCommentsToLine, getCodeTriggerRanges, getCommentDecorationsOptions, getHighlightDecorationsOption } from "./helper";

export default function addStylesToCodeTriggers(editor: vscode.TextEditor,context: vscode.ExtensionContext) {
    const text = editor.document.getText();
    const hightlightDecorations: vscode.DecorationOptions[] = [];
    const commentDecorations: vscode.DecorationOptions[] = [];
    // const commentedLines: vscode.Range[] = [];
    const lineTriggerCountMap: Map<number, number> = new Map();
    // let match;
    const signals: Signal[] = context.workspaceState.get("signals") || [];
    for (const signal of signals) {
      const ranges = getCodeTriggerRanges(editor, text, signal);
      addCommentsToLine(lineTriggerCountMap, ranges);
      const markdownString = getMarkDownString(signal);
      const highlightDecorationOptions = getHighlightDecorationsOption(
        ranges,
        markdownString
      );
      highlightDecorationOptions.forEach((options) =>
        hightlightDecorations.push(options)
      );
    }
    const commentDecorationOptions = getCommentDecorationsOptions(
      editor,
      lineTriggerCountMap
    );
    commentDecorationOptions.forEach((option) => {
      console.log(option);
      commentDecorations.push(option);
    });
    editor.setDecorations(commentDecorationType, commentDecorations);
    editor.setDecorations(highlightDecorationType, hightlightDecorations);
  }
