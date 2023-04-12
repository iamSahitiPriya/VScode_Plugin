// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  yellowDecorationType,
  greenDecorationType,
} from "./decorations/decoration";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const sensibleDefaultDocumentUrl =
  "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1076bcff033_0_1556";

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "sensible-default.openDefaultsDocument",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user

      vscode.env.openExternal(vscode.Uri.parse(sensibleDefaultDocumentUrl));
    }
  );
  context.subscriptions.push(disposable);
  // Register a new decoration type for the "react" keyword

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    if (isSupportedLanguage(editor.document.languageId)) {
      updateRTLDecorations(editor, greenDecorationType);
      updateEnzymeDecorations(editor, yellowDecorationType);
    }
  }

  // Listen for text document open events
  vscode.workspace.onDidOpenTextDocument((document) => {
    console.log(document.fileName);
    if (isSupportedLanguage(document.languageId)) {
      updateDecorationsForDocument(document);
    }
  });

  // Listen for text document change events
  vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document === event.document &&
      isSupportedLanguage(event.document.languageId)
    ) {
      updateRTLDecorations(editor, greenDecorationType);
      updateEnzymeDecorations(editor, yellowDecorationType);
    }
  });

  // Listen for text editor change events
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && isSupportedLanguage(editor.document.languageId)) {
      updateRTLDecorations(editor, greenDecorationType);
      updateEnzymeDecorations(editor, yellowDecorationType);
    }
  });

  function isSupportedLanguage(languageId: string): boolean {
    return languageId === "javascript" || languageId === "typescript";
  }

  function updateDecorationsForDocument(document: vscode.TextDocument) {
    const editor = vscode.window.visibleTextEditors.find(
      (editor) => editor.document === document
    );
    if (editor) {
      updateRTLDecorations(editor, greenDecorationType);
      updateEnzymeDecorations(editor, yellowDecorationType);
    }
  }

  function updateRTLDecorations(
    editor: vscode.TextEditor,
    decoration: vscode.TextEditorDecorationType
  ) {
    const text = editor.document.getText();
    const reactKeywordRegex = /@testing-library\/react/g;
    const decorations: vscode.DecorationOptions[] = [];

    let match;
    while ((match = reactKeywordRegex.exec(text)) !== null) {
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(match.index + match[0].length);
      const decoration = { range: new vscode.Range(startPos, endPos) };
      decorations.push(decoration);
    }

    editor.setDecorations(decoration, decorations);
  }

  function updateEnzymeDecorations(
    editor: vscode.TextEditor,
    decoration: vscode.TextEditorDecorationType
  ) {
    const text = editor.document.getText();
    const reactKeywordRegex = /\benzyme\b/gi;
    const decorations: vscode.DecorationOptions[] = [];

    let match;
    while ((match = reactKeywordRegex.exec(text)) !== null) {
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(match.index + match[0].length);
      const decoration = { range: new vscode.Range(startPos, endPos) };
      decorations.push(decoration);
    }

    editor.setDecorations(decoration, decorations);
  }

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(["javascript", "typescript"], {
      async provideCodeLenses(document) {
        const codeLenses: vscode.CodeLens[] = [];

        const text = document.getText();
        const reactKeywordRegex = /@testing-library\/react/g;
        let match;

        while ((match = reactKeywordRegex.exec(text)) !== null) {
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);

          codeLenses.push(new vscode.CodeLens(range));
        }

        return codeLenses;
      },

      async resolveCodeLens(codeLens) {
        const showOptionsCommand = {
          title: "Show related #defaults",
          command: "extension.showOptions",
          arguments: [codeLens.range.start],
        };
        codeLens.command = showOptionsCommand;
        return codeLens;
      },
    })
  );

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(["javascript", "typescript"], {
      async provideCodeLenses(document) {
        const codeLenses: vscode.CodeLens[] = [];

        const text = document.getText();
        const enzymeKeywordRegex = /\benzyme\b/gi;
        let match;

        while ((match = enzymeKeywordRegex.exec(text)) !== null) {
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);

          codeLenses.push(new vscode.CodeLens(range));
        }

        return codeLenses;
      },

      async resolveCodeLens(codeLens) {
        const showOptionsCommand = {
          title: "Show related #defaults",
          command: "extension.showOptions",
          arguments: [codeLens.range.start],
        };
        codeLens.command = showOptionsCommand;
        return codeLens;
      },
    })
  );

  // Register the showOptions command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.showOptions",
      async (position: vscode.Position) => {
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
      }
    )
  );

  /*context.subscriptions.push(
    vscode.languages.registerHoverProvider(["javascript", "typescript"], {
      provideHover(document, position) {
        // Check if the word at the position is "react"
        const wordRange = document.getWordRangeAtPosition(
          position,
          /@testing-library\/react/g
        );
        if (wordRange) {
          // Create a MarkdownString with a command link
          const hoverMessage = new vscode.MarkdownString(
            `[Click to show options](command:extension.showOptions)`
          );
          hoverMessage.isTrusted = true;
          return new vscode.Hover(hoverMessage, wordRange);
        }
      },
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.showOptions", async () => {
      // Create options dynamically
      const options = [
        {
          label: "Option 1",
          action: async () => {
            vscode.env.openExternal(
              vscode.Uri.parse(sensibleDefaultDocumentUrl)
            );
            vscode.window.showInformationMessage(
              "Opening RTL default document"
            );
          },
        },
        
      ];

      // Show a custom quick pick with the options
      const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select an option",
      });

      if (selectedOption) {
        // Execute the selected action
        selectedOption.action();
      }
    })
  );*/
}

// This method is called when your extension is deactivated
export function deactivate() {}
