import * as assert from 'assert';
import * as vscode from 'vscode';

async function withEditor(content: string, run: (editor: vscode.TextEditor) => Promise<void>): Promise<void> {
	const doc = await vscode.workspace.openTextDocument({ content, language: 'plaintext' });
	const editor = await vscode.window.showTextDocument(doc);
	try {
		await run(editor);
	} finally {
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	}
}

suite('hastati.alignText', () => {
	suiteSetup(async () => {
		await vscode.extensions.getExtension('rgiordani.hastati')?.activate();
	});

	test('aligns selections on different lines to the rightmost column', async () => {
		await withEditor('abc\nde\nf', async (editor) => {
			editor.selections = [
				new vscode.Selection(0, 2, 0, 2),
				new vscode.Selection(1, 1, 1, 1),
				new vscode.Selection(2, 0, 2, 0),
			];
			await vscode.commands.executeCommand('hastati.alignText');
			assert.strictEqual(editor.document.getText(), 'abc\nd e\n  f');
		});
	});

	test('uses the leftmost selection per line when multiple exist on the same line', async () => {
		await withEditor('abcdef\ngh', async (editor) => {
			editor.selections = [
				new vscode.Selection(0, 4, 0, 4),
				new vscode.Selection(0, 1, 0, 1),
				new vscode.Selection(1, 2, 1, 2),
			];
			await vscode.commands.executeCommand('hastati.alignText');
			assert.strictEqual(editor.document.getText(), 'a bcdef\ngh');
		});
	});

	test('does nothing when all first selections are already at the same column', async () => {
		await withEditor('ab\ncd', async (editor) => {
			editor.selections = [
				new vscode.Selection(0, 1, 0, 1),
				new vscode.Selection(1, 1, 1, 1),
			];
			await vscode.commands.executeCommand('hastati.alignText');
			assert.strictEqual(editor.document.getText(), 'ab\ncd');
		});
	});

	test('does nothing with a single selection', async () => {
		await withEditor('abc', async (editor) => {
			editor.selections = [new vscode.Selection(0, 2, 0, 2)];
			await vscode.commands.executeCommand('hastati.alignText');
			assert.strictEqual(editor.document.getText(), 'abc');
		});
	});
});

suite('hastati.alignCursors', () => {
	suiteSetup(async () => {
		await vscode.extensions.getExtension('rgiordani.hastati')?.activate();
	});

	test('moves all cursors to the leftmost column', async () => {
		await withEditor('abc\nde', async (editor) => {
			editor.selections = [
				new vscode.Selection(0, 3, 0, 3),
				new vscode.Selection(1, 1, 1, 1),
			];
			await vscode.commands.executeCommand('hastati.alignCursors');
			assert.strictEqual(editor.document.getText(), 'abc\nde');
			const columns = editor.selections.map(s => s.active.character).sort((a, b) => a - b);
			assert.deepStrictEqual(columns, [1, 1]);
		});
	});

	test('does nothing when all cursors are already at the same column', async () => {
		await withEditor('abc\nde', async (editor) => {
			editor.selections = [
				new vscode.Selection(0, 2, 0, 2),
				new vscode.Selection(1, 2, 1, 2),
			];
			await vscode.commands.executeCommand('hastati.alignCursors');
			assert.strictEqual(editor.document.getText(), 'abc\nde');
			const columns = editor.selections.map(s => s.active.character).sort((a, b) => a - b);
			assert.deepStrictEqual(columns, [2, 2]);
		});
	});

	test('does not modify text', async () => {
		await withEditor('abc\ndefgh\nij', async (editor) => {
			editor.selections = [
				new vscode.Selection(0, 3, 0, 3),
				new vscode.Selection(1, 5, 1, 5),
				new vscode.Selection(2, 1, 2, 1),
			];
			await vscode.commands.executeCommand('hastati.alignCursors');
			assert.strictEqual(editor.document.getText(), 'abc\ndefgh\nij');
			const columns = editor.selections.map(s => s.active.character).sort((a, b) => a - b);
			assert.deepStrictEqual(columns, [1, 1, 1]);
		});
	});
});
