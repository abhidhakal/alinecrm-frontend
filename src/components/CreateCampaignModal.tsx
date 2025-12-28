import React, { useState, useEffect } from 'react';
import { campaignsApi } from '../api/campaigns';
import type { Campaign, CreateCampaignDto } from '../api/campaigns';
import { templatesApi, type EmailTemplate } from '../api/templates';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import DatePicker from './DatePicker';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaignToEdit?: Campaign | null;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
  onSuccess,
  campaignToEdit,
}: CreateCampaignModalProps) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [formData, setFormData] = useState<CreateCampaignDto>({
    name: '',
    subject: '',
    previewText: '',
    senderName: '',
    senderEmail: '',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
  .content { padding: 30px 0; }
  .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
  .footer { font-size: 12px; color: #999; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
</style>
</head>
<body>
  <div class="header">
    <h2>Your Brand Name</h2>
  </div>
  
  <div class="content">
    <h1>Big News for You!</h1>
    <p>Hi there,</p>
    <p>We have something exciting to share with you. This is a great place to introduce your new product, feature, or announcement.</p>
    <p>Key benefits:</p>
    <ul>
      <li>Benefit #1 - Explain why this matters</li>
      <li>Benefit #2 - Explain how it helps</li>
      <li>Benefit #3 - Explain what to do next</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="#" class="button">Check It Out</a>
    </div>
  </div>

  <div class="footer">
    <p>© 2025 AlineCRM. All rights reserved.</p>
    <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribe_url}}">unsubscribe here</a>.</p>
  </div>
</body>
</html>`,
    scheduledAt: undefined,
    audienceFilters: {
      source: 'contacts',
      filters: {},
    },
  });

  useEffect(() => {
    if (campaignToEdit) {
      setFormData({
        name: campaignToEdit.name,
        subject: campaignToEdit.subject,
        previewText: campaignToEdit.previewText || '',
        senderName: campaignToEdit.senderName,
        senderEmail: campaignToEdit.senderEmail,
        htmlContent: campaignToEdit.htmlContent,
        scheduledAt: campaignToEdit.scheduledAt ? new Date(campaignToEdit.scheduledAt).toISOString() : undefined,
        audienceFilters: campaignToEdit.audienceFilters,
      });
      setEstimatedCount(campaignToEdit.totalRecipients);
    } else {
      setFormData(prev => ({
        ...prev,
        senderName: user?.name || '',
        senderEmail: 'hi.alinecrm@gmail.com'
      }));
    }
  }, [campaignToEdit, user]);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const data = await templatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleApplyTemplate = (templateId: string | null) => {
    if (templateId === null) {
      // Start from scratch - just move to next step
      setStep(2);
      return;
    }
    const template = templates.find(t => t.id === Number(templateId));
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.suggestedTitle || prev.name,
        subject: template.subject || prev.subject,
        htmlContent: template.htmlContent
      }));
      showToast(`Applied "${template.name}" template`, 'info');
      setStep(2);
    }
  };

  // Estimate audience when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.audienceFilters.source) {
        handleEstimateAudience();
      }
    }, 1000); // Debounce
    return () => clearTimeout(timer);
  }, [formData.audienceFilters]);

  const handleEstimateAudience = async () => {
    try {
      setEstimating(true);
      const res = await campaignsApi.estimateAudience(formData.audienceFilters);
      setEstimatedCount(res.estimatedCount);
    } catch (error) {
      console.error('Failed to estimate audience', error);
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, shouldRun = false) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        senderName: formData.senderName || user?.name || 'AlineCRM Member',
        senderEmail: 'hi.alinecrm@gmail.com',
        scheduledAt: formData.scheduledAt || undefined
      };

      let savedCampaign: Campaign;
      if (campaignToEdit) {
        savedCampaign = await campaignsApi.update(campaignToEdit.id, dataToSubmit);
      } else {
        savedCampaign = await campaignsApi.create(dataToSubmit);
      }

      if (shouldRun) {
        await campaignsApi.send(savedCampaign.id);
        showToast('Campaign saved and started sending!', 'success');
      } else {
        showToast(`Campaign ${campaignToEdit ? 'updated' : 'created'} successfully`, 'success');
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save campaign', error);
      showToast('Failed to save campaign', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      audienceFilters: {
        ...prev.audienceFilters,
        filters: {
          ...prev.audienceFilters.filters,
          [key]: value,
        },
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex h-[90vh] w-[900px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            {campaignToEdit ? 'Edit Campaign' : 'Create Campaign'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="flex bg-gray-50 px-8 py-3 border-b border-gray-100">
          {[1, 2, 3, 4].map(i => (
            <button
              key={i}
              onClick={() => {
                // Only allow jumping back or to next logical step if valid
                if (i < step || (i === step + 1 && formData.name) || campaignToEdit) {
                  setStep(i);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${step === i ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === i ? 'bg-black text-white' : 'bg-gray-200'}`}>{i}</div>
              {i === 1 && 'Template'}
              {i === 2 && 'Setup'}
              {i === 3 && 'Design'}
              {i === 4 && 'Audience'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="campaign-form" onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Step 1: Template Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">How would you like to start?</h3>
                  <p className="text-sm text-gray-500">Pick a template to save time, or start with a blank canvas.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Start from Scratch */}
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(null)}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-100 hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Start from Scratch</p>
                      <p className="text-xs text-gray-400">Build your campaign manually</p>
                    </div>
                  </button>

                  {/* Template Cards */}
                  {loadingTemplates ? (
                    <div className="col-span-1 flex items-center justify-center bg-gray-50 rounded-2xl p-8">
                      <p className="text-sm text-gray-400 animate-pulse">Loading templates...</p>
                    </div>
                  ) : (
                    templates.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleApplyTemplate(t.id.toString())}
                        className="flex flex-col text-left p-6 rounded-2xl border border-gray-100 hover:border-black hover:shadow-md transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Select</div>
                        </div>
                        <div className="mb-4 h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{t.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{t.description || "No description"}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Setup (Identity) */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Campaign Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="e.g. Summer Outreach 2025"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject Line</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium"
                    placeholder="The catchy part your audience sees first"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Preview Text</label>
                  <input
                    type="text"
                    value={formData.previewText}
                    onChange={(e) => setFormData({ ...formData, previewText: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="A short snippet after the subject line"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sender Name</label>
                  <input
                    required
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Schedule (Optional)</label>
                  <DatePicker
                    date={formData.scheduledAt ? new Date(formData.scheduledAt) : undefined}
                    setDate={(date) => setFormData({ ...formData, scheduledAt: date ? date.toISOString() : undefined })}
                    placeholder="Select launch time"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Design (The HTML) */}
            {step === 3 && (
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Email Content</h4>
                    <p className="text-xs text-gray-500">Edit the HTML directly or refine your template.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-gray-400 hover:text-black transition-colors"
                  >
                    Change Template?
                  </button>
                </div>
                <textarea
                  required
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                  className="w-full flex-1 min-h-[450px] rounded-2xl border border-gray-200 p-6 text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/30"
                  placeholder="<h1>Hello {{name}},</h1>..."
                />
              </div>
            )}

            {/* Step 4: Audience */}
            {step === 4 && (
              <div className="space-y-6">
                {/* Source Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Who should receive this?</label>
                  <div className="flex gap-4">
                    {['contacts', 'leads'].map((source) => (
                      <label key={source} className={`flex items-center gap-2 p-4 rounded-xl border cursor-pointer flex-1 transition-all ${formData.audienceFilters.source === source ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name="source"
                          value={source}
                          checked={formData.audienceFilters.source === source}
                          onChange={() => setFormData(prev => ({ ...prev, audienceFilters: { ...prev.audienceFilters, source: source as any, filters: {} } }))}
                          className="text-black focus:ring-black"
                        />
                        <span className="capitalize font-medium">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                {/* Filters */}
                <h3 className="font-semibold text-gray-900">Refine Audience</h3>

                {formData.audienceFilters.source === 'contacts' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Priority</label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                          onChange={(e) => updateFilter('priority', e.target.value ? [e.target.value] : undefined)}
                        >
                          <option value="">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                          <img src="/icons/chevron-down.svg" alt="chevron" className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Status</label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                          onChange={(e) => updateFilter('status', e.target.value ? [e.target.value] : undefined)}
                        >
                          <option value="">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Closed Won">Closed Won</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                          <img src="/icons/chevron-down.svg" alt="chevron" className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Source</label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                          onChange={(e) => updateFilter('leadSource', e.target.value ? [e.target.value] : undefined)}
                        >
                          <option value="">All Sources</option>
                          <option value="Organic">Organic</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Referral">Referral</option>
                          <option value="Word of Mouth">Word of Mouth</option>
                          <option value="Contacts">Contacts</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                          <img src="/icons/chevron-down.svg" alt="chevron" className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Range - Common */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Created After</label>
                    <DatePicker
                      date={formData.audienceFilters.filters.createdAtFrom ? new Date(formData.audienceFilters.filters.createdAtFrom) : undefined}
                      setDate={(date) => updateFilter('createdAtFrom', date ? date.toISOString() : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Created Before</label>
                    <DatePicker
                      date={formData.audienceFilters.filters.createdAtTo ? new Date(formData.audienceFilters.filters.createdAtTo) : undefined}
                      setDate={(date) => updateFilter('createdAtTo', date ? date.toISOString() : undefined)}
                    />
                  </div>
                </div>

                {/* Estimate */}
                <div className="mt-4 rounded-xl bg-gray-50 p-6 flex items-center justify-between border border-gray-200 shadow-inner">
                  <div className="text-sm font-semibold text-gray-600">Total Reach Potential</div>
                  <div className="text-3xl font-black text-black">
                    {estimating ? (
                      <span className="text-gray-400 text-sm animate-pulse">Calculating...</span>
                    ) : (
                      estimatedCount !== null ? estimatedCount.toLocaleString() : '-'
                    )}
                    <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest">recipients</span>
                  </div>
                </div>

              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5 bg-white">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onClose();
            }}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-3">
            {step === 4 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e as any, false)}
                  disabled={loading}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Saving...' : (campaignToEdit ? 'Save Changes' : 'Create Campaign')}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e as any, true)}
                  disabled={loading}
                  className="rounded-xl bg-black px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                  {loading ? 'Sending...' : (campaignToEdit ? 'Save & Run' : 'Create & Run')}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                }}
                disabled={step === 2 && !formData.name}
                className="rounded-xl bg-black px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
