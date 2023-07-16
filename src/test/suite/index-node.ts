import * as path from "path";
import * as Mocha from "mocha";
import { glob, globSync, globStream, globStreamSync, Glob } from "glob";

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise(async (c, e) => {
    const allTestFiles = await glob("**/**.test.js", { cwd: testsRoot });

    // Add files to the test suite
    allTestFiles.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

    try {
      // Run the mocha test
      mocha.run((failures) => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error(err);
      e(err);
    }
  });
}
