const registrations = [];

exports.activate = function () {
  // Recovery and nested values require all plain_value descendants of one
  // url() call. A structural query cannot express this arbitrary-depth group.
  for (const scopeName of ["source.css.scss", "source.sass"]) {
    registrations.push(
      lumine.grammars.addInjectionPoint(scopeName, {
        type: "call_expression",
        language: () => "hyperlink",
        content(node) {
          const functionName = node.descendantsOfType("function_name")[0]?.text;
          if (functionName?.toLowerCase() !== "url") return null;
          return node.descendantsOfType("plain_value");
        },
        languageScope: null,
      }),
    );
  }
};

exports.deactivate = function () {
  for (const registration of registrations.splice(0)) registration.dispose();
};
