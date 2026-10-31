; Existing literal and comment contents are user data, including whitespace.
([(string_value) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))


; Interpolation opens with `#{`, not a block-opening brace.
(interpolation "}" @_IGNORE_ (#set! capture.final true))

"{" @indent
"}" @dedent

("(" @indent
  (#is? test.childOfType "map_value list_value parameters arguments"))
(")" @dedent
  (#is? test.childOfType "map_value list_value parameters arguments"))
