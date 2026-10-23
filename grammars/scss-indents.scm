
"{" @indent
"}" @dedent

("(" @indent
  (#is? test.childOfType "map_value list_value parameters arguments"))
(")" @dedent
  (#is? test.childOfType "map_value list_value parameters arguments"))
