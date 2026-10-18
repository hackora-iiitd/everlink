import { Link } from 'react-router-dom'
import Logo from './Logo'

const columns = [
  {
    title: 'Product',
    links: [
      { to: '/how-it-works', label: 'How It Works' },
      { to: '/features', label: 'Features' },
      { to: '/explore', label: 'Explore the Network' },
    ],
  },
  {
    title: 'Join as',
    links: [
      { to: '/join/student', label: 'Student' },
      { to: '/join/alumni', label: 'Alumni / Senior' },
      { to: '/join/professor', label: 'Professor' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/about', label: 'About & Help' },
      { to: '/about#faq', label: 'FAQs' },
      { to: '/about#privacy', label: 'Privacy Policy' },
      { to: '/about#terms', label: 'Terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#0B3304] text-white-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white-surface/70">
            One connected network for students, alumni, professors, research and ventures.
            Connections that last forever.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-buttermilk">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[0.95rem] text-white-surface/75 transition-colors hover:text-white-surface"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white-surface/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-sm text-white-surface/55 sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Everlink. Built by Team Hackora, IGDTUW.</p>
          <p>Connect with your Everlink community.</p>
        </div>
      </div>
    </footer>
  )
}
