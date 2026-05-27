'use client'

import { useState } from 'react'
import Modal from 'react-modal'
import ReactHtmlParser from 'react-html-parser'
import FishingData from '../classes/FishingData'
import ContentSection from './content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faStar } from '@fortawesome/free-regular-svg-icons'
import {
  faArrowUpRightFromSquare,
  faFish,
  faCircleHalfStroke,
  faCalendar,
  faCloud,
  faWorm,
  faRectangleAd,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import crankbaits from '@/app/assets/images/crankbaits.jpg'
import jerkbaits from '@/app/assets/images/jerkbaits.jpg'
import poppers from '@/app/assets/images/poppers.jpg'
import spinners from '@/app/assets/images/spinners.jpg'
import swimbaits from '@/app/assets/images/swimbaits.jpg'
import FilterSort from './filterSort'

interface Props {
  data: FishingData
}

export default function FishingDataContent({ data }: Props) {
  let [isModalOpen, setIsModalOpen] = useState(false)
  let [modalContent, setModalContent] = useState('')
  let [activeTab, setActiveTab] = useState('luresAndRigs')
  let [tackleFilteredSorted, setTackleFilteredSorted] = useState(
    [...data.tackle]
      .sort((a, b) => {
        if (a.confidence < b.confidence) {
          return 1
        }
        if (a.confidence > b.confidence) {
          return -1
        }
        // a must be equal to b
        return 0
      })
      .filter((t) => getTackleSubtext(t) !== '')
  )
  let [baitsToUseFilteredSorted, setBaitsToUseFilteredSorted] = useState([
    ...data.baitRecommendations.baitsToUse,
  ])
  let [stylesToUseFilteredSorted, setStylesToUseFilteredSorted] = useState([
    ...data.baitRecommendations.stylesToUse,
  ])

  let moonPhaseInnerClassName = ''
  let moonPhaseOuterClassName = ''

  switch (data.weather.astro.moon_phase) {
    case 'New Moon':
      moonPhaseInnerClassName = 'hidden'
      moonPhaseOuterClassName = 'bg-slate-700'
      break
    case 'Waxing Crescent':
      moonPhaseInnerClassName =
        'bg-slate-700 right-[25%] -left-[25%] rounded-full'
      moonPhaseOuterClassName = 'bg-slate-50'
      break
    case 'First Quarter':
      moonPhaseInnerClassName = 'bg-slate-700 right-[50%] -left-[50%]'
      moonPhaseOuterClassName = 'bg-slate-50'
      break
    case 'Waxing Gibbous':
      moonPhaseInnerClassName =
        'bg-slate-50 left-[25%] -right-[25%] rounded-full'
      moonPhaseOuterClassName = 'bg-slate-700'
      break
    case 'Full Moon':
      moonPhaseInnerClassName = 'hidden'
      moonPhaseOuterClassName = 'bg-slate-50'
      break
    case 'Waning Gibbous':
      moonPhaseInnerClassName =
        'bg-slate-50 right-[25%] -left-[25%] rounded-full'
      moonPhaseOuterClassName = 'bg-slate-700'
      break
    case 'Last Quarter':
      moonPhaseInnerClassName = 'bg-slate-700 left-[50%] -right-[50%]'
      moonPhaseOuterClassName = 'bg-slate-50'
      break
    case 'Waning Crescent':
      moonPhaseInnerClassName =
        'bg-slate-700 left-[25%] -right-[25%] rounded-full'
      moonPhaseOuterClassName = 'bg-slate-50'
      break
  }

  let modalImage = null

  if (modalContent.toUpperCase().includes('CRANKBAIT')) {
    modalImage = crankbaits
  } else if (modalContent.toUpperCase().includes('JERKBAIT')) {
    modalImage = jerkbaits
  } else if (modalContent.toUpperCase().includes('POPPER')) {
    modalImage = poppers
  } else if (modalContent.toUpperCase().includes('SPINNER')) {
    modalImage = spinners
  } else if (modalContent.toUpperCase().includes('SWIMBAIT')) {
    modalImage = swimbaits
  }

  function getTackleSubtext(tackle: any) {
    let tackleSubtext = []

    if (!tackle.species) {
      tackleSubtext.push('all species')
    } else {
      tackle.species.forEach((s: any) => {
        if (data.species.includes(s)) {
          tackleSubtext.push(s)
        }
      })
    }

    if (tackle.waterClarity) {
      tackleSubtext.push(tackle.waterClarity + ' water')
    }

    if (tackle.type && tackle.type.includes('natural')) {
      tackleSubtext.push('natural color')
    }

    return tackleSubtext.toString().replaceAll(',', ', ')
  }

  function resetTackleData() {
    return [...data.tackle]
      .sort((a, b) => {
        if (a.confidence < b.confidence) {
          return 1
        }
        if (a.confidence > b.confidence) {
          return -1
        }
        // a must be equal to b
        return 0
      })
      .filter((t) => getTackleSubtext(t) !== '')
  }

  const fallbackOkTime =
    !data.seasons.includes('summer') && !data.seasons.includes('winter')
      ? 'early morning'
      : 'late morning/early afternoon'
  const fallbackGoodTime =
    !data.seasons.includes('summer') && !data.seasons.includes('winter')
      ? 'late morning/early afternoon'
      : 'early morning'
  const fallbackGreatTime = 'late afternoon/early evening'

  return (
    <div>
      {data.aiGenerated && (
        <div className="mb-4 p-3 border border-yellow-400 rounded-md text-yellow-400">
          AI-generated recommendations
          {data.aiSource ? ` (${data.aiSource})` : ''}
        </div>
      )}
      <hr className="mb-8" />
      <div className="flex flex-row justify-between pt-4 pb-4 border border-slate-50 rounded-md">
        <button
          title="Baits, Styles, and Colors Tab Button"
          className="max-w-[20%] word-wrap mx-auto"
          disabled={activeTab == 'baitsStylesColors'}
          onClick={() => {
            setActiveTab('baitsStylesColors')
            setTackleFilteredSorted(resetTackleData())
          }}
        >
          <div
            className={
              'flex md:flex-row flex-col items-center ' +
              (activeTab == 'baitsStylesColors'
                ? 'text-yellow-400 underline'
                : '')
            }
          >
            <FontAwesomeIcon
              icon={faWorm}
              className="md:mr-2 md:text-xl text-3xl md:mb-0 mb-2"
            />
            <span className="md:text-xl text-sm">Baits &amp; Styles</span>
          </div>
        </button>
        <div className="border border-slate-50"></div>
        <button
          title="Lures and Rigs Tab Button"
          className="max-w-[20%] word-wrap mx-auto"
          disabled={activeTab == 'luresAndRigs'}
          onClick={() => {
            setActiveTab('luresAndRigs')
            setTackleFilteredSorted(resetTackleData())
          }}
        >
          <div
            className={
              'flex md:flex-row flex-col items-center ' +
              (activeTab == 'luresAndRigs' ? 'text-yellow-400 underline' : '')
            }
          >
            <FontAwesomeIcon
              icon={faCircleHalfStroke}
              className="md:mr-2 md:text-xl text-3xl md:mb-0 mb-2 -rotate-90"
            />
            <span className="md:text-xl text-sm">Lures &amp; Rigs</span>
          </div>
        </button>
        <div className="border border-slate-50"></div>
        <button
          title="Season Info Tab Button"
          className="max-w-[20%] word-wrap mx-auto"
          disabled={activeTab == 'seasonalInfo'}
          onClick={() => {
            setActiveTab('seasonalInfo')
            setTackleFilteredSorted(resetTackleData())
          }}
        >
          <div
            className={
              'flex md:flex-row flex-col items-center ' +
              (activeTab == 'seasonalInfo' ? 'text-yellow-400 underline' : '')
            }
          >
            <FontAwesomeIcon
              icon={faCalendar}
              className="md:mr-2 md:text-xl text-3xl md:mb-0 mb-2"
            />
            <span className="md:text-xl text-sm">Season Info</span>
          </div>
        </button>
        <div className="border border-slate-50"></div>
        <button
          title="Weather Tab Button"
          className="max-w-[20%] word-wrap mx-auto"
          disabled={activeTab == 'weather'}
          onClick={() => {
            setActiveTab('weather')
            setTackleFilteredSorted(resetTackleData())
          }}
        >
          <div
            className={
              'flex md:flex-row flex-col items-center ' +
              (activeTab == 'weather' ? 'text-yellow-400 underline' : '')
            }
          >
            <FontAwesomeIcon
              icon={faCloud}
              className="md:mr-2 md:text-xl text-3xl md:mb-0 mb-2"
            />
            <span className="md:text-xl text-sm">Weather</span>
          </div>
        </button>
      </div>
      {activeTab == 'baitsStylesColors' && (
        <div className="mb-8">
          <div className="grid gap-4 lg:grid-cols-2 grid-cols-1">
            <div className="pt-4">
              <FilterSort
                data={data.baitRecommendations.baitsToUse}
                sortedFilteredData={baitsToUseFilteredSorted}
                setData={setBaitsToUseFilteredSorted}
                resetData={() => [...data.baitRecommendations.baitsToUse]}
              />
              {baitsToUseFilteredSorted.length > 0 && (
                <ContentSection title="Baits" isExpandedByDefault={true}>
                  {baitsToUseFilteredSorted.map((b, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div
                          className={
                            'flex flex-col' +
                            (!b.name.toUpperCase().includes('LIVE')
                              ? ' md:mb-0 mb-4'
                              : '')
                          }
                        >
                          <div className="flex flex-row items-center">
                            <p className="text-yellow-400 font-bold">
                              {b.name}
                              {b.type?.includes('product') && (
                                <FontAwesomeIcon
                                  icon={faRectangleAd}
                                  className="ml-2"
                                />
                              )}
                            </p>
                          </div>
                          <div title={'Confidence rating of ' + b.confidence}>
                            {[...Array(b.confidence)].map((e, i) => (
                              <FontAwesomeIcon
                                key={i}
                                icon={faStar}
                                className="ml-1 first:ml-0"
                              />
                            ))}
                          </div>
                          <p className="text-sm">{getTackleSubtext(b)}</p>
                        </div>
                        {!b.name.toUpperCase().includes('LIVE') && (
                          <div>
                            <a
                              title={
                                'Amazon Buy link for ' +
                                b.name +
                                ' fishing lures'
                              }
                              target="_blank"
                              className="p-2 w-fit bg-slate-700 border hover:bg-slate-50 hover:text-slate-700 rounded-md flex flex-row items-center"
                              href={
                                'https://www.amazon.com/gp/search?ie=UTF8&tag=bearededfisha-20&linkCode=ur2&linkId=9b3fecfa6e628523da72d3db87d3cd35&camp=1789&creative=9325&index=aps&keywords=' +
                                b.name +
                                ' fishing lures'
                              }
                            >
                              <span>Buy</span>
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                                className="ml-2 max-h-4"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ContentSection>
              )}
            </div>

            <div className="pt-4">
              <FilterSort
                data={data.baitRecommendations.stylesToUse}
                sortedFilteredData={stylesToUseFilteredSorted}
                setData={setStylesToUseFilteredSorted}
                resetData={() => [...data.baitRecommendations.stylesToUse]}
              />
              {stylesToUseFilteredSorted.length > 0 && (
                <ContentSection
                  title="Colors & Styles"
                  isExpandedByDefault={true}
                >
                  {stylesToUseFilteredSorted.map((s, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col">
                          <div className="flex flex-row items-center">
                            <p className="text-yellow-400 font-bold">
                              {s.name}
                              {s.type?.includes('product') && (
                                <FontAwesomeIcon
                                  icon={faRectangleAd}
                                  className="ml-2"
                                />
                              )}
                            </p>
                          </div>
                          <div title={'Confidence rating of ' + s.confidence}>
                            {[...Array(s.confidence)].map((e, i) => (
                              <FontAwesomeIcon
                                key={i}
                                icon={faStar}
                                className="ml-1 first:ml-0"
                              />
                            ))}
                          </div>
                          <p className="text-sm">{getTackleSubtext(s)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ContentSection>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab == 'luresAndRigs' && (
        <div className="mb-8 pt-4">
          <FilterSort
            data={data.tackle}
            sortedFilteredData={tackleFilteredSorted}
            setData={setTackleFilteredSorted}
            resetData={resetTackleData}
          />
          {tackleFilteredSorted.length > 0 && (
            <ContentSection title="Lures & Rigs" isExpandedByDefault={true}>
              {tackleFilteredSorted.map((t, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div
                      className={'flex flex-col' + t.tip ? ' mb-4 md:mb-0' : ''}
                    >
                      <div className="flex flex-row items-center">
                        {t.tip && (
                          <button
                            className="flex flex-row items-center text-left w-full text-yellow-400 font-bold"
                            title="Click to learn how to use this"
                            onClick={() => {
                              setModalContent(t.tip)
                              setIsModalOpen(true)
                            }}
                          >
                            <span className="text-yellow-400">
                              {t.name}
                              {t.type.includes('product') && (
                                <FontAwesomeIcon
                                  icon={faRectangleAd}
                                  className="ml-2"
                                />
                              )}
                            </span>
                            <FontAwesomeIcon
                              icon={faCircleQuestion}
                              className="ml-2"
                            />
                          </button>
                        )}
                        {!t.tip && (
                          <p className="text-yellow-400 font-bold">
                            {t.name}
                            {t.type.includes('product') && (
                              <FontAwesomeIcon
                                icon={faRectangleAd}
                                className="ml-2"
                              />
                            )}
                          </p>
                        )}
                      </div>
                      <div title={'Confidence rating of ' + t.confidence}>
                        {[...Array(t.confidence)].map((e, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className="ml-1 first:ml-0"
                          />
                        ))}
                      </div>
                      <p className="text-sm">{getTackleSubtext(t)}</p>
                    </div>
                    {!t.name.toUpperCase().includes(' RIG') && (
                      <div>
                        <a
                          title={
                            'Amazon Buy link for ' + t.name + ' fishing lures'
                          }
                          target="_blank"
                          className="p-2 w-fit bg-slate-700 border hover:bg-slate-50 hover:text-slate-700 rounded-md flex flex-row items-center"
                          href={
                            'https://www.amazon.com/gp/search?ie=UTF8&tag=bearededfisha-20&linkCode=ur2&linkId=9b3fecfa6e628523da72d3db87d3cd35&camp=1789&creative=9325&index=aps&keywords=' +
                            t.name +
                            ' fishing lures'
                          }
                        >
                          <span>Buy</span>
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="ml-2 max-h-4"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ContentSection>
          )}

          {(data.species.includes('Not ideal') ||
            tackleFilteredSorted.length == 0) && (
            <div className="pt-4">
              <p className="mb-4 max-w-[50%]">
                It may not be ideal fishing for the selected species, or you can
                check the filters. Get specific lure suggestions by species
                here:
              </p>

              <Link
                className="w-full lg:basis-3/12 shrink-0 mb-4 lg:mb-0 flex flex-col p-8 border bg-slate-50 text-slate-700 hover:bg-transparent hover:text-slate-50 text-center rounded-md transition-all"
                href="/fishing/tackle-by-species"
              >
                <FontAwesomeIcon icon={faFish} className="mb-4 h-16" />
                <span>Tackle by Species</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab == 'seasonalInfo' && (
        <div className="mb-8">
          <div>
            <ContentSection title="Season" isExpandedByDefault={true}>
              {data.seasons}
            </ContentSection>

            <ContentSection
              title="Best times to fish"
              isExpandedByDefault={true}
            >
              <div>
                <p>OK: {data.bestFishingTimes.ok || fallbackOkTime}</p>
                <p>Good: {data.bestFishingTimes.good || fallbackGoodTime}</p>
                <p>Great: {data.bestFishingTimes.great || fallbackGreatTime}</p>
              </div>
            </ContentSection>

            {data.seasonPhases.length > 0 && (
              <ContentSection
                title="Species Season Phases"
                isExpandedByDefault={true}
              >
                <div>
                  {data.seasonPhases.map((phase, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <p>
                        {phase.species}: {phase.phase}
                      </p>
                      {phase.notes && <p className="text-sm">{phase.notes}</p>}
                    </div>
                  ))}
                </div>
              </ContentSection>
            )}

            <ContentSection
              title="Astrological Info"
              isExpandedByDefault={true}
            >
              <div>
                <p className="mb-4">Sunrise: {data.weather.astro.sunrise}</p>
                <p className="mb-4">Sunset: {data.weather.astro.sunset}</p>
                <p className="mb-4">Moonrise: {data.weather.astro.moonrise}</p>
                <p className="mb-4">Moonset: {data.weather.astro.moonset}</p>
                <p className="mb-2">
                  Moon phase: {data.weather.astro.moon_phase}
                </p>
                {moonPhaseInnerClassName !== '' && (
                  <div
                    className={
                      'rounded-full overflow-hidden h-10 w-10 relative border-2 ' +
                      moonPhaseOuterClassName
                    }
                  >
                    <div
                      className={'absolute h-full ' + moonPhaseInnerClassName}
                    ></div>
                  </div>
                )}
              </div>
            </ContentSection>
          </div>
        </div>
      )}
      {activeTab == 'weather' && (
        <div className="mb-8">
          <div>
            <ContentSection title="Current Weather" isExpandedByDefault={true}>
              <div>
                <p className="mb-4">
                  Outdoor Temperature: {data.weather.current.outdoorTemp}
                </p>
                <p className="mb-4">
                  Estimated Water Temperature: {data.weather.current.waterTemp}
                </p>
                <p className="mb-4">
                  Conditions: {data.weather.current.conditions}
                </p>
                <p className="mb-4">Wind: {data.weather.current.wind}</p>
                <p>Pressure: {data.weather.pressure}in.</p>
              </div>
            </ContentSection>

            <ContentSection title="Today's Weather" isExpandedByDefault={true}>
              <div>
                <p className="mb-4">
                  Outdoor Temperature: {data.weather.forecast[0].outdoorTemp}
                </p>
                <p className="mb-4">
                  Estimated Water Temperature:{' '}
                  {data.weather.forecast[0].waterTemp}
                </p>
                <p className="mb-4">
                  Conditions: {data.weather.forecast[0].conditions}
                </p>
                <p>Wind: {data.weather.forecast[0].wind}</p>
              </div>
            </ContentSection>

            <ContentSection
              title="Tomorrow's Weather"
              isExpandedByDefault={true}
            >
              <div>
                <p className="mb-4">
                  Outdoor Temperature: {data.weather.forecast[1].outdoorTemp}
                </p>
                <p className="mb-4">
                  Estimated Water Temperature:{' '}
                  {data.weather.forecast[1].waterTemp}
                </p>
                <p className="mb-4">
                  Conditions: {data.weather.forecast[1].conditions}
                </p>
                <p>Wind: {data.weather.forecast[1].wind}</p>
              </div>
            </ContentSection>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} contentLabel="Tackle Modal">
        <div className="text-slate-700 mb-4">
          {ReactHtmlParser(modalContent)}
          {modalImage && (
            <Image
              src={modalImage}
              alt="Photo of lures"
              className="pt-4 max-w-full"
              width="500"
            />
          )}
        </div>
        <button
          className="p-2 w-fit bg-yellow-400 hover:bg-slate-50 text-slate-700 rounded-md"
          onClick={() => {
            setIsModalOpen(false)
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  )
}
