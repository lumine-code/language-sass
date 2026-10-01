((sassdoc_block) @injection.owner @injection.content
  (#set! injection.language "sassdoc")
  (#set! injection.include-children)
  (#set! injection.language-scope "none"))

; Annotation candidates are filtered by the target grammar.
([
  (comment)
  (single_line_comment)
] @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((string_value) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))

([
  (comment)
  (single_line_comment)
] @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))