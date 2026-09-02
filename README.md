# language-sass

Sass and SCSS language support.

## Features

- **Grammars**: provides Tree-sitter grammars built from [tree-sitter-sass](https://github.com/bajrangCoder/tree-sitter-sass), [tree-sitter-scss](https://github.com/simeonoff/tree-sitter-scss), and [tree-sitter-sassdoc](https://github.com/simeonoff/tree-sitter-sassdoc).
- **Syntax highlighting**: highlights Sass and SCSS syntax with embedded SassDoc and typed `@example` blocks.
- **Code structure**: provides folding, indentation, and symbol tags for both stylesheet syntaxes.
- **Snippets**: shortcuts for common Sass and SCSS rules.

## Installation

To install `language-sass` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-sass`.

## Services

- `hyperlink.injection`: consumed to highlight URLs inside stylesheets as clickable links.
- `todo.injection`: consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
