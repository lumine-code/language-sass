const fs = require("node:fs");
const path = require("node:path");

describe("SCSS built-in completion snippets", () => {
  let editor, service, lease, suggestions, packagePath;

  beforeEach(async () => {
    jasmine.useRealClock();
    for (const method of ["openExternal", "openPath", "showItemInFolder", "openApplication"])
      spyOn(lumine.shell, method).and.resolveTo();
    spyOn(lumine.application, "openWindow").and.resolveTo();
    spyOn(lumine.clipboard, "read").and.resolveTo("");
    const pack = await lumine.packages.activatePackage("language-sass");
    packagePath = pack.path;
    await pack.resourceLoadPromise;
    lease = lumine.packages.serviceHub.consume("snippets", "^1.0.0", (provider) => {
      service = provider;
    });
    const main = (await lumine.packages.activatePackage("snippets")).mainModule;
    await main.waitForSnippetsLoaded();
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.css.scss"));
    await editor.languageMode.ready;
    const settings = JSON.parse(
      fs.readFileSync(path.join(pack.path, "settings/main.json"), "utf8"),
    );
    suggestions =
      settings[".source.css.scss .meta.property-value"].autocomplete.symbols.builtins.suggestions;
  });

  afterEach(() => {
    editor?.destroy();
    lease?.dispose();
    editor = service = lease = suggestions = packagePath = null;
  });

  async function expand(name) {
    const suggestion = suggestions.find((item) => item.snippet.startsWith(`${name}(`));
    expect(suggestion).toBeDefined();
    await service.insertSnippet(suggestion.snippet, editor);
  }

  it("offers separate red, green and blue arguments in rgba", async () => {
    await expand("rgba");
    expect(editor.getText()).toBe("rgba($red, $green, $blue, $alpha);");
  });

  it("keeps the nth argument independent of the statement terminator", async () => {
    await expand("nth");
    lumine.commands.dispatch(editor.getElement(), "snippets:next-tab-stop");
    expect(editor.getSelectedText()).toBe("$n");
    editor.insertText("2");
    expect(editor.getText()).toBe("nth($list, 2);");
  });

  it("expands ordinary rgb argument defaults without dropping their names", async () => {
    await expand("rgb");
    expect(editor.getText()).toBe("rgb($red, $green, $blue);");
  });

  it("preserves the existing SCSS mixin scaffold", async () => {
    const data = JSON.parse(fs.readFileSync(path.join(packagePath, "snippets/scss.json"), "utf8"));
    await service.insertSnippet(data[".source.css.scss"]["@mixin"].body, editor);
    expect(editor.getText()).toBe("@mixin name() {\n  \n}");
  });
});
