
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// Aligns the text at the cursors to the rightmost cursor column
	context.subscriptions.push(vscode.commands.registerCommand('hastati.alignText', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }

		const maxColumn = Math.max(...editor.selections.map((sel) => sel.active.character));

		editor.edit((editBuilder) => editor.selections.forEach((sel) => {
			const numSpaces = maxColumn - sel.active.character;
			if (numSpaces > 0) {
				editBuilder.insert(sel.active, " ".repeat(numSpaces));
			}
		}));
	}));

	// Aligns the cursors to the leftmost cursor column
	context.subscriptions.push(vscode.commands.registerCommand('hastati.alignCursors', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }

		const minColumn = Math.min(...editor.selections.map((sel) => sel.active.character));

		editor.selections = editor.selections.map((sel) =>
			new vscode.Selection(sel.active.line, minColumn, sel.active.line, minColumn)
	    );
	}));
}

export function deactivate() { }
