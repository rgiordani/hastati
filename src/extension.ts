import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

    // Aligns the selected texts to the rightmost selection start
    context.subscriptions.push(vscode.commands.registerCommand("hastati.alignText", () => {
        if (!vscode.window.activeTextEditor) {
            return;
        }

        const editor = vscode.window.activeTextEditor;

        const firstPerLine = [...editor.selections]
            .sort((a, b) => a.start.line - b.start.line || a.start.character - b.start.character)
            .filter((sel, i, arr) => i === 0 || sel.start.line !== arr[i - 1].start.line);

        const maxColumn = firstPerLine.reduce((max, sel) => sel.start.character > max ? sel.start.character : max, 0);

        editor.edit((editBuilder) => firstPerLine.forEach((sel) => {
            if (maxColumn > sel.start.character) {
                editBuilder.insert(sel.start, " ".repeat(maxColumn - sel.start.character));
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
