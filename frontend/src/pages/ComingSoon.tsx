import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'

/** Temporary stand-in so navbar/footer links never 404 while pages are built one by one. */
export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <main className="grid min-h-[60vh] place-items-center bg-cream-surface px-5 py-20 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-teal">Coming up next</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-midnight-blue">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-ink/75">This page is still on the build list.</p>
          <Link
            to="/"
            className="mt-7 inline-block rounded-full bg-forest-green px-6 py-3 font-semibold text-white-surface hover:bg-midnight-blue"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
