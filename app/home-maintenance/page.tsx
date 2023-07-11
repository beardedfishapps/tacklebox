import Link from 'next/link'
import Breadcrumbs from '../components/breadcrumbs'

export default function HomeMaintenance() {
  let breadcrumbs = [
    {
      title: 'Home Maintenance',
      href: '/home-maintenance',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="max-w-5xl w-full">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="text-3xl mb-4">Home Maintenance</h1>
        <hr className="mb-4" />
        <p className="mb-4">
          This is a list of apps I have developed to help people maintain their
          homes.
        </p>
        <div className="flex flex-col justify-between lg:mb-0 mb-4">
          <Link
            className="w-fit underline hover:no-underline hover:tracking-wide transition-[letter-spacing]"
            href="/home-maintenance/oil-prices"
          >
            Heating Oil Prices (MA)
          </Link>
          <Link
            className="w-fit underline hover:no-underline hover:tracking-wide transition-[letter-spacing]"
            href="/home-maintenance/lawn-care"
          >
            Lawn Care
          </Link>
          <Link
            className="w-fit underline hover:no-underline hover:tracking-wide transition-[letter-spacing]"
            href="/home-maintenance/pool-care"
          >
            Pool Care
          </Link>
        </div>
      </div>
    </div>
  )
}