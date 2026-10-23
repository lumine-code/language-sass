describe("SCSS parenthesized indentation", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-sass");
    editor = await lumine.workspace.open("parentheses.scss");
    editor.setTabLength(2);
  });

  afterEach(() => editor.destroy());

  for (const source of [
    "$options: (\ncolor: red,\nsize: large\n);",
    "$sizes: (\nsmall,\nlarge\n);",
    "@mixin demo(\n$first,\n$second\n) {}",
    ".card {\ncolor: mix(\nred,\nblue\n);\n}",
  ]) {
    it(`indents and closes the multiline group in ${source.split("\n")[0]}`, async () => {
      editor.setText(source);
      expect(await editor.whenGrammarSettled()).toBe(true);
      expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
      const groupRow = source.startsWith(".card") ? 1 : 0;
      expect(editor.suggestedIndentForBufferRow(groupRow + 1)).toBe(1);
      await editor.autoIndentBufferRows(0, editor.getLineCount() - 1);
      const depth = groupRow + 1;
      expect(editor.indentationForBufferRow(groupRow + 1)).toBe(depth);
      expect(editor.indentationForBufferRow(groupRow + 2)).toBe(depth);
      expect(editor.indentationForBufferRow(groupRow + 3)).toBe(groupRow);
    });
  }
});
