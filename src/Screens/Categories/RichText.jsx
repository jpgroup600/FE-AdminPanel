import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],  // dropdown with colors
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

const RichText = (value, onChange) => {
    return (
        <ReactQuill modules={modules} value={value} onChange={onChange}
        style={{ resize: "vertical", overflowY: "auto", height: 300 }}
        />
    )
}


export default RichText;