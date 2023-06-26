'use client'

import { useState, useEffect } from 'react'
import { compareDates } from '../../helpers/date'
import Loader from '../../components/loader'

class Regulations {
  public freshwaterRegulations: object[]
  public freshwaterRegulationsLink: string
  public saltwaterRegulations: object[]
  public saltwaterRegulationsLink: string

  constructor() {
    this.freshwaterRegulations = []
    this.freshwaterRegulationsLink = ''
    this.saltwaterRegulations = []
    this.saltwaterRegulationsLink = ''
  }
}

function getCreelLimitForIndex(seasonLimits: string[], index: number) {
  if (seasonLimits[index] && seasonLimits[index].trim() == '') {
    let i = index
    while (i > 0) {
      i--
      if (seasonLimits[i].trim() !== '') {
        return seasonLimits[i]
      }
    }
  } else if (seasonLimits[index]) {
    return seasonLimits[index].trim()
  } else {
    let i = index
    while (i > 0) {
      i--
      if (seasonLimits[i].trim() !== '') {
        return seasonLimits[i]
      }
    }
  }
}

export default function CanIFish() {
  let [data, setData] = useState(new Regulations())

  useEffect(() => {
    async function getData() {
      setData(new Regulations())
      let data = await getMARegulations()

      if (!isDataLoaded) {
        setData(data)
      }
    }

    async function fetchRegulations(endpoint: string) {
      let regulations: any[] = []

      await fetch('http://localhost:5555/canifish/' + endpoint, {
        cache: 'no-store',
      })
        .then((res) => res.json())
        .then((data) => {
          let fishingRegulations: object[] = []
          let canIFish = false

          data.fishingData.forEach((regulation) => {
            let dates = regulation.seasonDates

            if (typeof dates == 'object') {
              dates.forEach((date: object) => {
                if (compareDates(date)) {
                  fishingRegulations.push(regulation)

                  canIFish = true
                }
              })
            }
          })

          if (canIFish) {
            regulations.push(fishingRegulations)
            regulations.push(data.regulationsLink)
          }
        })

      return regulations
    }

    async function getMARegulations() {
      let regulations = new Regulations()

      const freshResults = await fetchRegulations('freshMA')
      const saltResults = await fetchRegulations('saltMA')

      regulations.freshwaterRegulations = freshResults[0]
      regulations.freshwaterRegulationsLink = freshResults[1]

      regulations.saltwaterRegulations = saltResults[0]
      regulations.saltwaterRegulationsLink = saltResults[1]

      return regulations
    }

    let isDataLoaded = false

    getData()

    return () => {
      isDataLoaded = true
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl pb-4">
          Can I Fish:{' '}
          {data.freshwaterRegulations.length > 0 ||
          data.saltwaterRegulations.length > 0
            ? 'Yes'
            : 'No'}
        </h1>
        <hr />
        {(!data.freshwaterRegulations ||
          data.freshwaterRegulations.length == 0) &&
          (!data.saltwaterRegulations ||
            data.saltwaterRegulations.length == 0) && <Loader />}
        {data.freshwaterRegulations &&
          data.freshwaterRegulations.length > 0 && (
            <div>
              <h2 className="text-2xl pb-8 pt-8">Freshwater Regulations</h2>
              <div className="grid gap-4 lg:grid-cols-3 grid-cols-1">
                {data.freshwaterRegulations.map((f: object, fIndex: number) => (
                  <div key={fIndex} className="pb-8">
                    <h3 className="pb-4 text-xl">{f.species}</h3>
                    <div className="border border-slate-50 bg-slate-700 p-4 rounded-md">
                      {f.description &&
                        f.description.trim() !== f.species.trim() && (
                          <p className="pb-4">{f.description}</p>
                        )}
                      <p className="pb-4">Fishing dates:</p>
                      <div>
                        {f.seasonDates.map((sd: string, sdIndex: number) => (
                          <p key={sdIndex} className="indent-4">
                            {sd.replace(', ', '').trim()}, Limit:{' '}
                            {getCreelLimitForIndex(f.seasonLimits, sdIndex)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        {data.saltwaterRegulations && data.saltwaterRegulations.length > 0 && (
          <div>
            <h2 className="text-2xl pb-8 pt-8">Saltwater Regulations</h2>
            <div className="grid gap-4 lg:grid-cols-3 grid-cols-1">
              {data.saltwaterRegulations.map((s, sIndex) => (
                <div key={sIndex} className="pb-8">
                  <h3 className="pb-4 text-xl">{s.species}</h3>
                  <div className="border border-slate-50 bg-slate-700 p-4 rounded-md">
                    {s.description.trim() !== s.species.trim() && (
                      <p className="pb-4">{s.description}</p>
                    )}
                    <p className="pb-4">Fishing dates:</p>
                    <div>
                      {s.seasonDates.map((sd: string, sdIndex: number) => (
                        <p key={sdIndex} className="indent-4">
                          {sd.replace(', ', '').trim()}, Limit:{' '}
                          {getCreelLimitForIndex(s.seasonLimits, sdIndex)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
