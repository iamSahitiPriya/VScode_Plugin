// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  highlightDecorationType,
  commentDecorationType,
} from "./decorations/decoration";
import codeTriggers from "./data/codeTriggers";
import { addCommandToOpenDocument } from "./methods/openDocumentOnCommand";
import SupportedLanguages from "./methods/SupportedLanguages";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // Register a new decoration type for the "react" keyword

  addCommandToOpenDocument(context);

  const editor = vscode.window.activeTextEditor;

  if (editor) {
    if (SupportedLanguages.isSupportedLanguage(editor.document.languageId)) {
      updateDecorations(editor);
    }
  }

  // Listen for text document open events
  vscode.workspace.onDidOpenTextDocument((document) => {
    if (SupportedLanguages.isSupportedLanguage(document.languageId)) {
      updateDecorationsForDocument(document);
    }
  });

  // Listen for text document change events
  vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document === event.document &&
      SupportedLanguages.isSupportedLanguage(event.document.languageId)
    ) {
      updateDecorations(editor);
    }
  });

  // Listen for text editor change events
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (
      editor &&
      SupportedLanguages.isSupportedLanguage(editor.document.languageId)
    ) {
      updateDecorations(editor);
    }
  });

  function updateDecorationsForDocument(document: vscode.TextDocument) {
    const editor = vscode.window.visibleTextEditors.find(
      (editor) => editor.document === document
    );
    if (editor) {
      updateDecorations(editor);
    }
  }

  function updateDecorations(editor: vscode.TextEditor) {
    const text = editor.document.getText();

    const hightlightDecorations: vscode.DecorationOptions[] = [];
    const commentDecorations: vscode.DecorationOptions[] = [];
    let match;
    for (const trigger of codeTriggers) {
      while ((match = trigger.regex.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(
          match.index + match[0].length
        );
        const markdownString = new vscode.MarkdownString();
        markdownString.supportHtml = true;
        markdownString.appendMarkdown("### Sensible Default Signals");
        markdownString.appendText("\n");
        markdownString.appendMarkdown(`#### ${trigger.name}`);
        markdownString.appendText("\n");
        for (const doc of trigger.relatedDocuments) {
          markdownString.appendMarkdown(
            "- Click on the [link provided](${doc}) for more information."
          );
          markdownString.appendText("\n");
        }
        markdownString.isTrusted = true;
        const highlightDecoration = {
          hoverMessage: markdownString,
          range: new vscode.Range(startPos, endPos),
        };
        hightlightDecorations.push(highlightDecoration);
        const endOfLine = editor.document.lineAt(startPos.line).range.end;
        const commentDecoration = {
          range: new vscode.Range(endOfLine, endOfLine),
        };
        commentDecorations.push(commentDecoration);
      }
      match = undefined;
    }
    editor.setDecorations(commentDecorationType, commentDecorations);
    editor.setDecorations(highlightDecorationType, hightlightDecorations);
  }

  /*
  code lens implementation
 context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      SupportedLanguages.getSupportedLanguage(),
      {
        async provideCodeLenses(document) {
          const codeLenses: vscode.CodeLens[] = [];

          const text = document.getText();
          let match;
          for (const trigger of codeTriggers) {
            while ((match = trigger.regex.exec(text)) !== null) {
              const startPos = document.positionAt(match.index);
              const endPos = document.positionAt(match.index + match[0].length);
              const range = new vscode.Range(startPos, endPos);
              codeLenses.push(new vscode.CodeLens(range));
            }
            match = undefined;
          }

          return codeLenses;
        },

        async resolveCodeLens(codeLens) {
          const showOptionsCommand = {
            title: "#Defaults",
            command: "extension.showOptions",
          };
          codeLens.command = showOptionsCommand;
          return codeLens;
        },
      }
    )
  );

  // Register the showOptions command
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.showOptions", async () => {
      // Create options dynamically
      const options = [
        {
          label: "Open RTL Default Document",
          action: () => {
            vscode.env.openExternal(
              vscode.Uri.parse(
                "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0"
              )
            );
            vscode.window.showInformationMessage(
              "Opening RTL default document"
            );
          },
        },
      ];

      // Show a custom quick pick with the options
      const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select any of the following related defaults",
      });

      if (selectedOption) {
        // Execute the selected action
        selectedOption.action();
      }
    })
  );
  */
}

// This method is called when your extension is deactivated
export function deactivate() {}
