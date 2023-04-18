import * as vscode from "vscode";
import addStylesToCodeTriggers from "../presentation/codeTriggerStyles";
import notifyOnFileTriggers from "../presentation/fileTriggerStyles";
import SupportedLanguages from "../utils/SupportedLanguages";

export const textChangeHandler=(event:vscode.TextDocumentChangeEvent,context:vscode.ExtensionContext) => {
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document === event.document &&
      SupportedLanguages.isSupportedLanguage(event.document.languageId)
    ) {
      addStylesToCodeTriggers(editor,context);
    }
  }
  export const openDocumentHandler=(document:vscode.TextDocument,context:vscode.ExtensionContext) => {
    if (SupportedLanguages.isSupportedLanguage(document.languageId)) {
        const editor = vscode.window.visibleTextEditors.find(
            (editor) => editor.document === document
          );
          if (editor) {
            notifyOnFileTriggers(editor,context);
            addStylesToCodeTriggers(editor, context);
          }
    }
  }

  export const activeTextEditorChangeHandler=(editor:vscode.TextEditor,context:vscode.ExtensionContext) => {
    if (
      editor &&
      SupportedLanguages.isSupportedLanguage(editor.document.languageId)
    ) {
      notifyOnFileTriggers(editor,context);
      addStylesToCodeTriggers(editor, context);
    }
  }