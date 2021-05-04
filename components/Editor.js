import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
const Editor = (props) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={props.value}
      onChange={(event, editor) => {
        const data = editor.getData();
        props.onChange(data);
      }}
    />
  );
};

export default Editor;