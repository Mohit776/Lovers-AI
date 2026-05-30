"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import {
  Settings, RefreshCw, AlertCircle, CheckCircle2,
  Zap, SkipForward, XCircle, Activity, History, Wifi, WifiOff,
} from "lucide-react";

type CrawlResult = {
  message: string;
  urls_found: number;
  urls_added: number;
  urls_skipped: number;
  urls_error: number;
};

type CrawlLog = {
  id: string;
  started_at: string;
  finished_at: string;
  urls_found: number;
  urls_success: number;
  urls_skipped: number;
  urls_error: number;
};

type BackendStatus = "checking" | "online" | "offline";

function StatBar({
  label, value, total, color,
}: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="font-semibold text-slate-700">{value} <span className="text-slate-400">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [crawling, setCrawling] = useState(false);
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<CrawlLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");

  // Check backend connectivity
  useEffect(() => {
    fetchApi("/")
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  // Load crawl logs
  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const data = await fetchApi("/admin/crawl-logs?limit=5");
      if (Array.isArray(data)) setLogs(data);
    } catch {
      // crawl_logs table may not exist yet — ignore silently
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const handleCrawl = async () => {
    setCrawling(true);
    setError("");
    setResult(null);
    try {
      const data = await fetchApi("/admin/crawl", { method: "POST" });
      setResult(data);
      loadLogs(); // Refresh logs after crawl
    } catch (err: any) {
      setError(err.message || "Failed to run crawler");
    } finally {
      setCrawling(false);
    }
  };

  const duration = (log: CrawlLog) => {
    const ms = new Date(log.finished_at).getTime() - new Date(log.started_at).getTime();
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-500 mt-2">Manage background tasks and monitor the platform.</p>
        </div>

        {/* Backend status pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            backendStatus === "online"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : backendStatus === "offline"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-slate-50 text-slate-500 border-slate-100"
          }`}
        >
          {backendStatus === "online" ? (
            <><Wifi className="w-3 h-3" /> Backend Online</>
          ) : backendStatus === "offline" ? (
            <><WifiOff className="w-3 h-3" /> Backend Offline</>
          ) : (
            <><div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> Checking...</>
          )}
        </div>
      </div>

      {/* Crawler Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200 shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Web Crawler</h2>
            <p className="text-slate-500 text-sm mt-1">
              Discover and process new opportunities from all configured sources.
              This may take several minutes.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="font-bold text-emerald-800">Crawl completed!</p>
            </div>
            <div className="space-y-3">
              <StatBar
                label="Added"
                value={result.urls_added}
                total={result.urls_found}
                color="bg-emerald-400"
              />
              <StatBar
                label="Skipped (duplicates)"
                value={result.urls_skipped}
                total={result.urls_found}
                color="bg-amber-400"
              />
              <StatBar
                label="Errors"
                value={result.urls_error}
                total={result.urls_found}
                color="bg-red-400"
              />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: "Found", value: result.urls_found, icon: <Zap className="w-3.5 h-3.5" />, color: "text-blue-600" },
                { label: "Added", value: result.urls_added, icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-emerald-600" },
                { label: "Skipped", value: result.urls_skipped, icon: <SkipForward className="w-3.5 h-3.5" />, color: "text-amber-600" },
                { label: "Errors", value: result.urls_error, icon: <XCircle className="w-3.5 h-3.5" />, color: "text-red-500" },
              ].map((s) => (
                <div key={s.label} className="text-center bg-white rounded-xl p-3 border border-black/5">
                  <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                  <p className="text-xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleCrawl}
          disabled={crawling}
          className="btn-primary"
        >
          {crawling ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Crawling in progress...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Run Web Crawler
            </>
          )}
        </button>
      </div>

      {/* Crawl History */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-slate-400" />
          Crawl History
        </h2>

        {logsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(log.started_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Duration: {duration(log)} · Found {log.urls_found} URLs
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium">
                    +{log.urls_success}
                  </span>
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium">
                    ↷{log.urls_skipped}
                  </span>
                  {log.urls_error > 0 && (
                    <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full font-medium">
                      ✕{log.urls_error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No crawl history yet. Run the crawler above.
          </div>
        )}
      </div>
    </div>
  );
}
