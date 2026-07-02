import { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertCircle,
  Loader,
  Trophy,
  CheckCircle2,
  XCircle,
  Lock,
  TrendingDown,
  Globe,
  Calendar,
  Target,
  DollarSign,
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

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], {
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
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function PreviousResults() {
  useSEO({
    title: "Prediction Results - ScorePredicted | Win/Loss Tracker",
    description:
      "View all previous football prediction results on ScorePredicted. Track wins, losses, and overall success rate with our transparent prediction history.",
    keywords:
      "prediction results, football tips results, sports betting results, prediction history, win rate tracker",
    canonicalUrl: "https://dailyfreepredictions.hyper.co.ke/",
  });

  const [matches, setMatches] = useState<HistoryMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
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
      // Remove reference params from URL so a reload doesn't re-verify
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
      // newest first
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

  const filtered = matches.filter((m) => {
    if (filter === "won") return m.tip_successful === true;
    if (filter === "lost") return m.tip_successful === false;
    return true;
  });

  const won = matches.filter((m) => m.tip_successful === true).length;
  const lost = matches.filter((m) => m.tip_successful === false).length;
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
                className="px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg"
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
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                History
              </Link>
            </nav>

            <div className="flex-shrink-0">
              <span className="text-xs text-slate-500">
                {matches.length} results
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Previous Results
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Prediction Results
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Every tip we've ever published — full match details, odds, results
            and profit/loss. 100% transparent.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-primary animate-spin mr-3" />
            <p className="text-slate-600">Loading results…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">
                Error loading results
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Total
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {matches.length}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  All-time predictions
                </p>
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
                  Win rate {winRate}%
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

            {/* Win-rate bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Overall Win Rate
                </span>
                <span className="text-sm font-bold text-primary">
                  {winRate}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
                  style={{ width: `${winRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{won} won</span>
                <span>{lost} lost</span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(["all", "won", "lost"] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === f
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-primary"
                  }`}
                >
                  {f === "all"
                    ? `All (${matches.length})`
                    : f === "won"
                      ? `Won (${won})`
                      : `Lost (${lost})`}
                </button>
              ))}
            </div>

            {/* Match Cards */}
            <div className="space-y-3">
              {filtered.map((match, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isSubscribed
                      ? `cursor-pointer ${match.tip_successful ? "bg-green-50 border-green-200 hover:border-green-400" : "bg-red-50 border-red-200 hover:border-red-400"}`
                      : "bg-white border-slate-200"
                  }`}
                  onClick={() =>
                    isSubscribed && setExpanded(expanded === idx ? null : idx)
                  }
                >
                  {/* Card body */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left — always visible */}
                      <div className="flex-1 min-w-0">
                        {/* League + date */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
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

                        {/* Teams */}
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

                      {/* Right — badge */}
                      <div className="flex-shrink-0">
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
                      </div>
                    </div>

                    {/* Premium row */}
                    {isSubscribed ? (
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
                          <p className="text-xs text-slate-500 mb-1">Profit</p>
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

                    {/* Expanded — extra detail for subscribers */}
                    {isSubscribed && expanded === idx && (
                      <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Sport</span>
                            <span className="font-medium text-slate-900">
                              {match.sport}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Fair Odd</span>
                            <span className="font-medium text-slate-900">
                              {match.fair_odd?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Country</span>
                            <span className="font-medium text-slate-900">
                              {match.country}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">League</span>
                            <span className="font-medium text-slate-900">
                              {match.league}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 text-center">
                          Click card to collapse
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  No {filter} results
                </h3>
                <button
                  onClick={() => setFilter("all")}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm mt-2"
                >
                  View All
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
                    to="/predictions"
                    className="hover:text-primary transition-colors"
                  >
                    Today's Picks
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
