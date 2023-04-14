import { DocumentSelector } from "vscode";

export default {
  isSupportedLanguage: (languageId: string): boolean => {
    return (
      languageId === "javascript" ||
      languageId === "typescript" ||
      languageId === "json" ||
      languageId === "javascriptreact" ||
      languageId === "typescriptreact"
    );
  },
  getSupportedLanguage: (): DocumentSelector => {
    return [
      "javascript",
      "typescript",
      "json",
      "javascriptreact",
      "typescriptreact",
    ];
  },
};
