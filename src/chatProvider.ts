import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { callOpenRouter, buildSystemPrompt, buildContextBlock, ChatMessage } from './api';

export class ChatPanel {
  public static current: ChatPanel | undefined;
  public static readonly viewType = 'codesageChat';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private history: ChatMessage[] = [];
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.Beside;
    if (ChatPanel.current) {
      ChatPanel.current.panel.reveal(column);
      return ChatPanel.current;
    }
    const panel = vscode.window.createWebviewPanel(
      ChatPanel.viewType,
      'CodeSage AI',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
      }
    );
    ChatPanel.current = new ChatPanel(panel, extensionUri);
    return ChatPanel.current;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.panel.webview.html = this.getHtml();
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === 'send') {
        await this.handleUserMessage(msg.text, msg.expertise, msg.action);
      } else if (msg.type === 'clear') {
        this.history = [];
      }
    }, null, this.disposables);
  }

  public async sendQuickAction(action: 'Explain' | 'Debug' | 'Improve') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Open a file and select code first.');
      return;
    }
    const selection = editor.document.getText(editor.selection);
    if (!selection.trim()) {
      vscode.window.showWarningMessage('Select some code first.');
      return;
    }
    const expertise = vscode.workspace.getConfiguration('codesage').get<string>('expertiseLevel') || 'Intermediate';
    await this.handleUserMessage(`Please ${action.toLowerCase()} this code.`, expertise, action);
  }

  private async handleUserMessage(text: string, expertise: string, action?: string) {
    const editor = vscode.window.activeTextEditor;
    let userContent = text;

    if (editor && !editor.selection.isEmpty) {
      const code = editor.document.getText(editor.selection);
      const filename = path.basename(editor.document.fileName);
      const language = editor.document.languageId;
      userContent = `${text}\n\n${buildContextBlock(code, filename, language, action || 'Discuss')}`;
    }

    this.history.push({ role: 'user', content: userContent });
    this.panel.webview.postMessage({ type: 'userMessage', text });
    this.panel.webview.postMessage({ type: 'typing', on: true });

    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: buildSystemPrompt(expertise) },
        ...this.history
      ];
      const reply = await callOpenRouter(messages);
      this.history.push({ role: 'assistant', content: reply });
      this.panel.webview.postMessage({ type: 'assistantMessage', text: reply });
    } catch (err: any) {
      this.panel.webview.postMessage({ type: 'assistantMessage', text: `❌ **Error:** ${err.message}` });
    } finally {
      this.panel.webview.postMessage({ type: 'typing', on: false });
    }
  }

  private getHtml(): string {
    const mediaPath = path.join(this.extensionUri.fsPath, 'media');
    const html = fs.readFileSync(path.join(mediaPath, 'chat.html'), 'utf-8');
    const cssUri = this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'chat.css'));
    const jsUri = this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'chat.js'));
    return html.replace('{{CSS}}', cssUri.toString()).replace('{{JS}}', jsUri.toString());
  }

  public dispose() {
    ChatPanel.current = undefined;
    this.panel.dispose();
    while (this.disposables.length) this.disposables.pop()?.dispose();
  }
}
