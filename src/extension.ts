import internal = require("stream");
import * as vscode from "vscode";
import { TextDocumentChangeReason } from "vscode";

// this method is called when extension is activated
// extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "fstring-converter" is now active!');

  vscode.workspace.onDidChangeTextDocument(
    async (e: vscode.TextDocumentChangeEvent) => {
      convertFStringInEditorContext(e);
    }
  );
}

// this method is called when extension is deactivated
export function deactivate() {}

const singleQuote = "'";
const doubleQuote = '"';

interface ActionType {
  actionFSymbol: "add" | "remove";
  quoteIndex: number;
  lineNumber: number;
}

interface InputType {
  lineNumber: number;
  text: string;
  singleCharDeletionIndex: number;
}

interface QuoteRangeType {
  start: number;
  end: number;
  alreadyFString: boolean;
  shouldBeFString: boolean;
}

const convertFStringInEditorContext = async (e: vscode.TextDocumentChangeEvent) => {
  const configuration = vscode.workspace.getConfiguration();
  const enabled = configuration.get<boolean>("fstring-converter.enable");
  const skipEvaluationPostManualDeletionOfF = configuration.get<boolean>(
    "fstring-converter.skipEvaluationPostManualDeletionOfF"
  );
  if (enabled && e.document.languageId === "python") {
    try {
      const changes = e.contentChanges[0];
      if (changes && e.reason !== TextDocumentChangeReason.Undo) {
        if (
          vscode.window.activeTextEditor &&
          vscode.window.activeTextEditor.selections.length > 0
        ) {
          for (const selection of vscode.window.activeTextEditor.selections) {
            const lineNumber = selection.start.line;
            const currentChar = changes.range.start.character;
            if (currentChar >= 0) {
              const maxOffset = changes.text.split(/\r?\n/g).length;
              const lineTexts: InputType[] = [...Array(maxOffset).keys()]
                .reverse()
                .map((offset: number) => {
                  return {
                    lineNumber: lineNumber + offset,
                    text: e.document.lineAt(lineNumber + offset).text,
                    singleCharDeletionIndex:
                      skipEvaluationPostManualDeletionOfF === true &&
                      changes.text === "" &&
                      changes.range.start.character + 1 === changes.range.end.character
                        ? changes.range.start.character
                        : -1,
                  };
                });
              const convertActions = await generateMultiLineConversionActions(
                lineTexts
              );
              await updateEditorContent(convertActions, e.document.uri);
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
};

const generateMultiLineConversionActions = async (
  inputs: InputType[]
): Promise<ActionType[]> => {
  let conversionActions: ActionType[] = [];
  for (let input of inputs) {
    const singleLineConversionActions = await generateSingleLineConversionActions(
      input
    );
    if (singleLineConversionActions.length > 0) {
      conversionActions.push(...singleLineConversionActions);
    }
  }
  return conversionActions;
};

const generateSingleLineConversionActions = async (
  input: InputType
): Promise<ActionType[]> => {
  let conversionActions: ActionType[] = [];
  if (!(await isComment(input.text))) {
    const quoteRanges: QuoteRangeType[] = getQuoteRanges(input.text);
    for (const quoteRange of quoteRanges) {
      if (
        quoteRange.shouldBeFString &&
        !quoteRange.alreadyFString &&
        input.singleCharDeletionIndex !== quoteRange.start
      ) {
        conversionActions.push({
          actionFSymbol: "add",
          quoteIndex: quoteRange.start,
          lineNumber: input.lineNumber,
        });
      } else if (!quoteRange.shouldBeFString && quoteRange.alreadyFString) {
        conversionActions.push({
          actionFSymbol: "remove",
          quoteIndex: quoteRange.start,
          lineNumber: input.lineNumber,
        });
      }
    }
  }
  return conversionActions;
};

const isComment = async (input: string): Promise<boolean> => {
  return input.trim().startsWith("#");
};

export const getQuoteRanges = (input: string): QuoteRangeType[] => {
  let quoteRanges: QuoteRangeType[] = [];
  let length = input.length,
    quoteStartIndex = -1,
    quoteEndIndex = -1,
    lastQuoteUsed: string = "",
    popSuccess = false;
  let quoteStack: { start: number; quoteUsed: string }[] = [];
  for (let index = 0; index < length; index++) {
    const currentChar = input[index];
    if ([singleQuote, doubleQuote].includes(currentChar)) {
      if (quoteStartIndex === -1) {
        quoteStartIndex = index;
        lastQuoteUsed = currentChar;
      } else {
        if (lastQuoteUsed === currentChar && input[index - 1] !== "\\") {
          quoteEndIndex = index;
        } else {
          let squareBracketOpened = false;
          for (let anotherIndex = index - 1; anotherIndex > 0; anotherIndex--) {
            if (input[anotherIndex] === "[") {
              squareBracketOpened = true;
              break;
            } else if (input[anotherIndex] !== " ") {
              break;
            }
          }
          if (squareBracketOpened) {
            quoteStack.push({ start: quoteStartIndex, quoteUsed: lastQuoteUsed });
            quoteStartIndex = index;
            lastQuoteUsed = currentChar;
          }
        }
      }
    }
    if (quoteEndIndex !== -1) {
      const shouldBeFString = isFString(input, quoteStartIndex, quoteEndIndex);
      const alreadyFString = startsWithF(input, quoteStartIndex, quoteEndIndex);
      quoteRanges.push({
        start: quoteStartIndex,
        end: quoteEndIndex,
        shouldBeFString: shouldBeFString,
        alreadyFString: alreadyFString,
      });
      quoteEndIndex = -1;
      if (quoteStack.length > 0) {
        const quoteStackItem = quoteStack.pop();
        if (quoteStackItem === undefined) {
          quoteStartIndex = -1;
          lastQuoteUsed = "";
        } else {
          quoteStartIndex = quoteStackItem.start;
          lastQuoteUsed = quoteStackItem.quoteUsed;
        }
      } else {
        quoteStartIndex = -1;
        lastQuoteUsed = "";
      }
    }
  }
  return quoteRanges.sort((a, b) => b.start - a.start);
};

export const isFString = (input: string, start: number, end: number): boolean => {
  let isFString = false,
    length = input.length,
    openingCurlyBraceIndex = -1,
    closingCurlyBraceIndex = -1;
  for (let index = start; index < length && index <= end; index++) {
    if (input.charAt(index) === "{") {
      openingCurlyBraceIndex = index;
    } else if (openingCurlyBraceIndex > 0 && input.charAt(index) === "}") {
      closingCurlyBraceIndex = index;
      if (
        openingCurlyBraceIndex > 0 &&
        closingCurlyBraceIndex > 0 &&
        closingCurlyBraceIndex - openingCurlyBraceIndex > 1
      ) {
        isFString = true;
        break;
      } else {
        openingCurlyBraceIndex = -1;
      }
    }
  }
  return isFString;
};

const startsWithF = (input: string, start: number, end: number): boolean => {
  let starts = false;
  if (start > 0) {
    starts = input[start - 1] === "f";
  }
  return starts;
};

const updateEditorContent = async (
  convertAction: ActionType[],
  documentUri: vscode.Uri
): Promise<void> => {
  if (convertAction.length > 0) {
    const edit = new vscode.WorkspaceEdit();
    for (const action of convertAction) {
      if (action.actionFSymbol === "add") {
        edit.insert(
          documentUri,
          new vscode.Position(action.lineNumber, action.quoteIndex),
          "f"
        );
      } else if (action.actionFSymbol === "remove") {
        edit.delete(
          documentUri,
          new vscode.Range(
            new vscode.Position(action.lineNumber, action.quoteIndex - 1),
            new vscode.Position(action.lineNumber, action.quoteIndex)
          )
        );
      }
    }
    await vscode.workspace.applyEdit(edit);
  }
};
