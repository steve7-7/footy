import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  AlertCircle,
  Loader,
  History,
  CheckCircle2,
  XCircle,
  Lock,
  TrendingDown,
  Globe,
  Calendar,
  Target,
  DollarSign,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { getAuthToken, setAuthToken, clearAuthToken } from "@/utils/auth";
import {
  PAYSTACK_REFERENCE_PARAMS,
  goToSubscriptionLanding,
} from "@/utils/subscription";

interface HistoryMatch {
  match_dat: string;
  sport: string;
  country: string;
  league: string;
  home_team: string;
  away_team: string;
  tip: string;
  fair_odd: number;
  tip_odd: number;
  result: string;
  tip_successful: boolean;
  tip_profit: number;
}

type FilterStatus = "all" | "won" | "lost";

const PAGE_SIZE = 50;

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PastPredictions() {
  useSEO({
    title: "Prediction History - ScorePredicted | Past Football Tips & Results",
    description:
      "Browse the complete history of football predictions with match details, odds, and outcomes. Filter by won, lost, or pending predictions.",
    keywords:
      "past predictions, football tips history, previous predictions, betting history, prediction archive",
    canonicalUrl: "https://dailyfreepredictions.hyper.co.ke/past-predictions",
  });

  const [matches, setMatches] = useState<HistoryMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const verifySubscriptionPayment = async (reference: string) => {
    try {
      setAuthLoading(true);
      setError(null);
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      if (!response.ok)
        throw new Error("Unable to verify your Paystack payment");
      const data = await response.json();
      setAuthToken(data.token);
      setIsSubscribed(data.isSubscribed);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      clearAuthToken();
      setIsSubscribed(false);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify subscription payment",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/auth", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    } catch {
      setIsSubscribed(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubscribe = () => {
    goToSubscriptionLanding();
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      // Send token so server can return full data for subscribers
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/betigolo-history", { headers });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data: HistoryMatch[] = await res.json();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.match_dat).getTime() - new Date(a.match_dat).getTime(),
      );
      setMatches(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const returnedReference = PAYSTACK_REFERENCE_PARAMS.map((p) =>
      searchParams.get(p),
    ).find((v): v is string => !!v);

    if (returnedReference) {
      verifySubscriptionPayment(returnedReference);
    } else {
      checkAuth();
    }

    fetchHistory();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setExpanded(null);
  }, [filter, search, leagueFilter]);

  const leagues = useMemo(() => {
    const set = new Set(matches.map((m) => m.league));
    return ["all", ...Array.from(set).sort()];
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (filter === "won" && !m.tip_successful) return false;
      if (filter === "lost" && m.tip_successful) return false;
      if (leagueFilter !== "all" && m.league !== leagueFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.home_team.toLowerCase().includes(q) ||
          m.away_team.toLowerCase().includes(q) ||
          m.league.toLowerCase().includes(q) ||
          m.country.toLowerCase().includes(q) ||
          m.tip.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [matches, filter, leagueFilter, search]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const won = matches.filter((m) => m.tip_successful).length;
  const lost = matches.filter((m) => !m.tip_successful).length;
  const winRate =
    won + lost > 0 ? ((won / (won + lost)) * 100).toFixed(1) : "0";
  const totalProfit = matches.reduce((s, m) => s + (m.tip_profit ?? 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-14">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo to-hot-pink flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  ScorePredicted
                </h1>
                <p className="text-xs text-slate-500">Predictions</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-4 flex-1 justify-center">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Results
              </Link>
              <Link
                to="/predictions"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Today
              </Link>
              <Link
                to="/stats"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Stats
              </Link>
              <Link
                to="/past-predictions"
                className="px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg"
              >
                History
              </Link>
            </nav>

            <div className="flex-shrink-0">
              <span className="text-xs text-slate-500">
                {filtered.length} matches
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <History className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Full History
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Prediction History
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            {matches.length.toLocaleString()} predictions published. Search,
            filter by result or league, and see every detail.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-primary animate-spin mr-3" />
            <p className="text-slate-600">Loading history…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">
                Error loading history
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchHistory}
                className="text-sm text-red-600 underline mt-2"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Total
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {matches.length.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">All predictions</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                    Won
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-900">{won}</div>
                <p className="text-xs text-green-600 mt-1">
                  {winRate}% win rate
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                    Lost
                  </span>
                </div>
                <div className="text-3xl font-bold text-red-900">{lost}</div>
                <p className="text-xs text-red-500 mt-1">Failed tips</p>
              </div>

              <div
                className={`${totalProfit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"} border rounded-xl p-5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign
                    className={`w-4 h-4 ${totalProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}
                  />
                  <span
                    className={`text-xs font-medium uppercase tracking-wide ${totalProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}
                  >
                    Profit
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${totalProfit >= 0 ? "text-emerald-900" : "text-red-900"}`}
                >
                  {totalProfit >= 0 ? "+" : ""}
                  {totalProfit.toFixed(1)}u
                </div>
                <p
                  className={`text-xs mt-1 ${totalProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  Total units
                </p>
              </div>
            </div>

            {/* Filters bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team, league, country or tip…"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Result filters */}
                {(["all", "won", "lost"] as FilterStatus[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                      filter === f
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f === "all"
                      ? `All (${matches.length})`
                      : f === "won"
                        ? `Won (${won})`
                        : `Lost (${lost})`}
                  </button>
                ))}

                {/* League dropdown */}
                <select
                  value={leagueFilter}
                  onChange={(e) => setLeagueFilter(e.target.value)}
                  className="ml-auto px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary max-w-[220px]"
                >
                  <option value="all">All Leagues</option>
                  {leagues.slice(1).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {(search || leagueFilter !== "all" || filter !== "all") && (
                <p className="text-xs text-slate-500">
                  Showing {filtered.length.toLocaleString()} of{" "}
                  {matches.length.toLocaleString()} predictions
                  <button
                    onClick={() => {
                      setSearch("");
                      setLeagueFilter("all");
                      setFilter("all");
                    }}
                    className="ml-2 text-primary underline"
                  >
                    Clear filters
                  </button>
                </p>
              )}
            </div>

            {/* Match list */}
            <div className="space-y-3">
              {paginated.map((match, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isSubscribed
                      ? `cursor-pointer ${
                          match.tip_successful
                            ? "bg-green-50 border-green-200 hover:border-green-400"
                            : "bg-red-50 border-red-200 hover:border-red-400"
                        }`
                      : "bg-white border-slate-200"
                  }`}
                  onClick={() =>
                    isSubscribed && setExpanded(expanded === idx ? null : idx)
                  }
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Always-visible */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            <Globe className="w-3.5 h-3.5" />
                            {match.country} · {match.league}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(match.match_dat)}{" "}
                            {formatTime(match.match_dat)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-slate-900 truncate">
                            {match.home_team}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 flex-shrink-0">
                            vs
                          </span>
                          <span className="text-base font-bold text-slate-900 truncate">
                            {match.away_team}
                          </span>
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {isSubscribed ? (
                          match.tip_successful ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-900 rounded-full">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-bold">Won</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-900 rounded-full">
                              <XCircle className="w-4 h-4" />
                              <span className="text-xs font-bold">Lost</span>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-500 rounded-full">
                            <Lock className="w-3 h-3" />
                            <span className="text-xs font-medium">Premium</span>
                          </div>
                        )}
                        {isSubscribed &&
                          (expanded === idx ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ))}
                      </div>
                    </div>

                    {/* Premium content */}
                    {isSubscribed ? (
                      <>
                        <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-white/70 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Tip</p>
                            <p className="text-sm font-bold text-primary leading-tight">
                              {match.tip}
                            </p>
                          </div>
                          <div className="bg-white/70 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">
                              Tip Odds
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                              {match.tip_odd?.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-white/70 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Score</p>
                            <p className="text-sm font-bold text-slate-900">
                              {match.result}
                            </p>
                          </div>
                          <div
                            className={`rounded-lg p-3 border ${match.tip_profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                          >
                            <p className="text-xs text-slate-500 mb-1">
                              Profit
                            </p>
                            <div className="flex items-center gap-1">
                              {match.tip_profit >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                              )}
                              <p
                                className={`text-sm font-bold ${match.tip_profit >= 0 ? "text-green-700" : "text-red-700"}`}
                              >
                                {match.tip_profit >= 0 ? "+" : ""}
                                {match.tip_profit?.toFixed(1)}u
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {expanded === idx && (
                          <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
                            <div className="grid sm:grid-cols-3 gap-3 text-sm">
                              <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">
                                  Sport
                                </p>
                                <p className="font-semibold text-slate-900">
                                  {match.sport}
                                </p>
                              </div>
                              <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">
                                  Fair Odd
                                </p>
                                <p className="font-semibold text-slate-900">
                                  {match.fair_odd?.toFixed(2)}
                                </p>
                              </div>
                              <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">
                                  Value Edge
                                </p>
                                <p
                                  className={`font-semibold ${match.tip_odd > match.fair_odd ? "text-green-700" : "text-slate-700"}`}
                                >
                                  {match.tip_odd > match.fair_odd
                                    ? `+${((match.tip_odd / match.fair_odd - 1) * 100).toFixed(1)}%`
                                    : "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          Subscribe to see tip, odds, score &amp; profit
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscribe();
                          }}
                          className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                        >
                          Subscribe
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 bg-white border-2 border-primary/30 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors"
                >
                  Load more ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}

            {/* Empty */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  No matches found
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setLeagueFilter("all");
                    setFilter("all");
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Results
                  </Link>
                </li>
                <li>
                  <Link
                    to="/past-predictions"
                    className="hover:text-primary transition-colors"
                  >
                    History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stats"
                    className="hover:text-primary transition-colors"
                  >
                    Stats
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8">
            <p className="text-center text-sm text-slate-600">
              © 2026 ScorePredicted. All predictions are for entertainment
              purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
