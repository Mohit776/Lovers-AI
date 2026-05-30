"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import {
  Search, MapPin, Briefcase, ExternalLink, Calendar,
  Globe, GraduationCap, Heart, Tag, X, SlidersHorizontal, Flame,
} from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  organization?: string;
  company?: string;
  location?: string;
  country?: string;
  url?: string;
  source_url?: string;
  source?: string;
  created_at?: string;
  deadline?: string;
  category?: string;
  women_friendly?: boolean;
  student_eligible?: boolean;
  indian_eligible?: boolean;
  funding_amount?: string;
  tags?: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  scholarship: "from-violet-500 to-purple-600",
  fellowship: "from-blue-500 to-cyan-500",
  grant: "from-emerald-500 to-teal-500",
  internship: "from-orange-500 to-amber-500",
  job: "from-slate-600 to-slate-800",
  competition: "from-pink-500 to-rose-500",
  conference: "from-indigo-500 to-blue-600",
  default: "from-pink-500 to-rose-500",
};

function getCategoryGradient(category?: string) {
  if (!category) return CATEGORY_COLORS.default;
  const key = category.toLowerCase();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
}

function getDeadlineStatus(deadline?: string) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Expired", cls: "badge-deadline-soon" };
  if (days <= 14) return { label: `${days}d left`, cls: "badge-deadline-soon" };
  if (days <= 60) return { label: `${days}d left`, cls: "badge-deadline-ok" };
  return { label: new Date(deadline).toLocaleDateString(), cls: "badge-deadline-neutral" };
}

function SkeletonCard() {
  return (
    <div className="opp-card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton w-3/4 h-5 rounded" />
        <div className="skeleton w-1/2 h-4 rounded" />
      </div>
      <div className="space-y-2 mt-2">
        <div className="skeleton w-2/3 h-3.5 rounded" />
        <div className="skeleton w-1/2 h-3.5 rounded" />
      </div>
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="skeleton w-full h-9 rounded-xl" />
      </div>
    </div>
  );
}

type ActiveFilters = {
  women_friendly: boolean;
  student_eligible: boolean;
  indian_eligible: boolean;
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    women_friendly: false,
    student_eligible: false,
    indian_eligible: false,
  });
  const [stats, setStats] = useState<{ total: number; categories: Record<string, number> } | null>(null);

  const loadData = useCallback(async (query = "", filters = activeFilters) => {
    setLoading(true);
    setError("");
    try {
      let data: Opportunity[];
      if (query) {
        data = await fetchApi(`/search/?q=${encodeURIComponent(query)}`);
      } else {
        const params = new URLSearchParams({ limit: "100" });
        if (filters.women_friendly) params.set("women_friendly", "true");
        if (filters.student_eligible) params.set("student_eligible", "true");
        if (filters.indian_eligible) params.set("indian_eligible", "true");
        data = await fetchApi(`/opportunities/?${params.toString()}`);
      }
      setOpportunities(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  // Load stats once
  useEffect(() => {
    fetchApi("/opportunities/stats").then(setStats).catch(() => {});
  }, []);

  // Debounce search + filter changes
  useEffect(() => {
    const timer = setTimeout(() => loadData(searchQuery, activeFilters), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters]);

  const toggleFilter = (key: keyof ActiveFilters) => {
    setActiveFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  const hasActiveFilter = Object.values(activeFilters).some(Boolean);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Explore{" "}
            <span className="gradient-text">Opportunities</span>
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Curated scholarships, fellowships & grants — discovered by AI.
          </p>
        </div>
        {stats && (
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
            <Flame className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-slate-700">{stats.total.toLocaleString()}</span>
            <span className="text-sm text-slate-400">opportunities</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search roles, companies, or locations..."
          className="input-base pl-12 py-4 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-slate-400 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Filter:</span>
        </div>
        <button
          onClick={() => toggleFilter("women_friendly")}
          className={`filter-chip ${activeFilters.women_friendly ? "active" : ""}`}
        >
          <Heart className="w-3 h-3" />
          Women Friendly
        </button>
        <button
          onClick={() => toggleFilter("student_eligible")}
          className={`filter-chip ${activeFilters.student_eligible ? "active" : ""}`}
        >
          <GraduationCap className="w-3 h-3" />
          Students
        </button>
        <button
          onClick={() => toggleFilter("indian_eligible")}
          className={`filter-chip ${activeFilters.indian_eligible ? "active" : ""}`}
        >
          <Globe className="w-3 h-3" />
          India Eligible
        </button>
        {hasActiveFilter && (
          <button
            onClick={() => setActiveFilters({ women_friendly: false, student_eligible: false, indian_eligible: false })}
            className="text-xs text-slate-400 hover:text-pink-500 flex items-center gap-1 ml-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <p className="text-sm text-slate-400">
          Showing <span className="font-semibold text-slate-600">{opportunities.length}</span> opportunities
          {hasActiveFilter || searchQuery ? " (filtered)" : ""}
        </p>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, idx) => {
            const name = opp.title || "Untitled Opportunity";
            const org = opp.organization || opp.company || "—";
            const loc = opp.location || opp.country;
            const link = opp.url || opp.source_url;
            const deadline = getDeadlineStatus(opp.deadline);
            const gradient = getCategoryGradient(opp.category);

            return (
              <div
                key={opp.id}
                className="opp-card p-6 flex flex-col"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Card top */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {opp.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {opp.category}
                      </span>
                    )}
                    {deadline && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${deadline.cls}`}>
                        {deadline.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3
                    className="text-base font-semibold text-slate-800 leading-snug line-clamp-2 mb-1"
                    title={name}
                  >
                    {name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-3">{org}</p>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    {loc && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{loc}</span>
                      </div>
                    )}
                    {opp.deadline && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {opp.funding_amount && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold text-xs">$</span>
                        <span>{opp.funding_amount}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {opp.tags && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <Tag className="w-3 h-3 text-slate-300" />
                      {opp.tags.split(",").slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Eligibility badges */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {opp.women_friendly && (
                      <span className="text-[10px] font-medium bg-pink-50 text-pink-600 border border-pink-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5" /> Women
                      </span>
                    )}
                    {opp.student_eligible && (
                      <span className="text-[10px] font-medium bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <GraduationCap className="w-2.5 h-2.5" /> Students
                      </span>
                    )}
                    {opp.indian_eligible && (
                      <span className="text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" /> India
                      </span>
                    )}
                  </div>
                </div>

                {/* Apply button */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 transition-opacity shadow-sm shadow-pink-200"
                    >
                      Apply Now
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="flex items-center justify-center w-full py-2.5 text-sm text-slate-400">
                      No link available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-pink-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No opportunities found</h3>
          <p className="text-slate-400 mt-1 text-sm">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
