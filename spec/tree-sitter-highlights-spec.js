const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "scss-highlights.scm");

describe("SCSS Tree-sitter highlights", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-sass");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor = await lumine.workspace.open("highlights.scss");
    editor.setText(text);
    await editor.getBuffer().languageMode.ready;
  }

  function rawCaptures(startRow, endRow) {
    const layer = editor.getBuffer().languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  it("preserves argument, variable, URL, and mixin-parameter scopes", async () => {
    const source = `@mixin generated($first, $second) {}
a {
  color: var(--accent, red);
  background: url(asset.png);
}`;
    await setUp(source);

    const scopesAt = (needle, occurrence = 0, offset = 0) => {
      let index = -1;
      for (let count = 0; count <= occurrence; count++) {
        index = source.indexOf(needle, index + 1);
      }
      const point = editor.getBuffer().positionForCharacterIndex(index + offset);
      return editor.scopeDescriptorForBufferPosition(point).getScopesArray();
    };

    expect(scopesAt("generated(", 0, "generated".length)).toContain(
      "punctuation.definition.parameters.begin.brace.round.scss",
    );
    expect(scopesAt(") {}")).toContain("punctuation.definition.parameters.end.brace.round.scss");
    expect(scopesAt("var")).toContain("support.function.var.css.scss");
    expect(scopesAt("--accent")).toContain("variable.css.scss");
    expect(scopesAt("red")).toContain("variable.css.scss");
    expect(scopesAt("asset.png")).toContain("string.unquoted.scss");
    expect(scopesAt("var(", 0, 3)).toContain(
      "punctuation.definition.arguments.begin.bracket.round.scss",
    );
    expect(scopesAt("red)", 0, 3)).toContain(
      "punctuation.definition.arguments.end.bracket.round.scss",
    );
  });

  it("keeps large argument and parameter parents leaf-rooted with local tile captures", async () => {
    const argumentsSource = ["a {", "  color: fn("];
    for (let index = 0; index < 6000; index++) {
      argumentsSource.push(`    value${index}${index < 5999 ? "," : ""}`);
    }
    argumentsSource.push("  );", "}");
    await setUp(argumentsSource.join("\r\n"));

    let captures = rawCaptures(3000, 3006);
    let localCaptures = captures.filter((capture) => capture.node.startPosition.row >= 3000);
    expect(captures.length).toBeLessThanOrEqual(24);
    expect(localCaptures.length).toBe(18);
    expect(localCaptures.every((capture) => capture.node.startPosition.row < 3006)).toBe(true);

    const parametersSource = ["@mixin generated("];
    for (let index = 0; index < 6000; index++) {
      parametersSource.push(`  $value${index}${index < 5999 ? "," : ""}`);
    }
    parametersSource.push(") {}");
    editor.setText(parametersSource.join("\r\n"));
    await editor.getBuffer().languageMode.atTransactionEnd();

    captures = rawCaptures(3000, 3006);
    expect(captures.length).toBeLessThanOrEqual(16);
    expect(
      captures.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).toContain("(#is? test.childOfType arguments)");
    expect(query).toContain('(#is? test.textAt "parent.previousNamedSibling var")');
    expect(query).toContain('(#is? test.textAt "parent.previousNamedSibling url")');
    expect(query).toContain("(#is? test.childOfType parameters)");
    expect(query).not.toMatch(/\(arguments\s+"\("/);
    expect(query).not.toMatch(/\(parameters\s+"\("/);
  });
});
