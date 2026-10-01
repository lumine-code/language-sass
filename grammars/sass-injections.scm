((single_line_comment) @injection.owner @injection.content
  (#match? @injection.content "^///")
  (#set! injection.language "sassdoc")
  (#set! injection.combined)
  (#set! injection.newlines-between)
  (#set! injection.language-scope "none"))
