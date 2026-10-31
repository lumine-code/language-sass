const path = require("node:path");

describe("Sass editing pairs", () => {
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    const pack = await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    await pack.resourceLoadPromise;
    await lumine.packages.activatePackage("bracket-matcher");
    editor = await lumine.workspace.open();
    editor.update({ autoIndent: false });
  });

  afterEach(() => editor?.destroy());

  it("pairs stylesheet syntax without adding backticks or prose smart quotes", async () => {
    for (const scope of ["source.sass", "source.css.scss"]) {
      editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
      for (const [typed, expected] of [
        ["(", "()"],
        ["[", "[]"],
        ["{", "{}"],
        ['"', '""'],
        ["'", "''"],
        ["`", "`"],
        ["“", "“"],
      ]) {
        editor.setText("");
        expect(await editor.whenGrammarSettled()).toBe(true);
        editor.setCursorBufferPosition([0, 0]);
        await editor.insertText(typed);
        await editor.whenGrammarSettled();
        expect(editor.getText())
          .withContext(scope + typed)
          .toBe(expected);
      }
    }
  });
});
