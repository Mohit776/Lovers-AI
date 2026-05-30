"use client";

import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api";
import {
  ClipboardList, Plus, CheckCircle2, Clock, Search,
  X, ChevronDown, BarChart3,
} from "lucide-react";

type Application = {
  id: string;
  opportunity_id: string;
  notes: string;
  status: string;
  created_at: string;
};

type Opportunity = {
  id: string;
  title: string;
  organization?: string;
  company?: string;
  category?: string;
};

const STATUS_OPTIONS = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const STATUS_STYLES: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-100",
  screening: "bg-yellow-50 text-yellow-700 border-yellow-100",
  interview: "bg-violet-50 text-violet-700 border-violet-100",
  offer: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

function getStatusStyle(status?: string) {
  if (!status) return STATUS_STYLES["applied"];
  return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES["applied"];
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(status)}`}>
      {status || "Applied"}
    </span>
  );
}

function OpportunityPicker({
  opportunities,
  value,
  onChange,
}: {
  opportunities: Opportunity[];
  value: string;
  onChange: (id: string, title: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query
    ? opportunities.filter((o) =>
        `${o.title} ${o.organization || o.company || ""}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : opportunities.slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opp: Opportunity) => {
    setSelected(opp);
    onChange(opp.id, opp.title);
    setOpen(false);
    setQuery("");
  };

  const handleClear = () => {
    setSelected(null);
    onChange("", "");
    setQuery("");
  };

  return (
    <div ref={ref} className="relative">
      {selected ? (
        <div className="flex items-center justify-between w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{selected.title}</p>
            <p className="text-xs text-slate-500">{selected.organization || selected.company || "—"}</p>
          </div>
          <button onClick={handleClear} className="text-slate-400 hover:text-slate-600 ml-3 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl cursor-text"
          onClick={() => setOpen(true)}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search and select an opportunity..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      )}

      {open && !selected && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">No opportunities found</div>
          ) : (
            <ul className="max-h-64 overflow-auto divide-y divide-slate-50">
              {filtered.map((opp) => (
                <li key={opp.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opp)}
                    className="w-full text-left px-4 py-3 hover:bg-pink-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{opp.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {opp.organization || opp.company || "—"}
                      {opp.category && ` · ${opp.category}`}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [oppId, setOppId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, opps] = await Promise.all([
        fetchApi("/applications/"),
        fetchApi("/opportunities/?limit=200"),
      ]);
      setApplications(apps || []);
      setOpportunities(opps || []);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppId) return;
    setSubmitting(true);
    setError("");
    setSubmitSuccess(false);
    try {
      await fetchApi("/applications/", {
        method: "POST",
        body: JSON.stringify({ opportunity_id: oppId, notes }),
      });
      setSubmitSuccess(true);
      setOppId("");
      setNotes("");
      loadData();
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    setUpdatingId(appId);
    try {
      await fetchApi(`/applications/${appId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err: any) {
      setError("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats
  const statusCounts = applications.reduce<Record<string, number>>((acc, a) => {
    const s = (a.status || "Applied").toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const oppMap = Object.fromEntries(opportunities.map((o) => [o.id, o]));

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Your <span className="gradient-text">Applications</span>
        </h1>
        <p className="text-slate-500 mt-2">Track the roles you have applied for.</p>
      </div>

      {/* Stats bar */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: applications.length, color: "text-slate-700 bg-white" },
            { label: "Interview", value: statusCounts["interview"] || 0, color: "text-violet-700 bg-violet-50" },
            { label: "Offer", value: statusCounts["offer"] || 0, color: "text-emerald-700 bg-emerald-50" },
            { label: "Rejected", value: statusCounts["rejected"] || 0, color: "text-red-600 bg-red-50" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl px-4 py-3 border border-black/5 shadow-sm ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-400" />
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-pink-500" />
          Submit New Application
        </h2>

        {submitSuccess && (
          <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Application submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Select Opportunity <span className="text-pink-500">*</span>
            </label>
            <OpportunityPicker
              opportunities={opportunities}
              value={oppId}
              onChange={(id) => setOppId(id)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input-base resize-none"
              placeholder="Anything to note about this application..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !oppId}
            className="btn-primary"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Submit Application
              </>
            )}
          </button>
        </form>
      </div>

      {/* Applications List */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-400" />
          Application History
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 flex gap-4 items-center">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton w-2/3 h-4 rounded" />
                  <div className="skeleton w-1/3 h-3 rounded" />
                </div>
                <div className="skeleton w-20 h-7 rounded-full" />
              </div>
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => {
              const opp = oppMap[app.opportunity_id];
              return (
                <div
                  key={app.id}
                  className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4.5 h-4.5 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">
                        {opp?.title || `Opportunity ID: ${app.opportunity_id}`}
                      </h4>
                      {opp?.organization || opp?.company ? (
                        <p className="text-xs text-slate-400 mt-0.5">{opp.organization || opp.company}</p>
                      ) : null}
                      {app.notes && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">"{app.notes}"</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {app.created_at
                          ? new Date(app.created_at).toLocaleString()
                          : "Unknown date"}
                      </div>
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div className="shrink-0 flex items-center gap-2">
                    {updatingId === app.id ? (
                      <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    <select
                      value={app.status || "Applied"}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      disabled={updatingId === app.id}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer appearance-none ${getStatusStyle(app.status)} focus:outline-none`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClipboardList className="w-6 h-6 text-pink-300" />
            </div>
            <p className="font-semibold text-slate-600">No applications yet</p>
            <p className="text-slate-400 text-sm mt-1">Submit your first application above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
