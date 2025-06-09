import React, { useState, useEffect } from 'react';
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
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description?: string;
  subject: string;
  body: string;
  variables: Record<string, string | number | null>;
  created_at: string;
  updated_at: string;
}

const TemplateEditor: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');

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
    content: '',
  });

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('reminder_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;

      setTemplates(data || []);

      // Select the first template by default
      if (data && data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0].id);
        setTemplateName(data[0].name);
        setTemplateSubject(data[0].subject);
        editor?.commands.setContent(data[0].body);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      editor?.commands.setContent(template.body);
    }
  };

  const handleSave = async () => {
    if (!user || !editor || !templateName.trim() || !templateSubject.trim()) {
      toast.error('Please provide a template name and subject');
      return;
    }

    try {
      setSaving(true);
      const body = editor.getHTML();

      if (selectedTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('reminder_templates')
          .update({
            name: templateName,
            subject: templateSubject,
            body,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTemplate)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Template updated successfully');
      } else {
        // Create new template
        const { error } = await supabase
          .from('reminder_templates')
          .insert({
            user_id: user.id,
            name: templateName,
            subject: templateSubject,
            body,
            variables: {}
          });

        if (error) throw error;
        toast.success('Template created successfully');
      }

      await fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate || !user) return;

    try {
      const { error } = await supabase
        .from('reminder_templates')
        .delete()
        .eq('id', selectedTemplate)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Template deleted successfully');
      setSelectedTemplate(null);
      setTemplateName('');
      setTemplateSubject('');
      editor?.commands.setContent('');
      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleNew = () => {
    setSelectedTemplate(null);
    setTemplateName('');
    setTemplateSubject('');
    editor?.commands.setContent('');
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={selectedTemplate || ''}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2"
                >
                  <option value="">New Template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2"
                />

                <input
                  type="text"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="Email subject"
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNew}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Plus size={20} />
                </button>
                {selectedTemplate && (
                  <button
                    onClick={handleDelete}
                    className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold')
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Bold size={20} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic')
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Italic size={20} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded ${editor.isActive('underline')
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <UnderlineIcon size={20} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'left' })
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <AlignLeft size={20} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'center' })
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <AlignCenter size={20} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'right' })
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <AlignRight size={20} />
              </button>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Available Variables</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'client_name',
                'invoice_number',
                'amount',
                'due_date',
                'days_overdue',
                'sender_name',
                'company_name'
              ].map((variable) => (
                <button
                  key={variable}
                  onClick={() => editor.commands.insertContent(`{{${variable}}}}`)}
                  className="px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded hover:bg-primary-100 dark:hover:bg-primary-900/50"
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateEditor;