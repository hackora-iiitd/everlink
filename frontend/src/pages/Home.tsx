import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  FlaskConical,
  GraduationCap,
  Handshake,
  Layers,
  Network,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
  UserSearch,
  Users,
} from 'lucide-react'
import NetworkVisual from '../components/home/NetworkVisual'
import Footer from '../components/layout/Footer'

const painPoints = [
  {
    icon: UserSearch,
    title: 'Guidance is hard to find',
    body: 'Students struggle to find the right seniors for specific guidance or referrals.',
  },
  {
    icon: FlaskConical,
    title: 'Research stays out of reach',
    body: 'Research interests and professor profiles are hard to connect with student goals.',
  },
  {
    icon: Users,
    title: 'Teams take too long to build',
    body: 'Finding complementary teammates for hackathons and startups takes time.',
  },
  {
    icon: Layers,
    title: 'Opportunities are scattered',
    body: 'Achievements, internships and opportunities are spread across platforms.',
  },
]

const features = [
  {
    n: '01',
    icon: Compass,
    name: 'Intent Compass',
    body: 'Say what you want to achieve. Get ranked matches, each with the evidence for why it fits you.',
    tone: 'bg-forest-green text-white-surface',
  },
  {
    n: '02',
    icon: FlaskConical,
    name: 'Research Bridge',
    body: 'Find professors and projects that match your skills and curiosity, and see what you need before you apply.',
    tone: 'bg-forest-green text-white-surface',
  },
  {
    n: '03',
    icon: GraduationCap,
    name: 'Senior Success Hub',
    body: 'Learn from seniors who have walked your path. Browse their internships and achievements, then ask for guidance.',
    tone: 'bg-forest-green text-buttermilk',
  },
  {
    n: '04',
    icon: Handshake,
    name: 'Alumni Connect',
    body: 'Stay close to batchmates working in industry, build peer networks and show up for reunions.',
    tone: 'bg-forest-green text-white-surface',
  },
  {
    n: '05',
    icon: Rocket,
    name: 'Venture Forge',
    body: 'Build hackathon and startup teams around complementary skills, not people who know the same things as you.',
    tone: 'bg-forest-green text-white-surface',
  },
  {
    n: '06',
    icon: TrendingUp,
    name: 'Ecosystem Pulse',
    body: 'See which skills are in demand, where the gaps are and which research interests are emerging.',
    tone: 'bg-forest-green text-white-surface',
  },
]

const heroPoints = [
  { label: 'mentors', rest: 'Discover relevant ' },
  { label: 'opportunities', rest: 'Find research and career ' },
  { label: 'teams', rest: 'Build complementary ' },
  { label: 'industry', rest: 'Find batchmates in ' },
]

export default function Home() {
  return (
    <>
      <main>
        {/* ───────────── Hero ───────────── */}
        <section className="relative overflow-hidden bg-forest-green">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'radial-gradient(#DCF6F426 1.2px, transparent 1.2px)',
              backgroundSize: '26px 26px',
            }}
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white-surface/25 bg-white-surface/10 px-3.5 py-1.5 text-sm font-semibold text-white-surface">
                <Sparkles size={15} className="text-buttermilk" />
                Connections that last forever
              </span>

              <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white-surface sm:text-6xl">
                Your Next Opportunity Starts With the{' '}
                <span className="relative isolate whitespace-nowrap text-buttermilk">
                  Right Connection.
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-sm bg-white-surface/15"
                  />
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white-surface/80">
                Everlink brings students, alumni, professors, research and ventures into one connected
                network, and tells you <strong className="text-white-surface">why</strong> each person or project is
                relevant to your goal.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/join/student"
                  className="inline-flex items-center gap-2 rounded-full bg-buttermilk px-7 py-3.5 font-semibold text-ink shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white-surface"
                >
                  Find My Connections
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white-surface/70 px-7 py-3.5 font-semibold text-white-surface transition hover:bg-white-surface hover:text-forest-green"
                >
                  Explore the Network
                </Link>
              </div>

              <ul className="mt-10 grid gap-2.5 border-l-4 border-buttermilk pl-4 text-[1.02rem] text-white-surface/85 sm:grid-cols-2">
                {heroPoints.map((p) => (
                  <li key={p.label}>
                    {p.rest}
                    <strong className="text-buttermilk">{p.label}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-float-slow">
              <NetworkVisual />
            </div>
          </div>
        </section>

        {/* ───────────── Match preview ───────────── */}
        <section className="bg-white-surface py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-teal">See it in action</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-forest-green sm:text-4xl">
                Tell us your goal. See who fits, and why.
              </h2>
            </div>

            {/* intent bar (illustrative) */}
            <div className="mx-auto mt-9 max-w-2xl">
              <div className="flex items-center gap-3 rounded-full border-2 border-forest-green bg-white-surface px-5 py-3.5 shadow-md shadow-forest-green/10">
                <Search size={20} className="shrink-0 text-teal" />
                <span className="truncate text-[1.02rem] text-ink">
                  I'm interested in <strong>healthcare AI</strong> and <strong>Python</strong>
                </span>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
              {/* Mentor */}
              <article className="flex flex-col rounded-2xl border border-forest-green/15 bg-white-surface p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cream-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest-green">
                    Recommended mentor
                  </span>
                  <span className="text-xs font-semibold text-ink/50">Sample · demo data</span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-forest-green font-display text-lg font-bold text-white-surface">
                    AS
                  </div>
                  <div>
                    <h3 className="!mb-0 font-display text-xl font-bold text-forest-green">Ananya Sharma</h3>
                    <p className="text-sm text-ink/70">Data Scientist · Batch of '19</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Python', 'Machine learning', 'Healthcare AI'].map((t) => (
                    <span key={t} className="rounded-full bg-cream-surface px-3 py-1 text-xs font-semibold text-ink">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border-l-4 border-buttermilk bg-cream-surface/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal">Why this matches</p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/85">
                    You both have worked on machine learning projects in Python and share an interest in
                    healthcare applications.
                  </p>
                </div>

                <Link
                  to="/join/student"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-forest-green px-5 py-3 text-sm font-semibold text-white-surface transition hover:bg-midnight-blue"
                >
                  Request Mentorship <ArrowRight size={16} />
                </Link>
              </article>

              {/* Research */}
              <article className="flex flex-col rounded-2xl border border-forest-green/15 bg-white-surface p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-buttermilk/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                    Research opportunity
                  </span>
                  <span className="text-xs font-semibold text-ink/50">Sample · demo data</span>
                </div>

                <div className="mt-5 flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest-green text-white-surface">
                    <Network size={26} />
                  </div>
                  <div>
                    <h3 className="!mb-0 font-display text-xl font-bold leading-snug text-forest-green">
                      Graph Neural Networks for Recommender Systems
                    </h3>
                    <p className="mt-1 text-sm text-ink/70">Prof. Mehta · Computer Science</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Graph ML', 'Python', 'Recommenders'].map((t) => (
                    <span key={t} className="rounded-full bg-cream-surface px-3 py-1 text-xs font-semibold text-ink">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border-l-4 border-buttermilk bg-cream-surface/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal">Why this matches</p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/85">
                    Your Python and machine learning skills line up with this project's requirements, and it
                    is open to student collaborators.
                  </p>
                </div>

                <Link
                  to="/join/student"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-2 border-forest-green px-5 py-3 text-sm font-semibold text-forest-green transition hover:bg-cream-surface"
                >
                  View Project <ArrowRight size={16} />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* ───────────── Pain points ───────────── */}
        <section className="bg-cream-surface py-20 text-ink">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-teal">The problem</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-forest-green sm:text-4xl">
                The right connection shouldn't be hard to find.
              </h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {painPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-forest-green/15 bg-white-surface p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-forest-green/10"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-forest-green text-buttermilk">
                    <p.icon size={24} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-forest-green">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">{p.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-forest-green p-7 text-white-surface sm:flex sm:items-center sm:justify-between sm:gap-8">
              <p className="font-display text-xl font-bold text-buttermilk sm:text-2xl">
                One unified platform connecting all the pieces.
              </p>
              <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-white-surface/85 sm:mt-0">
                Not just a directory. A connected ecosystem that helps you discover <strong>why</strong> a
                person, project or opportunity is relevant.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── Features ───────────── */}
        <section className="bg-white-surface py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-teal">What you get</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-forest-green sm:text-4xl">
                  One platform. Six ways to unlock opportunities.
                </h2>
              </div>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 font-semibold text-forest-green hover:text-midnight-blue"
              >
                See all features <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article
                  key={f.name}
                  className="group relative rounded-2xl border border-forest-green/15 bg-white-surface p-7 transition hover:-translate-y-1 hover:border-forest-green/40 hover:shadow-xl hover:shadow-forest-green/10"
                >
                  <div className="flex items-start justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-xl ${f.tone}`}>
                      <f.icon size={24} />
                    </div>
                    <span className="font-display text-sm font-bold text-ink/30">{f.n}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-forest-green">{f.name}</h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-ink/75">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── Final CTA ───────────── */}
        <section className="bg-forest-green">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white-surface sm:text-5xl">
              Join the network. <span className="text-buttermilk">Your next connection is in it.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white-surface/80">
              Pick the way you want to be part of Everlink. Setting up takes a few minutes.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/join/student"
                className="rounded-full bg-buttermilk px-7 py-3.5 font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white-surface"
              >
                Join as a Student
              </Link>
              <Link
                to="/join/alumni"
                className="rounded-full border-2 border-white-surface/70 px-7 py-3.5 font-semibold text-white-surface transition hover:bg-white-surface hover:text-forest-green"
              >
                Join as Alumni
              </Link>
              <Link
                to="/join/professor"
                className="rounded-full border-2 border-white-surface/70 px-7 py-3.5 font-semibold text-white-surface transition hover:bg-white-surface hover:text-forest-green"
              >
                Join as a Professor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
