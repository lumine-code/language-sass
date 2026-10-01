((single_line_comment) @injection.owner @injection.content
  (#match? @injection.content "^///")
  (#set! injection.language "sassdoc")
  (#set! injection.combined)
  (#set! injection.newlines-between)
  (#set! injection.language-scope "none"))

; Annotation candidates are filtered by the target grammar.
([
  (comment)
  (single_line_comment)
] @injection.owner @injection.content
  (#not-match? @injection.owner "^///")
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((string_value) @injection.owner @injection.content
  (#not-match? @injection.owner "^///")
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))

([
  (comment)
  (single_line_comment)
] @injection.owner @injection.content
  (#not-match? @injection.owner "^///")
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))