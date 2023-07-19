'use client'

import { useState, useEffect } from 'react'
import Loader from '@/app/components/loader'
import ContentSection from '@/app/components/content'
import Message from '@/app/components/message'
import MessageData from '@/app/classes/MessageData'
import Breadcrumbs from '@/app/components/breadcrumbs'
import OilPriceData from '@/app/classes/OilPriceData'

export default function OilPrices() {
  let [data, setData] = useState(new OilPriceData())
  let [state, setState] = useState('')
  let [zone, setZone] = useState('')
  let [message, setMessage] = useState(new MessageData())
  let breadcrumbs = [
    {
      title: 'Home Maintenance',
      href: '/home-maintenance',
    },
    {
      title: 'Heating Oil Prices',
      href: '/home-maintenance/oil-prices',
    },
  ]

  useEffect(() => {
    if (state == '' || zone == '') {
      return
    }

    let m = new MessageData()
    setMessage(new MessageData())

    async function getOilPrices() {
      const res = await fetch(
        '/api/oilprices?state=' + state + '&zone=' + zone,
        {
          cache: 'no-store',
        }
      )

      return res.json()
    }

    async function getData() {
      setData(new OilPriceData())
      let oilPriceData = new OilPriceData()

      try {
        const data = await getOilPrices()

        oilPriceData.price = '$' + data.price
        oilPriceData.company = data.company
        oilPriceData.url = data.url
        oilPriceData.oilPrices = data.allOilPrices

        if (!isDataLoaded) {
          m.message = 'Successfully loaded oil prices for zone: ' + zone
          m.severity = 'success'
          setMessage(m)
          setData(data)
        }
      } catch (error: any) {
        m.message = error
        m.severity = 'error'
        setMessage(m)
      }
    }

    let isDataLoaded = false

    getData()

    return () => {
      isDataLoaded = true
    }
  }, [zone, state])

  function getZones() {
    let zones: number[] = []
    let maxZones = 0

    switch (state) {
      case 'connecticut':
        maxZones = 10
        break
      case 'maine':
        maxZones = 7
        break
      case 'massachusetts':
        maxZones = 15
        break
      case 'newhampshire':
        maxZones = 6
        break
      case 'rhodeisland':
        maxZones = 4
        break
      default:
        break
    }

    if (state == 'massachusetts') {
      maxZones = 15
    }

    for (let zoneCount = 1; zoneCount <= maxZones; zoneCount++) {
      zones.push(zoneCount)
    }

    return zones
  }

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="max-w-5xl w-full">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="text-3xl mb-4">Heating Oil Prices</h1>
        <hr className="mb-4" />
        <div className="mb-4">
          <p className="mb-4">
            Don&apos;t see your state or know your zone? Go to{' '}
            <a
              href="https://www.newenglandoil.com/"
              target="_blank"
              className="underline hover:no-underline"
            >
              newenglandoil.com
            </a>{' '}
            to find out!
          </p>
          <div className="mb-4">
            <label htmlFor="state" className="mb-4 block">
              State
            </label>
            <select
              name="state"
              id="state"
              onChange={(e) => {
                setState(e.target.value)
                setZone('')
              }}
              className="text-slate-700 leading-4 p-2 block max-w-full"
              value={state}
            >
              <option value="">Select State...</option>
              <option value="connecticut">Connecticut</option>
              <option value="maine">Maine</option>
              <option value="massachusetts">Massachusetts</option>
              <option value="newhampshire">New Hampshire</option>
              <option value="rhodeisland">Rhode Island</option>
            </select>
          </div>
          {state !== '' && (
            <div className="mb-4">
              <label htmlFor="zone" className="mb-4 block">
                Zone
              </label>
              <select
                name="zone"
                id="zone"
                onChange={(e) => {
                  setZone(e.target.value)
                }}
                className="text-slate-700 leading-4 p-2 block max-w-full"
                value={zone}
              >
                <option value="">Select Zone...</option>
                {getZones().map((zone: number) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {data.price == '' && zone !== '' && state !== '' && <Loader />}
        {data.price !== '' && zone !== '' && state !== '' && (
          <div>
            <ContentSection
              title="Best Price"
              content={
                <div>
                  <p className="mb-4 text-2xl">Price: {data.price}</p>
                  <p className="mb-4">Company: {data.company}</p>
                  <a
                    className="p-2 block w-fit bg-amber-600 hover:bg-slate-50 hover:text-slate-700 rounded-md"
                    href={data.url}
                    target="_blank"
                  >
                    Buy
                  </a>
                </div>
              }
              isExpandedByDefault={true}
            ></ContentSection>
          </div>
        )}
      </div>

      {message.message !== '' && (
        <Message
          message={message.message}
          severity={message.severity}
        ></Message>
      )}
    </div>
  )
}
