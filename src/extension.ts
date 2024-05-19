import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

    // Aligns the selected texts to the rightmost selection start
    context.subscriptions.push(vscode.commands.registerCommand("hastati.alignText", () => {
        if (!vscode.window.activeTextEditor) {
            return;
        }

        const editor = vscode.window.activeTextEditor;

        const maxColumn = Math.max(...editor.selections.map((sel) => sel.start.character));

        editor.edit((editBuilder) => editor.selections.forEach((sel) => {
            const numSpaces = maxColumn - sel.start.character;
            if (numSpaces > 0) {
                editBuilder.insert(sel.start, " ".repeat(numSpaces));
            }
        }));
    }));

    // Aligns the cursors to the leftmost selection start
    context.subscriptions.push(vscode.commands.registerCommand("hastati.alignCursors", () => {
        if (!vscode.window.activeTextEditor) {
            return;
        }

        const editor = vscode.window.activeTextEditor;

        const minColumn = Math.min(...editor.selections.map((sel) => sel.start.character));

        editor.selections = editor.selections.map((sel) =>
            new vscode.Selection(sel.end.line, sel.end.character, sel.start.line, minColumn)
        );
    }));
}

export function deactivate() {
}
