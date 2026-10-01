((tag_example
  (example_language) @injection.language
  (code_block (code_line) @injection.content)) @injection.owner
  (#set! injection.newlines-between))

; Annotation candidates are filtered by the target grammar.
([
  (description)
  (line_description)
  (link_caption)
  (url)
] @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))

([
  (description)
  (line_description)
  (link_caption)
] @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none"))
