import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Type,
  Palette
} from 'lucide-react';

const TemplateEditor: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('friendly');
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight,
      Link,
      Placeholder.configure({
        placeholder: 'Write your reminder message here...',
      }),
    ],
    content: `
      <h2>Payment Reminder</h2>
      <p>Dear {{client_name}},</p>
      <p>This is a friendly reminder that invoice #{{invoice_number}} for {{amount}} is due on {{due_date}}.</p>
      <p>Please let us know if you have any questions.</p>
      <p>Best regards,<br>{{sender_name}}</p>
    `,
  });

  const templates = [
    { id: 'friendly', name: 'Friendly Reminder', color: 'text-primary-600' },
    { id: 'professional', name: 'Professional Notice', color: 'text-gray-700' },
    { id: 'urgent', name: 'Final Notice', color: 'text-error-600' },
  ];

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Template Editor</h3>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Save Template
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`px-4 py-2 rounded-lg border ${
                selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <span className={template.color}>{template.name}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Italic size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('underline') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <UnderlineIcon size={20} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-2" />
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <AlignLeft size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <AlignCenter size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <AlignRight size={20} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-2" />
          <button
            onClick={() => {
              const url = window.prompt('Enter the URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('link') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <LinkIcon size={20} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Type size={20} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Palette size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Available Variables</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'client_name',
            'invoice_number',
            'amount',
            'due_date',
            'sender_name',
          ].map((variable) => (
            <span
              key={variable}
              className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
            >
              {`{{${variable}}}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;