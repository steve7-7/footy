import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import {
  TrendingUp,
  CheckCircle2,
  Zap,
  BarChart3,
  History,
  Lock,
  Star,
  Trophy,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { getSubscriptionCheckoutUrl } from "@/utils/subscription";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Daily Expert Predictions",
    description:
      "Get fresh predictions every day for matches across global competitions — Premier League, La Liga, Serie A, Bundesliga and more.",
  },
  {
    icon: Zap,
    title: "Live Odds Across Markets",
    description:
      "Access real-time odds for 1X2, both teams to score, over/under, Asian handicap and many more markets.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track tipster accuracy, ROI, win rates, and profit/loss data so you always bet with informed confidence.",
  },
  {
    icon: History,
    title: "Full Prediction History",
    description:
      "Browse every past prediction with match details, our tip, the actual result, and odds — fully searchable.",
  },
  {
    icon: Trophy,
    title: "Accumulator Builds",
    description:
      "High-value multi-leg accumulator combinations curated daily for maximum potential returns.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Track Record",
    description:
      "We publish every win and every loss. No cherry-picking. Full accountability with real numbers.",
  },
];

const FAQS = [
  {
    q: "How do I access predictions after subscribing?",
    a: "After payment via Paystack you'll be redirected back to the site automatically. Your session is remembered so you won't need to log in again on the same device.",
  },
  {
    q: "What competitions do you cover?",
    a: "We cover 50+ competitions worldwide including Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League and major domestic cups.",
  },
  {
    q: "How many predictions do I get per day?",
    a: "The number varies — typically between 5 and 20 matches depending on the fixture schedule. We only publish picks we have high confidence in.",
  },
  {
    q: "What is your win rate?",
    a: "Our historical win rate is visible on the Stats page for full transparency. We update it in real time after every result.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes. You can cancel any time through Paystack. Your access remains active until the end of the billing period.",
  },
];

export default function Subscribe() {
  useSEO({
    title: "Subscribe - ScorePredicted | Unlock Premium Predictions",
    description:
      "Subscribe to ScorePredicted and unlock daily expert football predictions, live odds, accumulator builds, and full performance analytics.",
    keywords:
      "subscribe predictions, premium football tips, sports betting subscription, daily predictions access",
    canonicalUrl: "https://dailyfreepredictions.hyper.co.ke/subscribe",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = () => {
    window.location.href = getSubscriptionCheckoutUrl();
  };

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

            <nav className="flex items-center gap-1 sm:gap-6 flex-1 justify-center">
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
            </nav>

            <div className="flex-shrink-0">
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center">
          {/* background glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">
              Premium Membership
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-5 leading-tight">
            Unlock Expert
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Football Predictions
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Stop guessing. Get daily expert tips, live odds, and transparent
            performance stats — everything you need to bet smarter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSubscribe}
              className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Get Full Access
            </button>
            <Link
              to="/stats"
              className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 text-lg font-semibold rounded-xl hover:border-primary/40 transition-colors"
            >
              View Our Track Record
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Secure payment via Paystack · Cancel anytime
          </p>
        </section>

        {/* ── Pricing card ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-lg mx-auto">
            <div className="relative bg-white rounded-3xl border-2 border-primary/30 shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary/70" />

              <div className="p-8 sm:p-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  Premium Plan
                </h3>
                <p className="text-slate-500 text-sm mb-8">
                  Full access to every feature on ScorePredicted
                </p>

                {/* What's included */}
                <ul className="space-y-3 mb-10">
                  {[
                    "Daily expert predictions",
                    "Live odds across all markets",
                    "Accumulator builds",
                    "Full prediction history",
                    "Tipster performance analytics",
                    "Transparent win/loss record",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubscribe}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                >
                  Subscribe Now
                </button>

                <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Secure checkout powered by Paystack
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
              {["SSL Encrypted", "Cancel Anytime", "Instant Access"].map(
                (badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 text-sm text-slate-500"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {badge}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── Features grid ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Everything in one subscription
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                All the tools you need to find value and bet with confidence —
                no hidden add-ons.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social proof strip ── */}
        <section className="py-12 px-4 bg-gradient-to-r from-primary via-secondary to-primary/80 text-white text-center">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
            {[
              { stat: "50+", label: "Competitions covered" },
              { stat: "Daily", label: "Fresh predictions" },
              { stat: "100%", label: "Transparent results" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-4xl font-extrabold mb-1">{stat}</div>
                <div className="text-primary-foreground/80 text-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Frequently asked questions
            </h2>

            <div className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-semibold text-slate-900 pr-4">
                      {q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ready to bet smarter?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join ScorePredicted and start getting expert predictions delivered
              fresh every day.
            </p>
            <button
              onClick={handleSubscribe}
              className="px-10 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Get Full Access Now
            </button>
            <p className="mt-4 text-sm text-slate-400">
              Secure payment · Instant access · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link
                    to="/predictions"
                    className="hover:text-primary transition-colors"
                  >
                    Today's Predictions
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
                <li>
                  <Link
                    to="/past-predictions"
                    className="hover:text-primary transition-colors"
                  >
                    History
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
