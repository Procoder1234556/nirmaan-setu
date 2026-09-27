import React, { useState } from 'react';
import { NirmaanHeader } from '../components/NirmaanHeader';
import {
  useProjects,
  useReviewerQueue,
  bootstrapJudgingDemo,
  uploadScheduleBaseline,
} from '../operationsClient';
import {
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Search,
  ArrowRight,
  FileText,
  Calendar,
  Building2,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export function ProjectsDashboardPage() {
  const { projects, refetch, isLoading, error } = useProjects();
  const { pendingCount } = useReviewerQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isBootstrappingDemo, setIsBootstrappingDemo] = useState(false);

  // Upload modal form state
  const [uploadCodeOverride, setUploadCodeOverride] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'XER' | 'XML'>('XER');
  const [uploadFileContent, setUploadFileContent] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    projectCode: string;
    activitiesCount: number;
    dependenciesCount: number;
    criticalPathActivitiesCount: number;
    criticalPathSlipDays: number;
  } | null>(null);

  // KPI Calculations
  const totalProjects = projects.length;
  const maxCriticalPathSlip = Math.max(...projects.map((p) => p.criticalPathDelayDays), 0);
  const totalFieldEvents = projects.reduce((acc, p) => acc + (p.fieldEventsCount || 0), 0);
  const mostDelayedProject = projects.reduce<typeof projects[number] | undefined>((current, project) => !current || project.criticalPathDelayDays > current.criticalPathDelayDays ? project : current, undefined);

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadFileContent(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleXER = () => {
    setUploadCodeOverride('OIL-BRAHMAPUTRA-PL-2027');
    setUploadFileType('XER');
    setUploadFileName('Oil_India_Brahmaputra_Loop_P6.xer');
    setUploadFileContent(`ERMHDR\t8.0\t2026-09-26\tXER\tOil India Sample
%T\tPROJECT
%F\tproj_id\tproj_short_name\tclndr_id\tplan_start_date\tplan_end_date
%R\t1001\tOIL-BRAHMAPUTRA-PL-2027\t1\t2026-04-01\t2026-12-31
%T\tTASK
%F\ttask_id\tproj_id\twbs_id\ttask_code\ttask_name\ttarget_drtn_hr_cnt
%R\t2001\t1001\t101\tACT-ROW-01\tRight of Way Grading\t240
%R\t2002\t1001\t102\tACT-TR-02\tTrenching km 0-25\t320
%R\t2003\t1001\t103\tACT-WELD-03\tOrbital Welding 24-inch\t400
%E`);
  };

  const handleBootstrapDemo = async () => {
    setIsBootstrappingDemo(true);
    try {
      await bootstrapJudgingDemo();
      await refetch();
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'Unable to create the judging demo project.');
    } finally {
      setIsBootstrappingDemo(false);
    }
  };

  const handleExecuteUpload = async () => {
    if (!uploadFileContent) {
      alert('Please select a .XER or .XML schedule file or load sample.');
      return;
    }
    setIsUploading(true);
    try {
      const res = await uploadScheduleBaseline({
        fileContent: uploadFileContent,
        fileType: uploadFileType,
        projectCodeOverride: uploadCodeOverride,
      });
      setUploadResult(res);
      refetch();
    } catch (err: any) {
      alert('Error parsing baseline: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NirmaanHeader currentTab="projects" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Top Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Project controls
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review the link between site observations, planned activities, and the current CPM forecast.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            onClick={handleBootstrapDemo}
            disabled={isBootstrappingDemo}
            className="inline-flex min-h-11 w-full sm:w-auto justify-center items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted disabled:opacity-50 transition-all cursor-pointer"
          >
            {isBootstrappingDemo ? 'Preparing demo…' : 'Load judging demo'}
          </button>
          <button
            onClick={() => {
              setUploadResult(null);
              setIsUploadModalOpen(true);
            }}
            className="inline-flex min-h-11 w-full sm:w-auto justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Baseline Schedule (.XER / .XML)
          </button>
          </div>
        </div>

        {/* 4 High-Level KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1 */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Active Projects
              </span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{totalProjects}</div>
              <p className="hidden sm:flex text-xs text-muted-foreground mt-1 items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                Capital assets under tracking
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Critical Path Slip
              </span>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">
                +{maxCriticalPathSlip.toFixed(1)}d
              </div>
              <p className="hidden sm:flex text-xs text-muted-foreground mt-1 items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                {mostDelayedProject?.criticalPathDelayDays ? `${mostDelayedProject.code} has the highest recorded variance` : 'No schedule variance recorded yet'}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reviewer Queue
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <a href="/reviewer-queue" className="text-primary hover:underline font-medium">
                  Review pending actuals &rarr;
                </a>
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Causal Field Logs
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{totalFieldEvents}</div>
              <p className="hidden sm:flex text-xs text-muted-foreground mt-1 items-center gap-1">
                Field observations received by this workspace
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card/40">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search project code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-h-11 w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="hidden sm:inline text-xs text-muted-foreground whitespace-nowrap">Filter Status:</span>
            {(['ALL', 'GREEN', 'AMBER', 'RED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`min-h-11 shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {status === 'ALL'
                  ? 'All Projects'
                  : status === 'GREEN'
                  ? '🟢 On Track'
                  : status === 'AMBER'
                  ? '🟡 Attention'
                  : '🔴 Slip Breached'}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile project cards keep the schedule summary readable without table scrolling. */}
        <div className="space-y-3 md:hidden">
          {!isLoading && filteredProjects.length === 0 && (
            <div className="rounded-xl border border-border bg-card/60 px-5 py-10 text-center">
              <p className="font-semibold text-foreground">No project baselines yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Upload a Primavera XER or MS Project XML baseline to start the schedule workflow.</p>
            </div>
          )}
          {filteredProjects.map((project) => (
            <article key={project.id} className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground leading-snug">{project.name}</h3>
                  <p className="mt-1 font-mono text-xs font-medium text-primary">{project.code}</p>
                </div>
                <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-semibold border ${
                  project.status === 'RED'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                    : project.status === 'AMBER'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {project.status === 'RED' ? 'Slip breached' : project.status === 'AMBER' ? 'Attention' : 'On track'}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-border py-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Baseline finish</dt>
                  <dd className="mt-1 font-mono font-medium text-foreground">{new Date(project.plannedFinishDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Forecast finish</dt>
                  <dd className="mt-1 font-mono font-medium text-foreground">{new Date(project.currentForecastFinishDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Critical path</dt>
                  <dd className={`mt-1 font-mono font-bold ${project.criticalPathDelayDays > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {project.criticalPathDelayDays > 0 ? `+${project.criticalPathDelayDays.toFixed(1)} days` : 'On time'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Activity evidence</dt>
                  <dd className="mt-1 font-mono font-medium text-foreground">{project.activitiesCount} tasks, {project.fieldEventsCount} logs</dd>
                </div>
              </dl>
              <a href={`/projects/${project.id}`} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                View CPM schedule
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>

        {/* Desktop schedule table */}
        <div className="hidden md:block rounded-xl border border-border bg-card/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Project & Code</th>
                  <th className="px-6 py-4">Planned Baseline</th>
                  <th className="px-6 py-4">Forecast Finish</th>
                  <th className="px-6 py-4">Critical Path Slip</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Activities</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!isLoading && filteredProjects.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center"><p className="font-semibold text-foreground">No project baselines yet</p><p className="mt-1 text-xs text-muted-foreground">Upload a Primavera XER or MS Project XML baseline to start the schedule workflow.</p></td></tr>
                )}
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {project.name}
                      </div>
                      <div className="font-mono text-xs text-primary font-medium mt-0.5">
                        {project.code}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 max-w-sm truncate">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      <div>Start: {new Date(project.plannedStartDate).toLocaleDateString()}</div>
                      <div>End: {new Date(project.plannedFinishDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-medium text-foreground">
                      {new Date(project.currentForecastFinishDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {project.criticalPathDelayDays > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          +{project.criticalPathDelayDays.toFixed(1)} Days
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          0.0d (On Time)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {project.status === 'RED' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Critical Breached
                        </span>
                      ) : project.status === 'AMBER' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Moderate Delay
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Normal Schedule
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      <div>{project.activitiesCount} Activities</div>
                      <div className="text-[11px] text-primary">{project.fieldEventsCount} field logs</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        <span>View CPM Gantt</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {error && <p role="alert" className="text-xs text-destructive">Unable to load workspace projects: {error}</p>}

        {/* Upload Baseline Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
            <div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Upload Baseline Schedule (.XER / .XML)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Direct in-process parsing of Primavera P6 and MS Project files.
                  </p>
                </div>
              </div>

              {!uploadResult ? (
                <div className="mt-6 space-y-4">
                  {/* Project Code Override */}
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Project Code Override (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OIL-ASSAM-PL-2026"
                      value={uploadCodeOverride}
                      onChange={(e) => setUploadCodeOverride(e.target.value)}
                      className="min-h-11 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                    />
                  </div>

                  {/* File Type Select */}
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Format Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadFileType('XER')}
                        className={`min-h-11 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                          uploadFileType === 'XER'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        Primavera P6 (.XER)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadFileType('XML')}
                        className={`min-h-11 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                          uploadFileType === 'XML'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        MS Project (.XML)
                      </button>
                    </div>
                  </div>

                  {/* File Selector Dropzone */}
                  <div className="border-2 border-dashed border-border rounded-xl p-5 sm:p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="baseline-file-input"
                      accept=".xer,.xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="baseline-file-input"
                      className="min-h-28 cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <FileText className="w-8 h-8 text-primary/70" />
                      <div className="text-sm font-medium text-foreground">
                        {uploadFileName ? uploadFileName : 'Choose .XER or .XML schedule file'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Drag and drop or click to browse from workstation
                      </div>
                    </label>
                  </div>

                  {/* Quick Preset Button */}
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Need a format example?</span>
                    <button
                      type="button"
                      onClick={handleLoadSampleXER}
                      className="inline-flex min-h-11 items-center gap-1.5 text-primary hover:underline font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Load sample pipeline baseline
                    </button>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="min-h-11 w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={handleExecuteUpload}
                      className="inline-flex min-h-11 w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {isUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      Parse & Calculate Baseline CPM
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload Result Screen */
                <div className="mt-6 space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Baseline Ingested & CPM Forward/Backward Passes Completed!
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono">
                      <div>Project Code: {uploadResult.projectCode}</div>
                      <div>Activities Ingested: {uploadResult.activitiesCount}</div>
                      <div>Dependencies Mapped: {uploadResult.dependenciesCount}</div>
                      <div>Critical Path Tasks (0 Float): {uploadResult.criticalPathActivitiesCount}</div>
                      <div>Calculated Critical Path Slip: +{uploadResult.criticalPathSlipDays} Days</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end gap-2">
                    <button
                      onClick={() => setIsUploadModalOpen(false)}
                      className="min-h-11 w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                    >
                      Done & View Portfolio
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
