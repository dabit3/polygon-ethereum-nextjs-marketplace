import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">TickETH</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-blue-500">
              Sell Tickets
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-blue-500">
              My Tickets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-blue-500">
              Creator Dashboard
            </a>
          </Link>
          <Link href="/about">
            <a className="mr-6 text-blue-500">
              About Us
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace