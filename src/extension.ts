'use strict';

import * as vscode from 'vscode';
import Formatter from './formatter';

export function activate(context: vscode.ExtensionContext) {

    let config = vscode.workspace.getConfiguration('masontidy');
    let formatter = new Formatter(config);

    vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
        if (event.document.languageId !== 'mason') return;
        let stdFormatConfig = vscode.workspace.getConfiguration('editor');
        if (stdFormatConfig && stdFormatConfig['formatOnSave']) {
            event.waitUntil(vscode.commands.executeCommand('editor.action.formatDocument'));
        }
    });

    let provider = vscode.languages.registerDocumentRangeFormattingEditProvider('mason', {
        provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): Promise<vscode.TextEdit[]> {
            return formatter.format(document, range);
        }
    });

    context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
