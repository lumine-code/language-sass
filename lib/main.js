const SCSS_SCOPE = "source.css.scss";
const SASS_SCOPE = "source.sass";
const SASSDOC_SCOPE = "source.sassdoc";

const isSassDocLine = (node) => node.text.startsWith("///");
const sassDocLines = (node) => node.descendantsOfType("single_line_comment").filter(isSassDocLine);

exports.activate = function () {
  // SCSS gives a consecutive run of `///` comments a dedicated node, so its
  // SassDoc layer is both contiguous and incremental.
  lumine.grammars.addInjectionPoint(SCSS_SCOPE, {
    type: "sassdoc_block",
    language: () => "sassdoc",
    content: (node) => node,
    includeChildren: true,
    languageScope: null,
  });

  // The indented-Sass parser exposes `///` as ordinary line comments. Combine
  // only those leaves at the stylesheet level so multi-line tags and examples
  // still reach SassDoc as one logical document.
  lumine.grammars.addInjectionPoint(SASS_SCOPE, {
    type: "stylesheet",
    language: (node) => (sassDocLines(node).length ? "sassdoc" : null),
    content: sassDocLines,
    newlinesBetween: true,
    languageScope: null,
  });

  // `@example scss`, `@example css`, and similar blocks are resolved through
  // the same exact Tree-sitter injection-name table as every other embedding.
  lumine.grammars.addInjectionPoint(SASSDOC_SCOPE, {
    type: "tag_example",
    language(node) {
      return node.descendantsOfType("example_language")[0]?.text.toLowerCase() ?? null;
    },
    content: (node) => node.descendantsOfType("code_line"),
    newlinesBetween: true,
  });
};

function addStylesheetHyperlinks(hyperlink, scope, { guardSassDoc = false } = {}) {
  hyperlink.addInjectionPoint(scope, {
    types: ["comment", "single_line_comment", "string_value"],
    language(node) {
      if (guardSassDoc && isSassDocLine(node)) return null;
    },
  });

  hyperlink.addInjectionPoint(scope, {
    types: ["call_expression"],
    language: () => "hyperlink",
    content(node) {
      const functionName = node.descendantsOfType("function_name")[0]?.text;
      if (functionName?.toLowerCase() !== "url") return null;
      return node.descendantsOfType("plain_value");
    },
  });
}

exports.consumeHyperlinkInjection = (hyperlink) => {
  addStylesheetHyperlinks(hyperlink, SCSS_SCOPE);
  addStylesheetHyperlinks(hyperlink, SASS_SCOPE, { guardSassDoc: true });
  hyperlink.addInjectionPoint(SASSDOC_SCOPE, {
    types: ["description", "line_description", "link_caption", "url"],
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint(SCSS_SCOPE, {
    types: ["comment", "single_line_comment"],
  });
  todo.addInjectionPoint(SASS_SCOPE, {
    types: ["comment", "single_line_comment"],
    language(node) {
      if (isSassDocLine(node)) return null;
    },
  });
  todo.addInjectionPoint(SASSDOC_SCOPE, {
    types: ["description", "line_description", "link_caption"],
  });
};
