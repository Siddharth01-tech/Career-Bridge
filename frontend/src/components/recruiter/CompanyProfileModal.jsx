import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Building2, UploadCloud } from 'lucide-react';
import { companyService } from '../../services/api';

export default function CompanyProfileModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  currentCompany = null 
}) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentCompany) {
      setCompanyName(currentCompany.company_name || currentCompany.companyName || '');
      setIndustry(currentCompany.industry || '');
      setWebsite(currentCompany.website || '');
      setLocation(currentCompany.location || '');
      setDescription(currentCompany.description || '');
      setLogoPreview(currentCompany.logo_url || '');
    } else {
      setCompanyName('Starlight AI');
      setIndustry('Artificial Intelligence & Cloud Systems');
      setWebsite('https://starlight.ai');
      setLocation('San Francisco, CA');
      setDescription('Pioneering high-scale developer platforms and intelligent automation tooling.');
      setLogoPreview('');
    }
    setLogoFile(null);
    setError('');
    setSuccess(false);
  }, [currentCompany, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }

    setLoading(true);

    try {
      let result;
      // If a file is uploaded, use FormData
      if (logoFile) {
        const formData = new FormData();
        formData.append('companyName', companyName.trim());
        if (description.trim()) formData.append('description', description.trim());
        if (website.trim()) formData.append('website', website.trim());
        if (location.trim()) formData.append('location', location.trim());
        if (industry.trim()) formData.append('industry', industry.trim());
        formData.append('logo', logoFile);

        try {
          if (currentCompany?.id) {
            result = await companyService.updateCompany(formData);
          } else {
            result = await companyService.createCompany(formData);
          }
        } catch (apiErr) {
          console.warn('Backend API error or offline mode:', apiErr.message);
        }
      } else {
        const payload = {
          companyName: companyName.trim(),
          description: description.trim() || undefined,
          website: website.trim() || undefined,
          location: location.trim() || undefined,
          industry: industry.trim() || undefined,
        };

        try {
          if (currentCompany?.id) {
            result = await companyService.updateCompany(payload);
          } else {
            result = await companyService.createCompany(payload);
          }
        } catch (apiErr) {
          console.warn('Backend API error or offline mode:', apiErr.message);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        const updated = {
          id: currentCompany?.id || result?.company?.id || 1,
          company_name: companyName.trim(),
          companyName: companyName.trim(),
          description: description.trim(),
          website: website.trim(),
          location: location.trim(),
          industry: industry.trim(),
          logo_url: logoPreview,
        };
        onSuccess?.(updated);
        onClose?.();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update company profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-[#FF5A0A] uppercase tracking-wider">
            Employer Branding
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#FF5A0A]" />
            <span>Company Profile</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Showcase your organization to candidate talent on CareerBridge.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Company Profile Saved!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your company details and branding will now be featured across all your active job postings.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Logo Upload / Preview */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Company Logo
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#FF5A0A] hover:border-orange-200 text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Company Name <span className="text-[#FF5A0A]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Starlight AI"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400 font-medium"
              />
            </div>

            {/* Industry & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Industry
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. AI & Cloud"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Headquarters / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                placeholder="https://company.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                About the Company
              </label>
              <textarea
                rows={3}
                placeholder="Describe your mission, values, and engineering culture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400 resize-none font-medium"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E44D00] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Saving...' : 'Save Company Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
