import { join } from "path";
import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import internal = require("stream");
import * as assert from "assert";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deleteFile(file: vscode.Uri): Thenable<boolean> {
  return new Promise((resolve, reject) => {
    fs.unlink(file.fsPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function rndName() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 10);
}

export function createRandomFile(
  contents = "",
  fileExtension = "txt"
): Thenable<vscode.Uri> {
  return new Promise((resolve, reject) => {
    const tmpFile = join(os.tmpdir(), rndName() + "." + fileExtension);

    fs.writeFile(tmpFile, contents, (error) => {
      if (error) {
        return reject(error);
      }

      resolve(vscode.Uri.file(tmpFile));
    });
  });
}

export function withRandomFileEditor(
  initialContents: string,
  fileExtension: string = "py",
  run: (editor: vscode.TextEditor, doc: vscode.TextDocument) => Thenable<void>
): Thenable<boolean> {
  return createRandomFile(initialContents, fileExtension).then((file) => {
    return vscode.workspace.openTextDocument(file).then((doc) => {
      return vscode.window.showTextDocument(doc).then((editor) => {
        return run(editor, doc).then((_) => {
          if (doc.isDirty) {
            return doc.save().then(() => {
              return deleteFile(file);
            });
          } else {
            return deleteFile(file);
          }
        });
      });
    });
  });
}

export function withTempRandomPyFileEditor(
  initialContents: string,
  data: {
    snippet: string;
    positionStart: number;
    positionLength: number;
    expectedContent: string;
  }
): Thenable<boolean> {
  return withRandomFileEditor(initialContents, "py", async (editor, doc) => {
    await delay(500);
    await editor.insertSnippet(
      new vscode.SnippetString(data.snippet),
      new vscode.Position(data.positionStart, data.positionLength)
    );
    await delay(1000);
    assert.strictEqual(doc.getText(), data.expectedContent);
  });
}
