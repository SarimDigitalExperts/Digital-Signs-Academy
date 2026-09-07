import React, { useState } from 'react';
import {
  Link as LinkIcon,
  CheckSquare,
  ExternalLink,
  Info,
  Github,
  Globe,
  UtensilsCrossed,
} from 'lucide-react';
import { PracticalQuestionItem } from '../types';

interface PracticalTaskProps {
  question: PracticalQuestionItem;
  canvaLink?: string; // Stores Live Deployed App URL
  githubLink?: string; // Stores GitHub / Source Code Repo URL
  notes?: string;
  onLinkChange: (link: string) => void;
  onGithubLinkChange?: (link: string) => void;
  onNotesChange: (notes: string) => void;
}

export const PracticalTask: React.FC<PracticalTaskProps> = ({
  question,
  canvaLink = '',
  githubLink = '',
  notes = '',
  onLinkChange,
  onGithubLinkChange,
  onNotesChange,
}) => {
  const [testedLiveLink, setTestedLiveLink] = useState(false);
  const [testedGithubLink, setTestedGithubLink] = useState(false);

  const isValidLiveUrl =
    canvaLink.trim().length > 0 &&
    /^https?:\/\/.+/i.test(canvaLink.trim());

  const isValidGithubUrl =
    githubLink.trim().length > 0 &&
    /^https?:\/\/.+/i.test(githubLink.trim());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
            Practical Task {question.number}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase rounded border border-orange-200">
              Instructor Evaluated
            </span>
            <span className="text-xs font-black text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded">
              {question.marks} Marks
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
          {question.taskTitle}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {question.taskDescription}
        </p>
      </div>

      {/* Project Brief Box */}
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Client Project Brief
            </span>
          </div>
          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            100 Marks Capstone
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-base sm:text-lg font-extrabold text-blue-900">
            &ldquo;Restaurant Cafe Crave — Complete Website &amp; Web Application&rdquo;
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Requirements: All features and pages working seamlessly &bull; User-friendly UI/UX design &bull; Fully responsive layout
          </p>
        </div>

        {/* Requirements Checklist */}
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2 tracking-wider">
            Evaluation Criteria &amp; Functional Checklist:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.requirements.map((req, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submission Links Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        {/* Field 1: Live Deployed Application URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="liveAppUrl"
              className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Live Deployed Website / App URL</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Vercel, Netlify, Lovable, Replit, etc.
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Paste the public link to your working Cafe Crave website or application so the instructor can test all pages and features.
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              id="liveAppUrl"
              type="url"
              placeholder="https://cafe-crave.vercel.app or https://lovable.dev/projects/..."
              value={canvaLink}
              onChange={(e) => {
                onLinkChange(e.target.value);
                setTestedLiveLink(false);
              }}
              className="w-full pl-10 pr-28 py-3 bg-white rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-hidden transition-all text-slate-800 shadow-2xs"
            />
            {isValidLiveUrl && (
              <a
                href={canvaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTestedLiveLink(true)}
                className="absolute right-2 top-2 bottom-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>{testedLiveLink ? 'Tested ✓' : 'Test Link'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Field 2: GitHub Repository URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="githubRepoUrl"
              className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"
            >
              <Github className="w-4 h-4 text-slate-700" />
              <span>GitHub / Source Code Repository Link</span>
              <span className="text-slate-400 font-normal">(Recommended)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              github.com/username/cafe-crave
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Paste the link to your public GitHub repository containing the source code.
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Github className="w-4 h-4" />
            </div>
            <input
              id="githubRepoUrl"
              type="url"
              placeholder="https://github.com/yourusername/cafe-crave"
              value={githubLink}
              onChange={(e) => {
                if (onGithubLinkChange) onGithubLinkChange(e.target.value);
                setTestedGithubLink(false);
              }}
              className="w-full pl-10 pr-28 py-3 bg-white rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-hidden transition-all text-slate-800 shadow-2xs"
            />
            {isValidGithubUrl && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTestedGithubLink(true)}
                className="absolute right-2 top-2 bottom-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>{testedGithubLink ? 'Tested ✓' : 'Test Link'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Guidance tip box */}
        <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800">Deployment Verification Tip:</span> Make sure your deployed application is publicly accessible without requiring login credentials. Verify that menu items can be added to the cart, the reservation form submits cleanly, and the mobile view operates smoothly.
          </div>
        </div>

        {/* Technical notes & feature description */}
        <div className="space-y-1.5 pt-2">
          <label
            htmlFor="designNotes"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Architecture, Features &amp; AI Prompting Notes <span className="text-slate-400 font-normal">(Recommended)</span>
          </label>
          <textarea
            id="designNotes"
            rows={4}
            placeholder="Describe the tools used (Google AI Studio, Lovable, Claude Code, etc.), list all working pages/features, describe the UI/UX choices, and share key prompting workflows..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full p-3.5 bg-white rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-hidden transition-all text-slate-800 placeholder:text-slate-400 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
