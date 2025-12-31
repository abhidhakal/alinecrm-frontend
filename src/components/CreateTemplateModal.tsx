import { useState, useEffect } from 'react';
import { templatesApi, type EmailTemplate, type CreateTemplateDto } from '../api/templates';
import { useToast } from '../context/ToastContext';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  templateToEdit?: EmailTemplate | null;
}

export default function CreateTemplateModal({
  isOpen,
  onClose,
  onSuccess,
  templateToEdit,
}: CreateTemplateModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTemplateDto>({
    name: '',
    subject: '',
    suggestedTitle: '',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
  .content { padding: 30px 0; }
  .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
  .footer { font-size: 12px; color: #999; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
</style>
</head>
<body>
  <div class="header">
    <h2>Your Brand</h2>
  </div>
  <div class="content">
    <h1>Welcome!</h1>
    <p>Hi {{name}},</p>
    <p>This is a starting point for your new template.</p>
  </div>
  <div class="footer">
    <p>© 2025 AlineCRM. All rights reserved.</p>
  </div>
</body>
</html>`,
    description: '',
  });

  useEffect(() => {
    if (templateToEdit) {
      setFormData({
        name: templateToEdit.name,
        subject: templateToEdit.subject || '',
        suggestedTitle: templateToEdit.suggestedTitle || '',
        htmlContent: templateToEdit.htmlContent,
        description: templateToEdit.description || '',
      });
    }
  }, [templateToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (templateToEdit) {
        await templatesApi.update(templateToEdit.id, formData);
        showToast('Template updated successfully', 'success');
      } else {
        await templatesApi.create(formData);
        showToast('Template created successfully', 'success');
      }
      onSuccess();
    } catch (error) {
      showToast('Failed to save template', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex h-[90vh] w-[800px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            {templateToEdit ? 'Edit Template' : 'Create Template'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="template-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Template Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50"
                  placeholder="e.g. Welcome Email"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Suggested Campaign Title</label>
                <input
                  type="text"
                  value={formData.suggestedTitle}
                  onChange={(e) => setFormData({ ...formData, suggestedTitle: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50"
                  placeholder="e.g. Summer Outreach - {{date}}"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description (Internal Notes)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50"
                  placeholder="e.g. For new leads captured via social media"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">HTML Content</label>
                <textarea
                  required
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                  className="w-full min-h-[300px] rounded-xl border border-gray-200 p-4 text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50"
                  placeholder="<html>...</html>"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5 bg-gray-50/30">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            form="template-form"
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            {loading ? 'Saving...' : (templateToEdit ? 'Update Template' : 'Create Template')}
          </button>
        </div>
      </div>
    </div>
  );
}
