const path = require("node:path");

describe("language-sass conservative indentation", () => {
  let editor;

  beforeEach(async () => {
    const pack = await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    for (const grammar of pack.grammars) {
      if (grammar.queryPaths?.indentsQuery) await grammar.getQuery("indentsQuery");
    }
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.sass"));
    editor.update({ tabLength: 2, softTabs: true });
  });

  afterEach(() => editor?.destroy());

  async function setText(source) {
    editor.setText(source);
    expect(await editor.whenGrammarSettled()).toBe(true);
  }

  async function enter(source, expected, row = 0) {
    await setText(source);
    editor.setCursorBufferPosition([row, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(row + 1))
      .withContext(source)
      .toBe(" ".repeat(expected));
    expect(editor.getCursorBufferPosition().column).withContext(source).toBe(expected);
  }

  it("does not guess a block after mixin calls or unknown directives", async () => {
    for (const source of [
      "@include reset",
      "@include reset()",
      "+reset",
      "@extend .base",
      "@use 'base'",
      "@layer reset, base",
      "@custom value",
    ])
      await enter(source, 0);
  });

  it("still indents selectors and definite control-flow headers", async () => {
    for (const source of [".card", "@if $ready", "@mixin reset", "@function size($value)"])
      await enter(source, 2);
  });

  it("preserves existing Sass block boundaries during explicit reindent", async () => {
    const source = ".card\n  color: red\n.other\n  color: blue\n  @include reset\n  margin: 0\n";
    await setText(source);
    await editor.autoIndentBufferRows(0, editor.getLastBufferRow());
    expect(editor.getText()).toBe(source);
  });

  it("keeps indented one-line mixin operations at the current level", async () => {
    await enter(".card\n  @include reset", 2, 1);
  });

  it("continues to indent SCSS delimiters and preserves its comment content", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.css.scss"));
    await enter(".card {", 2);
    await enter(".card { color: red; }", 0);
    await setText(".card {\n  /* head\n       aligned\n  */\n}");
    await editor.autoIndentBufferRows(0, 4);
    expect(editor.lineTextForBufferRow(2)).toBe("       aligned");
  });
});
