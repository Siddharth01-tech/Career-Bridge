import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Briefcase, Plus, Edit3 } from 'lucide-react';
import { jobService } from '../../services/api';

export default function RecruiterJobModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  jobToEdit = null,
  companyId = null,
  companyName = '' 
}) {
  const isEditing = !!jobToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [deadline, setDeadline] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title || '');
      setDescription(jobToEdit.description || '');
      setJobType(jobToEdit.job_type || jobToEdit.jobType || 'Full-time');
      setLocation(jobToEdit.location || jobToEdit.company_location || '');
      setSalaryMin(jobToEdit.salary_min !== undefined && jobToEdit.salary_min !== null ? String(jobToEdit.salary_min) : '');
      setSalaryMax(jobToEdit.salary_max !== undefined && jobToEdit.salary_max !== null ? String(jobToEdit.salary_max) : '');
      
      if (Array.isArray(jobToEdit.skills)) {
        setSkills(jobToEdit.skills.join(', '));
      } else if (typeof jobToEdit.skills === 'string') {
        setSkills(jobToEdit.skills);
      } else {
        setSkills('');
      }

      setExperience(jobToEdit.experience !== undefined && jobToEdit.experience !== null ? String(jobToEdit.experience) : '');
      
      if (jobToEdit.deadline) {
        try {
          const d = new Date(jobToEdit.deadline);
          if (!isNaN(d.getTime())) {
            setDeadline(d.toISOString().split('T')[0]);
          } else {
            setDeadline(jobToEdit.deadline);
          }
        } catch {
          setDeadline('');
        }
      } else {
        setDeadline('');
      }
    } else {
      // Defaults for new job
      setTitle('');
      setDescription('');
      setJobType('Full-time');
      setLocation('');
      setSalaryMin('');
      setSalaryMax('');
      setSkills('');
      setExperience('');
      setDeadline('');
    }
    setError('');
    setSuccess(false);
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Job description is required.');
      return;
    }

    const numSalaryMin = salaryMin ? Number(salaryMin) : null;
    const numSalaryMax = salaryMax ? Number(salaryMax) : null;

    if (numSalaryMin !== null && numSalaryMax !== null && numSalaryMin > numSalaryMax) {
      setError('Minimum salary cannot exceed maximum salary.');
      return;
    }

    if (!isEditing && !companyId) {
      setError('A company profile is required to post a requisition. Please set up your company profile first.');
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      jobType,
      location: location.trim() || undefined,
      salaryMin: numSalaryMin !== null ? numSalaryMin : undefined,
      salaryMax: numSalaryMax !== null ? numSalaryMax : undefined,
      skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      experience: experience !== '' ? Number(experience) : undefined,
      deadline: deadline || undefined,
    };

    if (!isEditing) {
      payload.companyId = companyId;
    }

    try {
      let result;
      if (isEditing) {
        result = await jobService.updateJob(jobToEdit.id, payload);
      } else {
        result = await jobService.createJob(payload);
      }

      setSuccess(true);
      setTimeout(() => {
        const savedJob = result?.job || {
          id: isEditing ? jobToEdit.id : (result?.id || Date.now()),
          title: payload.title,
          description: payload.description,
          job_type: payload.jobType,
          jobType: payload.jobType,
          location: payload.location || 'Remote',
          company_name: companyName,
          company: companyName,
          company_id: companyId,
          salary_min: payload.salaryMin,
          salary_max: payload.salaryMax,
          skills: payload.skills || [],
          experience: payload.experience,
          deadline: payload.deadline,
          created_at: isEditing ? jobToEdit.created_at : new Date().toISOString(),
        };

        onSuccess?.(savedJob, isEditing);
        onClose?.();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save job requisition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 relative">
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
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#FF5A0A] uppercase tracking-wider">
              Recruiter Requisitions
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {companyName}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="w-5 h-5 text-[#FF5A0A]" />
                <span>Edit Requisition</span>
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5 text-[#FF5A0A]" />
                <span>Publish New Requisition</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing 
              ? 'Update role responsibilities, compensation, and required criteria.' 
              : 'Post a verified opening across CareerBridge to attract qualified applicants.'}
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Requisition Updated!' : 'Requisition Published!'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {isEditing
                ? 'Your updates have been applied to this opening.'
                : 'Your requisition is now active and receiving qualified talent submissions.'}
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

            {/* Job Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Job Title <span className="text-[#FF5A0A]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400 font-medium"
              />
            </div>

            {/* Job Type & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Job Type <span className="text-[#FF5A0A]">*</span>
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all bg-white cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA • Hybrid"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Compensation Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Min Salary ($ / yr)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  placeholder="e.g. 120000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Max Salary ($ / yr)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  placeholder="e.g. 160000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, GraphQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Exp (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Application Deadline (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Role Description & Scope <span className="text-[#FF5A0A]">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe key responsibilities, deliverables, and team context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#FF5A0A] focus:ring-2 focus:ring-[#FF5A0A]/25 outline-none transition-all placeholder-slate-400 resize-none font-medium"
              />
            </div>

            {/* Modal Actions */}
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
                {isEditing ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>{loading ? 'Saving...' : (isEditing ? 'Update Requisition' : 'Publish Requisition')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

