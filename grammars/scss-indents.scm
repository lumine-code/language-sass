; Quoted property and variable values may lose their wrapper during recovery,
; including fallback strings inside functions. Completed strings do not hide
; later structural blocks.
((ERROR "{" @_IGNORE_) @_error
  (#is? test.endsOnSameRowAs parent.endPosition)
  (#match? @_error "(?:^|[;{\\r\\n])[ \\t]*\\$?[-\\w]+[ \\t]*:[ \\t]*(?:[^\"'\\\\;{}\\r\\n]|\\\\.|\"(?:\\\\.|[^\"\\\\\\r\\n])*\"|'(?:\\\\.|[^'\\\\\\r\\n])*')*(?:\"(?:\\\\.|[^\"\\\\\\r\\n])*|'(?:\\\\.|[^'\\\\\\r\\n])*)[ \\t\\r\\n]*$")
  (#set! capture.final true))

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
