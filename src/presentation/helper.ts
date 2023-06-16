import * as vscode from "vscode";
import Signal from "../models/Signal";
import * as path from 'path';
import * as fs from 'fs';
import glob = require("glob");
import simpleGit, { ListLogSummary } from 'simple-git';
import { execSync } from 'child_process';


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
  let isJamStackTriggered;
  const rootPath = vscode.workspace.rootPath;
  if (rootPath) {
    const packageJson = glob.sync('**/package.json', {
      cwd: rootPath,
      nodir: true,
      ignore: '**/node_modules/**'
    });
    const packageJsonPath = path.join(rootPath, packageJson[0]);
    isJamStackTriggered = isNewlyCreated(packageJsonPath) || isMarkedParserFound(packageJsonPath) || isCmsToolInstalled();      
  }  
  return isJamStackTriggered;
};


export const getActiveSignalsFromFileTriggers = (
  editor: vscode.TextEditor,
  signals: Signal[]
) => {
  const activeSignals: Signal[] = [];
  if (jamStackSignal()) {
    const jamStackSignal = signals.find(eachSignal => eachSignal.name = "JAMStack for content-heavy sites");
    if (jamStackSignal) {
      activeSignals.push(jamStackSignal);
    }
  }
  const fileName = editor.document.fileName;
  for (const signal of signals) {
    const triggers = signal.fileTriggers;
    for (const trigger of triggers) {
      if (fileName.toLowerCase().includes(trigger)) {
        activeSignals.push(signal);
        break;
      }
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
  let val:boolean = false;

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


  // const commitHistory: ListLogSummary = git.log();
  
  // await git.log(['--reverse']).then((log: LogResult) => {
  //   const firstCommit = log.latest?.date;
  //   creationDate = firstCommit;
  //   if (creationDate) {
  //     val = new Date(creationDate) > threeMonthsAgo;
  //   }
  // }).catch((_err) => {
  //   const creationDate = fs.statSync(packageJsonPath).birthtime;
  //   val =  creationDate > threeMonthsAgo;
  // });
  // return val;
};

export const isMarkedParserFound = (packageJsonPath: string) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const isDependencyAdded = packageJson.dependencies && packageJson.dependencies['marked'];
  return isDependencyAdded;
};

export const isCmsToolInstalled = () => {
  const projectDirectoryPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

  const htaccessFiles = glob.sync('**/.htaccess', {
    cwd: projectDirectoryPath,
    nodir: true,
    ignore: '**/node_modules/**'
  });
  return htaccessFiles.length > 0;
};