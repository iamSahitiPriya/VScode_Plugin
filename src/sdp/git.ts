import simpleGit from 'simple-git';
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
    if (currentBranch) {
      vscode.window.showInformationMessage("Current Branch: " + currentBranch);
    }
  } catch (error) {
    console.error('Failed to get current branch:', error);
  }
}

export const startBranchCheck = () => {
  // Clear the previous interval if any
  let intervalId: string | number | NodeJS.Timeout | undefined;
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Initial check
  getCurrentBranch();

  // Schedule periodic checks
  intervalId = setInterval(getCurrentBranch, 10 * 1000); // 8 hours
};
      // startBranchCheck();

