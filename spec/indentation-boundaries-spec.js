describe("language-sass indentation boundaries", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-sass");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.css.scss"));
    editor.update({ tabLength: 4, softTabs: true });
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  it("preserves an open block after interpolation", async () => {
    editor.setText(".a { color: #{$value};\n}");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([0, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(1)).toBe(" ".repeat(4));
    expect(editor.getCursorBufferPosition().column).toBe(4);
  });

  it("still indents block braces", async () => {
    editor.setText(".a {\n}");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([0, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(1)).toBe(" ".repeat(4));
    expect(editor.getCursorBufferPosition().column).toBe(4);
  });
});
