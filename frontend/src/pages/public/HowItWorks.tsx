import { ArrowRight, Compass, GitBranch, Lightbulb, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer'

const steps = [
  {
    icon: Compass,
    title: 'Share your intent',
    body: 'Describe a goal in natural language. Intent Compass identifies the people, topics and constraints relevant to your discovery request.',
  },
  {
    icon: GitBranch,
    title: 'Explore the knowledge graph',
    body: 'People, skills, research themes, projects, departments and opportunities become meaningful connections. Neo4j is the intended graph technology for these relationships.',
  },
  {
    icon: Lightbulb,
    title: 'Understand why it matches',
    body: 'Recommendations are designed to show available evidence, such as a related topic, complementary skill or shared project path.',
  },
  {
    icon: Users,
    title: 'Connect and build',
    body: 'Explore appropriate profiles and opportunities. Requests and collaboration actions depend on the features available to your account.',
  },
]

const primaryCtaClassName =
  'rounded-full bg-violet px-6 py-3 font-semibold text-white-surface transition hover:bg-violet-hover active:bg-violet-active active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-surface focus-visible:ring-2 focus-visible:ring-violet'

export default function HowItWorks() {
  return (
    <>
      <main>
        <section className="bg-forest-green px-5 py-20 text-white-surface sm:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-buttermilk">
              How Everlink works
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
              Your next opportunity is already connected to someone in your ecosystem.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white-surface/85">
              Tell Everlink what you want to achieve. It connects your intent to relevant people,
              research, skills, projects, and opportunities across your university community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/explore"
                className="rounded-full bg-buttermilk px-6 py-3 font-semibold text-ink transition hover:bg-white-surface active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-surface"
              >
                Explore the Network
              </Link>
              <Link to="/join/student" className={primaryCtaClassName}>
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="relative rounded-2xl border border-forest-green/15 p-6"
              >
                <span className="text-sm font-bold text-midnight-blue">0{index + 1}</span>
                <step.icon className="mt-4 text-forest-green" size={28} />
                <h2 className="mt-4 font-display text-xl font-bold text-forest-green">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-cream-surface px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-widest text-midnight-blue">
              A connected path
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-forest-green">
              From a healthcare AI goal to a collaborative opportunity.
            </h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-ink/75">
              A student exploring a computer-vision accessibility solution can follow related
              research themes to faculty expertise, discover seniors or alumni with relevant
              implementation experience, and identify classmates with complementary
              machine-learning, frontend, or data skills. The value is in the chain of
              connections—not isolated profile cards.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {['Student goal', 'Research themes', 'Relevant people', 'Project pathway'].map(
                (label, index) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white-surface p-4 text-center font-semibold text-forest-green"
                  >
                    {label}
                    {index < 3 && (
                      <ArrowRight
                        className="mx-auto mt-2 hidden text-teal sm:block"
                        size={18}
                      />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="bg-midnight-blue px-5 py-20 text-center text-white-surface sm:px-8">
          <h2 className="font-display text-3xl font-extrabold">
            Start with a goal. Discover the connections.
          </h2>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              to="/join/student"
              className="rounded-full bg-buttermilk px-6 py-3 font-semibold text-ink transition hover:bg-white-surface active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-surface"
            >
              Create Your Account
            </Link>
            <Link
              to="/explore"
              className="rounded-full border border-white-surface/70 px-6 py-3 font-semibold text-white-surface transition hover:bg-white-surface hover:text-midnight-blue active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-surface"
            >
              Discover the Network
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
