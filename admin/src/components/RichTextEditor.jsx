import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'blockquote',
  'code-block',
  'link',
];

export default function RichTextEditor({ value, onChange, id }) {
  const v = value ?? '';
  const quillModules = useMemo(() => modules, []);

  return (
    <div className="rich-text-editor-wrap" id={id}>
      <ReactQuill
        theme="snow"
        value={v}
        onChange={onChange}
        modules={quillModules}
        formats={formats}
        placeholder="Write the article body…"
      />
    </div>
  );
}
