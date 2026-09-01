import * as vscode from 'vscode';
import { ChatPanel } from './chatProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codesage.openChat', () => {
      ChatPanel.createOrShow(context.extensionUri);
    }),
    vscode.commands.registerCommand('codesage.explain', async () => {
      const panel = ChatPanel.createOrShow(context.extensionUri);
      await panel.sendQuickAction('Explain');
    }),
    vscode.commands.registerCommand('codesage.debug', async () => {
      const panel = ChatPanel.createOrShow(context.extensionUri);
      await panel.sendQuickAction('Debug');
    }),
    vscode.commands.registerCommand('codesage.improve', async () => {
      const panel = ChatPanel.createOrShow(context.extensionUri);
      await panel.sendQuickAction('Improve');
    }),
    vscode.commands.registerCommand('codesage.setApiKey', async () => {
      const key = await vscode.window.showInputBox({
        prompt: 'Enter your OpenRouter API Key',
        password: true,
        ignoreFocusOut: true
      });
      if (key) {
        await vscode.workspace.getConfiguration('codesage').update('apiKey', key, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('✅ CodeSage API key saved.');
      }
    })
  );
}

export function deactivate() {}
