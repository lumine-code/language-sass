const path = require("path");

const fixture = (name) => path.join(__dirname, "fixtures", "grammar", name);

describe("Sass family Tree-sitter grammars", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-sass");
  });

  it("selects only the Sass and SCSS Wasm roots", () => {
    const sass = lumine.grammars.grammarForScopeName("source.sass");
    const scss = lumine.grammars.grammarForScopeName("source.css.scss");
    const sassdoc = lumine.grammars.grammarForScopeName("source.sassdoc");

    expect(sass.constructor.name).toBe("TreeSitterGrammar");
    expect(scss.constructor.name).toBe("TreeSitterGrammar");
    expect(sassdoc.constructor.name).toBe("TreeSitterGrammar");
    expect(sass.fileTypes).toEqual(["sass"]);
    expect(scss.fileTypes).toEqual(["scss"]);
    expect(sassdoc.fileTypes).toEqual([]);
  });

  it("passes annotated Sass and SCSS query checks", async () => {
    await runGrammarTests(fixture("test.sass"), /\/\//);
    await runGrammarTests(fixture("test.scss"), /\/\//);
  });

  it("folds and indents an indented Sass rule", async () => {
    const editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.sass"));
    editor.setText(".card\n  color: red\n");
    await editor.languageMode.ready;

    expect(editor.isFoldableAtBufferRow(0)).toBe(true);
    expect(editor.suggestedIndentForBufferRow(1)).toBe(1);
  });

  it("injects SassDoc into SCSS and its example language into SassDoc", async () => {
    const editor = await lumine.workspace.open();
    const text = `/// @param {String} $name - See https://example.com
/// @example scss - Demo
///   .demo { color: red; }
///   .next { width: 0; }
@mixin demo($name) { color: red; }`;
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.css.scss"));
    editor.setText(text);
    await editor.languageMode.ready;

    const scopesAt = (needle, offset = 0) => {
      const index = text.indexOf(needle) + offset;
      const point = editor.getBuffer().positionForCharacterIndex(index);
      return editor.scopeDescriptorForBufferPosition(point).getScopesArray();
    };

    expect(scopesAt("param")).toContain("storage.type.class.sassdoc");
    expect(scopesAt("String")).toContain("entity.name.type.sassdoc");
    expect(scopesAt(".demo", 1)).toContain("entity.other.attribute-name.class.scss");
    expect(scopesAt(".next", 1)).toContain("entity.other.attribute-name.class.scss");
    const examples = editor.languageMode
      .getAllInjectionLayers()
      .filter((layer) => layer.grammar.scopeName === "source.css.scss");
    expect(examples.length).toBe(1);
    expect(examples[0].tree.rootNode.hasError).toBe(false);
  });

  it("combines only SassDoc comments in indented Sass", async () => {
    const editor = await lumine.workspace.open();
    const text = `// ordinary comment
/// @param {Color} $accent - Theme color
/// @return {Color} - Theme color
=theme($accent)
  color: $accent`;
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.sass"));
    editor.setText(text);
    await editor.languageMode.ready;

    const index = text.indexOf("param");
    const point = editor.getBuffer().positionForCharacterIndex(index);
    expect(editor.scopeDescriptorForBufferPosition(point).getScopesArray()).toContain(
      "storage.type.class.sassdoc",
    );
    const layers = editor.languageMode
      .getAllInjectionLayers()
      .filter((layer) => layer.grammar.scopeName === "source.sassdoc");
    expect(layers.length).toBe(1);
    const ranges = layers[0].getCurrentRanges().map((range) => editor.getTextInBufferRange(range));
    expect(ranges.some((text) => text.includes("ordinary comment"))).toBe(false);
    expect(ranges.join("")).toContain("@param");
    expect(ranges.join("")).toContain("@return");
  });
});

describe("Sass injection boundaries", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-sass");
  });

  it("keeps host comments and SassDoc text in disjoint service layers", () => {
    const main = lumine.packages.getActivePackage("language-sass").mainModule;
    const hyperlinkPoints = [];
    const todoPoints = [];
    main.consumeHyperlinkInjection({
      addInjectionPoint(scope, options) {
        hyperlinkPoints.push({ scope, options });
      },
    });
    main.consumeTodoInjection({
      addInjectionPoint(scope, options) {
        todoPoints.push({ scope, options });
      },
    });

    const sassHyperlink = hyperlinkPoints.find(
      ({ scope, options }) =>
        scope === "source.sass" && options.types.includes("single_line_comment"),
    );
    const sassTodo = todoPoints.find(({ scope }) => scope === "source.sass");
    expect(sassHyperlink.options.language({ text: "/// docs" })).toBeNull();
    expect(sassTodo.options.language({ text: "/// docs" })).toBeNull();
    expect(sassHyperlink.options.language({ text: "// https://example.com" })).toBeUndefined();
    expect(sassTodo.options.language({ text: "// TODO" })).toBeUndefined();

    expect(hyperlinkPoints.find(({ scope }) => scope === "source.sassdoc").options.types).toEqual([
      "description",
      "line_description",
      "link_caption",
      "url",
    ]);
    expect(todoPoints.find(({ scope }) => scope === "source.sassdoc").options.types).toEqual([
      "description",
      "line_description",
      "link_caption",
    ]);
  });
});
