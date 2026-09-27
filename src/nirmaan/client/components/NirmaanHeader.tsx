import React, { useState } from 'react';
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
  X,
} from 'lucide-react';

interface NirmaanHeaderProps {
  currentTab: 'projects' | 'details' | 'queue' | 'field-log' | 'knowledge-base' | 'evidence';
  projectId?: string;
}

export function NirmaanHeader({ currentTab, projectId }: NirmaanHeaderProps) {
  const { pendingCount } = useReviewerQueue();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-30 border-b border-black/8 bg-background/90 backdrop-blur-md transition-all">
      {/* Top Enterprise Ribbon */}
      <div className="border-b border-black/6 bg-white/45 px-4 py-1.5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold bg-[#e6f8d1] text-[#43711e] border border-[#cdebad]">
            SIH26122 · OIL INDIA LIMITED
          </span>
          <span className="hidden sm:inline text-muted-foreground/60">|</span>
          <span className="hidden sm:inline font-mono">Infrastructure project controls workspace</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono">Schedule data is updated from submitted field logs</span>
          <span className="text-muted-foreground/60">|</span>
          <span className="font-semibold text-foreground">Project controls</span>
        </div>
      </div>

      {/* Main Title & Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  Nirmaan Setu
                  <span className="text-sm font-normal text-muted-foreground font-serif">
                    (निर्माण सेतु)
                  </span>
                </h1>
                <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-[#e6f8d1] text-[#43711e] font-medium">
                  Schedule workspace
                </span>
              </div>
              <p className="hidden sm:block text-xs text-muted-foreground">
                Intelligent Field Data Capture & Dynamic CPM Schedule-Linking Layer
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-workspace-navigation"
              className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground md:hidden"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <nav aria-label="Workspace navigation" className="hidden md:flex md:items-center md:gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`flex min-h-11 shrink-0 items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-primary-foreground text-primary'
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
        </div>
        {isMobileMenuOpen && (
          <nav id="mobile-workspace-navigation" aria-label="Mobile workspace navigation" className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 md:hidden">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <a key={link.id} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-semibold ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 truncate">{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[10px] text-destructive-foreground">{link.badge}</span>}
                </a>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
