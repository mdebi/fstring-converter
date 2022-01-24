import { withTempRandomPyFileEditor } from "./testUtils";
import * as assert from "assert";
import * as fstringConverterExtension from "../../extension";

suite("fstring-converter Extension Test Suite", () => {
  const doubleQuote = '"',
    singleQuote = "'",
    testData = [singleQuote, doubleQuote];
  testData.forEach((quote) => {
    const otherQuote = quote === singleQuote ? doubleQuote : singleQuote;
    let initialContent = "";
    let testString = "";

    // Tests for empty strings - should not return f-string
    test(`${quote}${quote} -> ${quote}${quote}`, () => {
      const data = {
        snippet: `${quote}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `${quote}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`f${quote}${quote} -> ${quote}${quote}`, () => {
      const data = {
        snippet: `f${quote}${quote}`,
        positionStart: 0,
        positionLength: 3,
        expectedContent: `${quote}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = ${quote}${quote} -> a = ${quote}${quote}`, () => {
      const data = {
        snippet: `a = ${quote}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = ${quote}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = f${quote}${quote} -> a = ${quote}${quote}`, () => {
      const data = {
        snippet: `a = f${quote}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = ${quote}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    // Tests for strings having only {} in it - should not return f-string
    test(`${quote}{}${quote} -> ${quote}{}${quote}`, () => {
      const data = {
        snippet: `${quote}{}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `${quote}{}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`f${quote}{}${quote} -> ${quote}{}${quote}`, () => {
      const data = {
        snippet: `f${quote}{}${quote}`,
        positionStart: 0,
        positionLength: 3,
        expectedContent: `${quote}{}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = ${quote}{}${quote} -> a = ${quote}{}${quote}`, () => {
      const data = {
        snippet: `a = ${quote}{}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = ${quote}{}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = f${quote}{}${quote} -> a = ${quote}{}${quote}`, () => {
      const data = {
        snippet: `a = f${quote}{}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = ${quote}{}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    // Tests for strings having {var} in it - should return f-string
    testString = "{abc}";
    test(`${quote}${testString}${quote} -> f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`f${quote}${testString}${quote} -> f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `f${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 3,
        expectedContent: `f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = ${quote}${testString}${quote} -> a = f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `a = ${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = f${quote}${testString}${quote} -> a = ${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `a = f${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    // Tests for strings having multiple {var} in it - should return f-string
    testString = "test {abc} test2 {def}";
    test(`${quote}${testString}${quote} -> f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`f${quote}${testString}${quote} -> f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `f${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 3,
        expectedContent: `f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = ${quote}${testString}${quote} -> a = f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `a = ${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = f${quote}${testString}${quote} -> a = ${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `a = f${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    // Tests for strings having multiple {var} in it - should return f-string
    testString = "test {} test2 {def} test3 {}";
    test(`${quote}${testString}${quote} -> f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`f${quote}${testString}${quote} -> f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `f${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 3,
        expectedContent: `f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = ${quote}${testString}${quote} -> a = f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `a = ${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test(`a = f${quote}${testString}${quote} -> a = f${quote}${testString}${quote}`, () => {
      const data = {
        snippet: `a = f${quote}${testString}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = f${quote}${testString}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test("Multi line paste", () => {
      const data = {
        snippet: `height = 2
base = 3
fstring = ${quote}The area of the triangle is {base*height/2}.${quote}
print(fstring)`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `height = 2
base = 3
fstring = f${quote}The area of the triangle is {base*height/2}.${quote}
print(fstring)`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    const testLines = [
      `${quote}${quote}`,
      `f${quote}${quote}`,
      `${quote}{}${quote}`,
      `f${quote}${quote}`,
      `${quote}abc${quote}`,
      `f${quote}abc${quote}`,
      `a = ${quote}${quote}`,
      `a = f${quote}${quote}`,
      `a = ${quote}{}${quote}`,
      `a = f${quote}{}${quote}`,
      `a = ${quote}{abc}${quote}`,
      `a = ${quote}{abc}${quote}`,
    ];
    testLines.forEach((testLineData) => {
      test(`Do not edit comment - ${testLineData}`, () => {
        const data = {
          snippet: `# ${testLineData}`,
          positionStart: 0,
          positionLength: 2,
          expectedContent: `# ${testLineData}`,
        };
        return withTempRandomPyFileEditor(initialContent, data);
      });

      test(`Do not edit comment with leading space - ${testLineData}`, () => {
        const data = {
          snippet: `   # ${testLineData}`,
          positionStart: 0,
          positionLength: 2,
          expectedContent: `   # ${testLineData}`,
        };
        return withTempRandomPyFileEditor(initialContent, data);
      });
    });

    test("Multiple edits in same line - list", () => {
      const data = {
        snippet: `a = [${quote}{a}${quote}, ${quote}{a}${quote}, f${quote}{a}${quote}, f${quote}${quote}]`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `a = [f${quote}{a}${quote}, f${quote}{a}${quote}, f${quote}{a}${quote}, ${quote}${quote}]`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test("Multiple edits in same line - + op", () => {
      const data = {
        snippet: `${quote}${quote} + ${quote}{a}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `${quote}${quote} + f${quote}{a}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test("f-string within f-string", () => {
      const data = {
        snippet: `${quote}{a[${otherQuote}{xyz}${otherQuote}]}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `f${quote}{a[f${otherQuote}{xyz}${otherQuote}]}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test("string and another fstring", () => {
      const data = {
        snippet: `f${quote}{a[f${quote}{xyz}${quote}]}${quote}`,
        positionStart: 0,
        positionLength: 2,
        expectedContent: `${quote}{a[f${quote}{xyz}${quote}]}${quote}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });

    test("space between f and quote - undo helps for this mostly typo scenario", () => {
      const data = {
        snippet: " ",
        positionStart: 0,
        positionLength: 1,
        expectedContent: `f f${quote}{a}${quote}`,
      };
      return withTempRandomPyFileEditor(`f${quote}{a}${quote}`, data);
    });

    test(`dict not a f string - {${quote}a${quote}: 1}`, () => {
      const data = {
        snippet: `{${quote}a${quote}: 1}`,
        positionStart: 1,
        positionLength: 1,
        expectedContent: `{${quote}a${quote}: 1}`,
      };
      return withTempRandomPyFileEditor(initialContent, data);
    });
  });
});

suite("isFString validation", () => {
  const testData: [string, boolean][] = [
    ["''", false],
    ["f''", false],
    ['""', false],
    ['f""', false],
    ['"', false],
    ['"{}"', false],
    ['"{abc}"', true],
    ['"{abc} {def}"', true],
    ['"{} {def}"', true],
    ['"{} {def} {}"', true],
    ['"{} {def} {} g"', true],
    ['"{} {def} {g} g"', true],
    ['"g {} {def} {g} g"', true],
    ['"{}{}{}"', false],
  ];
  testData.forEach((dataItem) => {
    test(`check ${dataItem}`, () => {
      assert.strictEqual(
        fstringConverterExtension.isFString(dataItem[0], 0, dataItem[0].length),
        dataItem[1]
      );
    });
  });

  test("check1 \"'' f'{a}'\"", () => {
    assert.strictEqual(fstringConverterExtension.isFString("'' f'{a}'", 0, 1), false);
  });

  test("check2 \"'' f'{a}'\"", () => {
    assert.strictEqual(fstringConverterExtension.isFString("'' f'{a}'", 5, 8), true);
  });

  test("check3 \"'' f'{a}'\"", () => {
    assert.strictEqual(fstringConverterExtension.isFString("'' f'{a}'", 4, 8), true);
  });

  test("check4 \"'' f'{a}'\"", () => {
    assert.strictEqual(fstringConverterExtension.isFString("'' f'{a}'", 2, 8), true);
  });
});

suite("getQuoteRanges validation", () => {
  const doubleQuote = '"',
    singleQuote = "'",
    testData = [singleQuote, doubleQuote];
  testData.forEach((quote) => {
    const otherQuote = quote === singleQuote ? doubleQuote : singleQuote;
    const testData = [
      ["", []],
      [`${quote}${quote}`, [[0, 1, false, false]]],
      [`${quote}{}${quote}`, [[0, 3, false, false]]],
      [
        `${quote}${quote} + ${quote}${quote}`,
        [
          [5, 6, false, false],
          [0, 1, false, false],
        ],
      ],
      [
        `${quote}${quote} + f${quote}${quote}`,
        [
          [6, 7, true, false],
          [0, 1, false, false],
        ],
      ],
      [
        `{${quote}a${quote}: {${quote}a${quote}}`,
        [
          [7, 9, false, false],
          [1, 3, false, false],
        ],
      ],
      [
        `[${quote}${quote}, f${quote}${quote}, {f${quote}{abc}${quote}: ${quote}xhz${quote}}]`,
        [
          [21, 25, false, false],
          [12, 18, true, true],
          [6, 7, true, false],
          [1, 2, false, false],
        ],
      ],
      [
        `${quote}{a[${otherQuote}{xyz}${otherQuote}]}${quote}`,
        [
          [4, 10, false, true],
          [0, 13, false, true],
        ],
      ],
      [
        `${quote}{a[${otherQuote}{xyz}${otherQuote}]}${quote} + ${quote}{a[${otherQuote}{xyz}${otherQuote}]}${quote}`,
        [
          [21, 27, false, true],
          [17, 30, false, true],
          [4, 10, false, true],
          [0, 13, false, true],
        ],
      ],
      [`${quote}a ${otherQuote}{b}${otherQuote}${quote}`, [[0, 8, false, true]]],
      [
        `${quote}a ${otherQuote}{b}${otherQuote}${quote} + ${quote}a ${otherQuote}{b}${otherQuote}${quote} + ${quote}a${otherQuote}{b}${otherQuote}${quote} + ${quote}a[${otherQuote}{b}${otherQuote}]${quote}`,
        [
          [38, 42, false, true],
          [35, 44, false, true],
          [24, 31, false, true],
          [12, 20, false, true],
          [0, 8, false, true],
        ],
      ],
    ];
    testData.forEach((testDataItem) => {
      test(`${testDataItem}`, () => {
        let expected = [];
        for (const item of testDataItem[1]) {
          expected.push({
            start: item[0],
            end: item[1],
            alreadyFString: item[2],
            shouldBeFString: item[3],
          });
        }
        assert.deepStrictEqual(
          fstringConverterExtension.getQuoteRanges(`${testDataItem[0]}`),
          expected
        );
      });
    });
  });
});
