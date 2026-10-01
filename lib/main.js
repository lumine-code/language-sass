const SCSS_SCOPE = "source.css.scss";
const SASS_SCOPE = "source.sass";
const SASSDOC_SCOPE = "source.sassdoc";

const isSassDocLine = (node) => node.text.startsWith("///");

function addStylesheetHyperlinks(hyperlink, scope, { guardSassDoc = false } = {}) {
  return [
    hyperlink.addInjectionPoint(scope, {
      types: ["comment", "single_line_comment", "string_value"],
      language(node) {
        if (guardSassDoc && isSassDocLine(node)) return null;
      },
    }),
    hyperlink.addInjectionPoint(scope, {
      types: ["call_expression"],
      language: () => "hyperlink",
      content(node) {
        const functionName = node.descendantsOfType("function_name")[0]?.text;
        if (functionName?.toLowerCase() !== "url") return null;
        return node.descendantsOfType("plain_value");
      },
    }),
  ];
}

exports.consumeHyperlinkInjection = (hyperlink) => {
  const registrations = [
    ...addStylesheetHyperlinks(hyperlink, SCSS_SCOPE),
    ...addStylesheetHyperlinks(hyperlink, SASS_SCOPE, { guardSassDoc: true }),
    hyperlink.addInjectionPoint(SASSDOC_SCOPE, {
      types: ["description", "line_description", "link_caption", "url"],
    }),
  ];
  return disposeRegistrations(registrations);
};

exports.consumeTodoInjection = (todo) => {
  return disposeRegistrations([
    todo.addInjectionPoint(SCSS_SCOPE, {
      types: ["comment", "single_line_comment"],
    }),
    todo.addInjectionPoint(SASS_SCOPE, {
      types: ["comment", "single_line_comment"],
      language(node) {
        if (isSassDocLine(node)) return null;
      },
    }),
    todo.addInjectionPoint(SASSDOC_SCOPE, {
      types: ["description", "line_description", "link_caption"],
    }),
  ]);
};

function disposeRegistrations(registrations) {
  return {
    dispose() {
      for (const registration of registrations.splice(0)) registration.dispose();
    },
  };
}
