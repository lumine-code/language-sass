describe("SCSS structural folds", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-sass");
    editor = await lumine.workspace.open("folds.scss");
  });
  afterEach(() => editor.destroy());

  for (const source of [
    "@mixin panel {\ncolor: red;\nwidth: 1px;\n}",
    "$options: (\ncolor: red,\nwidth: 1px\n);",
    "/* multi-line\ncomment body\nlast line */",
  ]) {
    it(`folds an unindented ${source.split("\n")[0]}`, async () => {
      editor.setText(source);
      expect(await editor.whenGrammarSettled()).toBe(true);
      expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
      expect(editor.isFoldableAtBufferRow(0)).toBe(true);
    });
  }
});
