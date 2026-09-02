; Based on simeonoff/tree-sitter-sassdoc queries/sassdoc/highlights.scm at
; 38abe86eac15ed8d668de04df963ef0a4c220cfe (MIT).

(document) @comment.documentation.sassdoc

[
  "@param"
  "@parameter"
  "@arg"
  "@argument"
  "@return"
  "@returns"
  "@access"
  "@alias"
  "@author"
  "@content"
  "@deprecated"
  "@group"
  "@ignore"
  "@link"
  "@source"
  "@name"
  "@output"
  "@outputs"
  "@package"
  "@property"
  "@prop"
  "@since"
  "@throw"
  "@throws"
  "@exception"
  "@todo"
  "@type"
  "@see"
  "@example"
  "@require"
  "@requires"
] @storage.type.class.sassdoc

(tag_access
  ["public" "private"] @storage.modifier.sassdoc)

(reference) @entity.name.type.sassdoc
(type_name) @entity.name.type.sassdoc
(variable_name) @variable.other.sassdoc
(version) @constant.numeric.sassdoc

[(description) (line_description)] @comment.documentation.sassdoc

(example_language) @entity.name.tag.sassdoc
[(code_block) (code_line)] @comment.documentation.sassdoc
(see_reference) @support.function.sassdoc
(group_name) @entity.name.namespace.sassdoc
(alias_name) @entity.name.function.sassdoc
(package_name) @entity.name.namespace.sassdoc
(property_name) @variable.other.property.sassdoc
(url) @markup.underline.link.sassdoc
(link_caption) @comment.documentation.sassdoc
(custom_name) @string.unquoted.sassdoc
(default_value) @string.other.sassdoc

["{" "}"] @punctuation.section.braces.sassdoc
"|" @punctuation.separator.sassdoc
(tag_description "-" @punctuation.separator.sassdoc)

(ERROR) @comment.documentation.sassdoc
