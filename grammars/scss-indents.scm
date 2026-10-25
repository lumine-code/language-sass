
; Interpolation opens with `#{`, not a block-opening brace.
(interpolation "}" @_IGNORE_ (#set! capture.final true))

"{" @indent
"}" @dedent

("(" @indent
  (#is? test.childOfType "map_value list_value parameters arguments"))
(")" @dedent
  (#is? test.childOfType "map_value list_value parameters arguments"))
