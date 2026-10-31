; Reindent cannot infer a new Sass block structure from existing whitespace.
((stylesheet) @preserve
  (#is? indent.reindent true)
  (#set! indent.force true))

; The upstream query uses @indent.begin/@indent.end, while Lumine reacts to
; @indent/@dedent captures on the line being edited. Capture a header token or
; header node rather than the multi-line block itself.

(rule_set
  (selectors) @indent
  (#is? test.firstTextOnRow true))

(mixin_statement
  [(name) (shorthand_mixin)] @indent)

(function_statement
  (name) @indent)

(if_clause "@if" @indent)
(each_statement "@each" @indent)
(for_statement "@for" @indent)
(while_statement "@while" @indent)
(media_statement "@media" @indent)
(supports_statement "@supports" @indent)
(scope_statement "@scope" @indent)
; A layer name may declare order without opening a block.
(layer_statement "@layer" @indent (block))
(container_statement "@container" @indent)
(font_face_statement "@font-face" @indent)
(keyframes_statement (keyframes_name) @indent)
(at_root_statement "@at-root" @indent)
; Unknown at-rules and mixin calls may be complete one-line operations.
(at_rule (at_keyword) @indent (block))

(include_statement
  ["@include" (shorthand_include)] @indent
  (block))

(placeholder
  (placeholder_selector) @indent)

((declaration
  (property_name) @indent
  (block)))

(else_if_clause "@else" @dedent @indent)
(else_clause "@else" @dedent @indent)
