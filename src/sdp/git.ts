import simpleGit, { LogResult } from 'simple-git';
import * as vscode from "vscode";

async function getCurrentBranch() {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new Error('No workspace folder found.');
      }
      const git = simpleGit(workspaceFolders[0].uri.fsPath);
      const branchSummary = await git.status();
      const currentBranch = branchSummary.current;
      return currentBranch;
    } catch (error) {
      console.error('Failed to get current branch:', error);
      return null;
    }
  }
  
  getCurrentBranch()
    .then((currentBranch) => {
      if(currentBranch !== null)
        {
          // vscode.window.showInformationMessage("Current Branch: "+ currentBranch);
        }
    })
    .catch((error) => {
      console.error('Error:', error);
    });