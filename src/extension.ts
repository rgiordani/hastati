
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// Aligns the text at the cursors to the rightmost cursor column
	let disposable = vscode.commands.registerCommand('hastati.alignText', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }

		const maxColumn = Math.max(...editor.selections.map((sel) => sel.active.character));

		editor.edit((editBuilder) => editor.selections.forEach((sel) => {
			const numSpaces = maxColumn - sel.active.character;
			if (numSpaces > 0) {
				editBuilder.insert(sel.active, " ".repeat(numSpaces));
			}
		}));
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
