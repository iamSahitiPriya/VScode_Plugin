import * as vscode from "vscode";
import Signal from "../models/Signal";
import * as path from "path";
import * as fs from "fs";
import glob = require("glob");
import { execSync } from 'child_process';
import simpleGit, { LogResult } from "simple-git";

let promiseResult:boolean[] = [];
export const getCommentDecorationsOptions = (
  editor: vscode.TextEditor,
  map: Map<number, number>
) => {
  const options: vscode.DecorationOptions[] = [];
  map.forEach((value, key) => {
    const lineIndex = key;
    const endOfLine = editor.document.lineAt(lineIndex).range.end;
    options.push({
      range: new vscode.Range(endOfLine, endOfLine),
    });
  });
  return options;
};

export const updateLineTriggerMap = (
  map: Map<number, number>,
  ranges: vscode.Range[]
) => {
  ranges.forEach((range) => {
    const rangeLine = range.start.line;
    if (map.get(rangeLine)) {
      let prevFrequecy = map.get(rangeLine) || 0;
      prevFrequecy++;
      map.set(rangeLine, prevFrequecy);
    } else {
      map.set(rangeLine, 1);
    }
  });
};

export const getHighlightDecorationsOption = (
  ranges: vscode.Range[],
  markdownString: vscode.MarkdownString
) => {
  const options = ranges.map((range) => {
    return {
      hoverMessage: markdownString,
      range: range,
    };
  });
  return options;
};

export const getCodeTriggerRanges = (
  editor: vscode.TextEditor,
  text: string,
  signal: Signal
) => {
  let match;
  const ranges: vscode.Range[] = [];
  for (const trigger of signal.codeTriggers) {
    while ((match = trigger.exec(text)) !== null) {
      const startPos = editor.document.positionAt(match.index);
      const lineText = editor.document.lineAt(startPos.line).text;
      if (lineText.slice(0, 2) === "//") {
        continue;
      }
      const endPos = editor.document.positionAt(match.index + match[0].length);
      ranges.push(new vscode.Range(startPos, endPos));
    }
    match = undefined;
  }
  return ranges;
};

export const jamStackSignal = () => {
  const rootPath = vscode.workspace.rootPath;
  if (rootPath) {
    const packageJson = glob.sync("**/package.json", {
      cwd: rootPath,
      nodir: true,
      ignore: "**/node_modules/**",
    });
    const packageJsonPath = path.join(rootPath, packageJson[0]);
    return (
      isNewlyCreated(packageJsonPath) ||
      isMarkedParserFound(packageJsonPath) ||
      isCmsToolInstalled()
    );
  }
  return false;
};

export const getActiveSignalsFromFileTriggers = (
  editor: vscode.TextEditor,
  signals: Signal[]
) => {
  const activeSignals: Signal[] = [];
  const fileName = editor.document.fileName;
  for (const signal of signals) {
    const triggers = signal.fileTriggers;
    for (const trigger of triggers) {
      if (fileName.toLowerCase().includes(trigger)) {
        activeSignals.push(signal);
        break;
      }
    }
    const triggerFunction = signal.triggerFunction;
    if (triggerFunction) {
      activeSignals.push(signal);
      break;
    }
  }
  return activeSignals;
};

export const removeActiveSignals = async (
  active: Signal[],
  context: vscode.ExtensionContext
) => {
  for (const activeSignal of active) {
    const signals: Signal[] =
      (await context.workspaceState.get("signals")) || [];
    const filteredSignals = signals.filter(
      (signal) => signal.name !== activeSignal.name
    );
    await context.workspaceState.update("signals", filteredSignals);
  }
};

export const isNewlyCreated = (packageJsonPath:string) => {
  const repoPath = vscode.workspace.rootPath;

  const git = simpleGit(repoPath);

  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
  try {
    const result = execSync('git log --pretty=format:%ad --date=iso-strict --reverse --max-parents=0', {
      cwd: repoPath,
      encoding: 'utf-8'
    });

    const firstCommitCreationDate = result.trim();

    return new Date(firstCommitCreationDate) > threeMonthsAgo;
  } catch (error) {
    const creationDate = fs.statSync(packageJsonPath).birthtime;
    return creationDate > threeMonthsAgo;
  }

};

export const isMarkedParserFound = (packageJsonPath: string) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const isDependencyAdded =
    packageJson.dependencies && packageJson.dependencies["marked"];
  return isDependencyAdded;
};

export const isCmsToolInstalled = () => {
  const projectDirectoryPath =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath;

  const htaccessFiles = glob.sync('**/.htaccess', {
    cwd: projectDirectoryPath,
    nodir: true,
    ignore: '**/node_modules/**'
  });
  return htaccessFiles.length > 0;
};
export const checkForMicroFrontendSignal = () => {
  if (vscode.workspace.workspaceFolders) {
    // Checking if react or react native project and project is new
    let rootPath = vscode.workspace.workspaceFolders[0].uri.path;
    let packageJson = glob.sync("**/package.json", {
      cwd: rootPath,
      nodir: true,
      ignore: "**/node_modules/**",
    });
    const packageJsonPath = path.join(rootPath, packageJson[0]);
    if (
      (isReactProject(packageJsonPath) ||
        isReactNativeProject(packageJsonPath)) &&
      isNewlyCreated(packageJsonPath)
    ) {
      return true;
    }

    // Checking if project contains many pages or screens
    let jsFiles = glob.sync("./src/**/*.{js,jsx,ts,tsx}", {
      cwd: rootPath,
      nodir: true,
      ignore: "**/node_modules/**",
    });

    const maxFileCount =
      parseInt(process.env.MICROFRONTEND_MAX_FILES_COUNT!) || 50;
    if (jsFiles.length >= maxFileCount) return true;

    // Checking if project is a big monolith
    if (isProjectABigMonolith(rootPath)) {
      return true;
    }

    // Checking if project has webpack config
    // and has Module Federation Plugin injected to it
    if (hasModuleFederationPlugin(rootPath)) {
      return true;
    }

    // check if project has MFE libraries added
    if (hasMFELibraries(packageJsonPath)) {
      return true;
    }
  }

  return false;

  function isReactProject(packageJsonPath: string) {
    let data = fs.readFileSync(packageJsonPath, "utf-8");
    return data.includes("react");
  }

  function isReactNativeProject(packageJsonPath: string) {
    let data = fs.readFileSync(packageJsonPath, "utf-8");
    return data.includes("react-native");
  }

  function isProjectABigMonolith(rootPath: string) {
    let files = glob.sync("./src/**/*.{js,jsx,ts,tsx}", {
      cwd: rootPath,
      nodir: true,
      ignore: "**/node_modules/**",
    });

    let currentLineCount = 0;
    for (const file of files) {
      let codeLines = fs.readFileSync(
        rootPath.concat(`/${file.substring(1)}`),
        "utf-8"
      );
      currentLineCount += codeLines.split("\n").length;
    }

    const maxLineCount =
      parseInt(process.env.MICROFRONTEND_MAX_FILES_COUNT!) || 5000;
    return currentLineCount >= maxLineCount;
  }

  function hasModuleFederationPlugin(rootPath: string) {
    // check if webpack.config.js exists
    let webpackFile = glob.sync("**/webpack.config.js", {
      cwd: rootPath,
      nodir: true,
      ignore: "**/node_modules/**",
    });
    if (webpackFile.length > 0) {
      // When exists, check if it hash module federation plugin injected into it
      let webpackCode = fs.readFileSync(
        rootPath.concat(`/${webpackFile[0]}`),
        "utf-8"
      );
      if (webpackCode.includes("ModuleFederationPlugin")) {
        return true;
      }
    }

    return false;
  }

  function hasMFELibraries(packageJsonPath: string) {
    let data = fs.readFileSync(packageJsonPath, "utf-8");
    let mfeLibraryIdentifiers = [
      "teambit",
      "single-spa",
      "piral-instance",
      "qiankun",
    ];
    return mfeLibraryIdentifiers.some((identifier) =>
      data.includes(identifier)
    );
  }
};
