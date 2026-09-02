; Based on bajrangCoder/tree-sitter-sass queries/highlights.scm at
; fb280c41b070657e4ff4d4e5e6eea6cb19efd9b8 (MIT).

(comment) @comment.block.sass
(single_line_comment) @comment.line.double-slash.sass

[
  "@import"
  "@use"
  "@forward"
  "@media"
  "@charset"
  "@namespace"
  "@supports"
  "@scope"
  "@layer"
  "@container"
  "@font-face"
  "@mixin"
  "@include"
  "@extend"
  "@if"
  "@else"
  "@each"
  "@for"
  "@while"
  "@function"
  "@return"
  "@at-root"
  "@error"
  "@warn"
  "@debug"
  "@content"
] @keyword.control.at-rule.sass

(at_keyword) @keyword.control.at-rule.sass
[(shorthand_mixin) (shorthand_include)] @keyword.control.at-rule.sass

[
  "from"
  "through"
  "to"
  "in"
  "and"
  "or"
  "not"
  "only"
] @keyword.control.sass

[
  "as"
  "with"
  "using"
  "hide"
  "show"
] @keyword.control.import.sass

(boolean_value) @constant.language.boolean.sass
(null_value) @constant.language.null.sass
(custom_property_name) @variable.other.assignment.sass

[(important) (default) (global) (optional_flag)] @keyword.other.sass

(integer_value) @constant.numeric.sass
(float_value) @constant.numeric.sass
(unit) @keyword.other.unit.sass
(color_value) @constant.other.color.sass
(unicode_range) @string.other.sass
(string_value) @string.quoted.sass
(escape_sequence) @constant.character.escape.sass

[(variable_name) (variable_value) (variable_identifier)] @variable.other.sass

(property_name) @support.type.property-name.sass

(function_name) @support.function.misc.sass
(function_statement (name) @entity.name.function.sass)
(mixin_statement (name) @entity.name.function.mixin.sass)
(mixin_name) @entity.name.function.mixin.sass
(call_expression (function_name) @support.function.misc.sass)

[
  (color_function (function_name))
  (gradient_function (function_name))
  (math_function (function_name))
  (var_function (function_name))
] @support.function.builtin.sass

(tag_name) @entity.name.tag.sass
(class_name) @entity.other.attribute-name.class.sass
(id_name) @entity.other.attribute-name.id.sass
(placeholder_name) @entity.other.attribute-name.placeholder.sass
(nesting_selector) @entity.name.tag.reference.sass
(universal_selector) @entity.name.tag.universal.sass

(pseudo_class_selector (class_name) @entity.other.attribute-name.pseudo-class.sass)
(pseudo_element_selector (element_name) @entity.other.attribute-name.pseudo-element.sass)
(attribute_name) @entity.other.attribute-name.sass

(attribute_selector
  ["=" "~=" "^=" "|=" "*=" "$="] @keyword.operator.sass)

[(namespace_name) (module)] @entity.name.namespace.sass

(interpolation
  "#{" @punctuation.definition.interpolation.begin.sass
  "}" @punctuation.definition.interpolation.end.sass)

[
  "*"
  "/"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
] @keyword.operator.sass

[
  "("
  ")"
  "["
  "]"
] @punctuation.section.sass

[
  ":"
  "::"
  ","
  "."
  "~"
  "|"
] @punctuation.separator.sass

"..." @keyword.operator.spread.sass
(keyword_query) @keyword.control.media.sass
(feature_name) @support.type.property-name.sass
(range_query) @keyword.control.media.sass
[(layer_name) (container_name)] @entity.name.type.sass
(keyframes_name) @entity.name.function.keyframes.sass

; Preserve the package's value-completion scope for Tree-sitter Sass.
(declaration
  (property_name)
  (_) @meta.property-value.sass)
