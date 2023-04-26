import { sign } from "crypto";
import * as vscode from "vscode";
import {
  commentDecorationType,
  highlightDecorationType,
} from "../decorations/decoration";
import Signal from "../models/Signal";
import { getMarkDownString } from "../utils/Comments";
import {
  updateLineTriggerMap,
  getCodeTriggerRanges,
  getCommentDecorationsOptions,
  getHighlightDecorationsOption,
} from "./helper";

export default function addStylesToCodeTriggers(
  editor: vscode.TextEditor,
  context: vscode.ExtensionContext
) {
  const text = editor.document.getText();
  const hightlightDecorationsOptions: vscode.DecorationOptions[] = [];
  const lineTriggerCountMap: Map<number, number> = new Map();
  const signals: Signal[] = context.workspaceState.get("signals") || [];
  for (const signal of signals) {
    const ranges = getCodeTriggerRanges(editor, text, signal);
    updateLineTriggerMap(lineTriggerCountMap, ranges);
    const markdownString = getMarkDownString(signal);
    getHighlightDecorationsOption(ranges, markdownString).forEach((options) =>
      hightlightDecorationsOptions.push(options)
    );
  }

  editor.setDecorations(
    commentDecorationType,
    getCommentDecorationsOptions(editor, lineTriggerCountMap)
  );
  editor.setDecorations(highlightDecorationType, hightlightDecorationsOptions);
}
