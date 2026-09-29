import React, { useEffect, useState } from 'react';
import { useReviewerQueue } from '../operationsClient';
import {
  HardHat,
  Layers,
  CheckCircle2,
  Mic,
  Database,
  Calendar,
  AlertCircle,
  ExternalLink,
  ImageIcon,
  Menu,
  ShieldCheck,
  UserRound,
  X,
  ChevronRight,
} from 'lucide-react';

interface NirmaanHeaderProps {
  currentTab: 'projects' | 'details' | 'queue' | 'field-log' | 'knowledge-base' | 'evidence';
  projectId?: string;
}

export function NirmaanHeader({ currentTab, projectId }: NirmaanHeaderProps) {
  const { pendingCount } = useReviewerQueue();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleChooser, setShowRoleChooser] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024 && !localStorage.getItem('nirmaan_mobile_role')) {
      setShowRoleChooser(true);
    }
  }, []);

  const selectMobileRole = (role: 'admin' | 'worker') => {
    localStorage.setItem('nirmaan_mobile_role', role);
    window.location.assign(role === 'admin' ? '/admin' : '/field-log');
  };

  const navLinks = [
    {
      id: 'projects',
      label: 'Projects Portfolio',
      href: '/projects',
      icon: Layers,
    },
    {
      id: 'details',
      label: 'CPM Schedule & Gantt',
      href: projectId ? `/projects/${projectId}` : '/projects',
      icon: Calendar,
    },
    {
      id: 'queue',
      label: 'Reviewer Queue',
      href: '/reviewer-queue',
      icon: CheckCircle2,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      id: 'field-log',
      label: 'Field Logger PWA',
      href: '/field-log',
      icon: Mic,
    },
    {
      id: 'evidence',
      label: 'Admin Evidence',
      href: '/evidence',
      icon: ImageIcon,
    },
    {
      id: 'knowledge-base',
      label: 'Historical Benchmarks',
      href: '/knowledge-base',
      icon: Database,
    },
  ];

  return (
    <>
      {showRoleChooser && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-4 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-role-title">
          <div className="w-full rounded-3xl bg-white p-5 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Nirmaan Setu</p>
            <h2 id="mobile-role-title" className="mt-2 text-xl font-bold text-slate-950">How are you using the app?</h2>
            <p className="mt-1 text-sm text-slate-500">Choose a workspace to continue. You can change this from the menu later.</p>
            <div className="mt-5 grid gap-3">
              <button type="button" onClick={() => selectMobileRole('admin')} className="flex min-h-16 items-center gap-3 rounded-2xl border border-emerald-900/15 bg-emerald-50 p-4 text-left"><ShieldCheck className="h-6 w-6 text-emerald-700" /><span><span className="block text-sm font-bold text-slate-950">Administrator / Manager</span><span className="block text-xs text-slate-500">Review field submissions and manage projects</span></span></button>
              <button type="button" onClick={() => selectMobileRole('worker')} className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left"><UserRound className="h-6 w-6 text-slate-700" /><span><span className="block text-sm font-bold text-slate-950">Field worker</span><span className="block text-xs text-slate-500">Capture observations and see your upload history</span></span></button>
            </div>
          </div>
        </div>
      )}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-emerald-950/8 bg-white px-5 py-6 lg:flex">
        <a href="/projects" className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d5b3b] text-white shadow-lg shadow-emerald-900/15">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-950">Nirmaan Setu</h1>
            <p className="text-[11px] font-medium text-slate-400">Project controls workspace</p>
          </div>
        </a>
        <div className="mt-10 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</div>
        <nav aria-label="Workspace navigation" className="mt-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-[#0d5b3b]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#168259]' : 'text-slate-400 group-hover:text-[#168259]'}`} />
                  <span className="min-w-0 truncate">{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span
                      className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#0d5b3b] text-white'
                          : 'bg-destructive text-destructive-foreground'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#0a3f2b] p-4 text-white shadow-lg shadow-emerald-950/10">
          <p className="text-xs font-semibold">SIH26122 · OIL INDIA LIMITED</p>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-100/75">Schedule data updates from submitted field logs.</p>
          <a href="/knowledge-base" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-100 hover:text-white">Workspace guide <ChevronRight className="h-3.5 w-3.5" /></a>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d5b3b] text-white"><HardHat className="h-5 w-5" /></div>
          <div><h1 className="text-base font-bold text-slate-950">Nirmaan Setu</h1><p className="text-[10px] text-slate-400">Project controls workspace</p></div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-workspace-navigation"
            className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800"
          >
            <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => { localStorage.removeItem('nirmaan_mobile_role'); setShowRoleChooser(true); }} className="inline-flex min-h-11 items-center justify-center rounded-xl px-2 text-[11px] font-semibold text-emerald-700">Role</button>
        </div>
        {isMobileMenuOpen && (
          <nav id="mobile-workspace-navigation" aria-label="Mobile workspace navigation" className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <a key={link.id} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex h-11 min-w-0 items-center gap-2 rounded-xl px-2.5 text-xs font-semibold ${isActive ? 'bg-[#0d5b3b] text-white' : 'bg-slate-50 text-slate-700'}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 truncate">{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[10px] text-destructive-foreground">{link.badge}</span>}
                </a>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
}
