const fs = require("node:fs");
const path = require("node:path");

describe("Stylesheet structural snippets", () => {
  let editor, service, packagePath, lease;

  beforeEach(async () => {
    for (const method of ["openExternal", "openPath", "showItemInFolder", "openApplication"])
      spyOn(lumine.shell, method).and.returnValue(Promise.resolve());
    spyOn(lumine.application, "openWindow").and.returnValue(Promise.resolve());
    spyOn(lumine.clipboard, "read").and.returnValue(Promise.resolve(""));
    packagePath = (await lumine.packages.activatePackage("language-sass")).path;
    lease = lumine.packages.serviceHub.consume("snippets", "^1.0.0", (provider) => {
      service = provider;
    });
    const main = (await lumine.packages.activatePackage("snippets")).mainModule;
    await main.waitForSnippetsLoaded();
    editor = await lumine.workspace.open();
  });

  afterEach(() => {
    editor?.destroy();
    lease?.dispose();
    editor = service = packagePath = lease = null;
  });

  async function expand(file, scope, name) {
    editor.setText("");
    editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
    await editor.languageMode.ready;
    const data = JSON.parse(fs.readFileSync(path.join(packagePath, "snippets", file), "utf8"));
    await service.insertSnippet(data[`.${scope}`][name].body, editor);
    await editor.languageMode.atTransactionEnd();
  }

  it("inserts an ordinary SCSS important suffix with no stray characters or placeholder text", async () => {
    await expand("scss.json", "source.css.scss", "!important");
    expect(editor.getText()).toBe("!important;");
  });

  it("declares a SCSS function when the function snippet is expanded", async () => {
    for (const file of ["scss.json", "language-sass.json"]) {
      await expand(file, "source.css.scss", "@function");
      expect(editor.getText()).toContain("@function name");
      expect(editor.languageMode.tree.rootNode.descendantsOfType("function_statement").length).toBe(
        1,
      );
      expect(editor.languageMode.tree.rootNode.hasError).withContext(file).toBe(false);
    }
  });

  it("uses indentation for Sass mixins and functions", async () => {
    for (const name of ["@mixin", "@function"]) {
      await expand("language-sass.json", "source.sass", name);
      if (name === "@mixin") {
        lumine.commands.dispatch(editor.getElement(), "snippets:next-tab-stop");
        editor.insertText("color: red\n");
        await editor.languageMode.atTransactionEnd();
      }
      expect(editor.getText()).not.toContain("{");
      expect(editor.getText()).not.toContain("}");
      expect(editor.languageMode.tree.rootNode.hasError)
        .withContext(`${name}: ${editor.getText()}`)
        .toBe(false);
    }
  });

  it("preserves an ordinary SCSS mixin scaffold", async () => {
    await expand("language-sass.json", "source.css.scss", "@mixin");
    expect(editor.getText()).toContain("@mixin name {");
    expect(editor.languageMode.tree.rootNode.descendantsOfType("mixin_statement").length).toBe(1);
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
  });
});
