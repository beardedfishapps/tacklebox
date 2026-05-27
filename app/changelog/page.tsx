/**
 * To generate changelogs
 *
 * git log --oneline --decorate=no HEAD...v4.0.0 > changelogs/v4.1.0.txt
 *
 * To count for version tag
 *
 * git rev-list HEAD...v3.5.0 --count
 */

import ContentSection from '@/app/components/content'
import Breadcrumbs from '@/app/components/breadcrumbs'

export default function ChangeLog() {
  let breadcrumbs = [
    {
      title: 'Changelog',
      href: '/changelog',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="max-w-5xl w-full">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="text-3xl mb-4">Changelog</h1>
        <hr className="mb-4" />

        <ContentSection title="v4.1.0" isExpandedByDefault={true}>
          <div>
            <p className="mb-4 last:mb-0">
              added better color, style, and bait info. updated tab UI
            </p>
            <p className="mb-4 last:mb-0">added team kistler logo</p>
            <p className="mb-4 last:mb-0">
              updated loading text to help visibility
            </p>
            <p className="mb-4 last:mb-0">
              refined confidence and data renderer
            </p>
            <p className="mb-4 last:mb-0">fix try something new section</p>
            <p className="mb-4 last:mb-0">added pulse fish lures logo</p>
            <p className="mb-4 last:mb-0">fix buy button</p>
            <p className="mb-4 last:mb-0">updated google ads for new domain</p>
            <p className="mb-4 last:mb-0">changed footer layout</p>
          </div>
        </ContentSection>

        <ContentSection title="v4.0.0">
          <div>
            <p className="mb-4 last:mb-0">
              major updates to support active species with temperature
              calculations for both salt and freshwater, added branded products
            </p>
            <p className="mb-4 last:mb-0">
              boost confidence if species in seasons
            </p>
            <p className="mb-4 last:mb-0">changed default active tab</p>
            <p className="mb-4 last:mb-0">changed bait icon for tab</p>
            <p className="mb-4 last:mb-0">
              boosted lures if matches filter species
            </p>
            <p className="mb-4 last:mb-0">
              added confidence boost when using lures that match bait styles
            </p>
            <p className="mb-4 last:mb-0">
              refactored some pieces of the filter
            </p>
            <p className="mb-4 last:mb-0">changed active fish icon</p>
            <p className="mb-4 last:mb-0">
              added seasons to types to boost confidence
            </p>
            <p className="mb-4 last:mb-0">added species filters</p>
            <p className="mb-4 last:mb-0">
              streamlined app and removed links to personal items
            </p>
            <p className="mb-4 last:mb-0">changed contact email</p>
            <p className="mb-4 last:mb-0">update fall colors</p>
            <p className="mb-4 last:mb-0">
              changed weight of moon phase and barometric pressure, added
              transitions to seasons
            </p>
            <p className="mb-4 last:mb-0">added about bearded fish</p>
            <p className="mb-4 last:mb-0">fixed seasons for recipes</p>
          </div>
        </ContentSection>

        <ContentSection title="v3.6.0">
          <div>
            <p className="mb-4 last:mb-0">
              added weather to tackle to boost confidence, i.e. ned rig is good
              for rain
            </p>
          </div>
        </ContentSection>

        <ContentSection title="v3.5.0">
          <div>
            <p className="mb-4 last:mb-0">improved tab interface</p>
            <p className="mb-4 last:mb-0">
              added tab interface on what to fish page
            </p>
            <p className="mb-4 last:mb-0">show all conditions text</p>
            <p className="mb-4 last:mb-0">
              added tomorrow forecast to dropdown #1
            </p>
          </div>
        </ContentSection>

        <ContentSection title="v3.4.0">
          <div>
            <p className="mb-4 last:mb-0">
              adjusted optimal moon phase condition logic
            </p>
            <p className="mb-4 last:mb-0">fixed new and full moon phases</p>
            <p className="mb-4 last:mb-0">
              added moon phase to conditions logic
            </p>
            <p className="mb-4 last:mb-0">
              added tubes to baits to use for smallies
            </p>
            <p className="mb-4 last:mb-0">
              added some helper text to What to Fish app
            </p>
            <p className="mb-4 last:mb-0">improved display of moon phase</p>
            <p className="mb-4 last:mb-0">added lure images</p>
            <p className="mb-4 last:mb-0">added visual for moon phases</p>
            <p className="mb-4 last:mb-0">tweaked modal styles</p>
            <p className="mb-4 last:mb-0">
              slight rebranding around amber color, changed to yellow-400
            </p>
            <p className="mb-4 last:mb-0">
              reorganized lures on what to fish and tackle by species pages
            </p>
          </div>
        </ContentSection>

        <ContentSection title="v3.3.0">
          <div>
            <p className="mb-4">
              added additional bait types such as insect, craw, and baitfish
            </p>
            <p className="mb-4">
              added link to tackle by species when conditions are not ideal
            </p>
            <p className="mb-4">added nav buttons to fishing tips</p>
            <p className="mb-4">
              fine-tuned spawn season lures recommendations, tweaked buy button
              display
            </p>
            <p className="mb-4">refined spawning seasons</p>
            <p className="mb-4">
              refactored some code, show more data when fishing not ideal,
              improved boat vs bank fishing recommendations
            </p>
            <p className="mb-4">updated fishing conditions display</p>
            <p className="mb-4">adjusted water temp calculation</p>
            <p className="mb-4">tweaked the conditions quality algorithm</p>
            <p className="mb-4">
              improved mobile display of long names in content lists
            </p>
            <p className="mb-4">fix overflow issue</p>
            <p className="mb-4">updated tackle by species</p>
            <p className="mb-4">
              updated lawn care buy buttons for consistency
            </p>
            <p>
              added full list of oil prices sorted by cheapest, improved buy
              button display and consistency
            </p>
          </div>
        </ContentSection>

        <ContentSection title="v3.2.0">
          <div>
            <p className="mb-4">added amazon affiliate links</p>
            <p className="mb-4">removed MA from heating oil bread crumb</p>
            <p className="mb-4">fixed sunset check</p>
            <p className="mb-4">
              added oil prices for all new england states except vt
            </p>
            <p className="mb-4">
              minor tweaks for consistency, added lawn care tips
            </p>
            <p className="mb-4">added conditions flavor text</p>
            <p className="mb-4">
              changed lists of apps to use large buttons like home page
            </p>
            <p className="mb-4">
              updated home page to have large buttons to link to pertinent
              pages, added beginner tips to fishing page
            </p>
            <p className="mb-4">
              fixed try something new section changing every time you viewed the
              modal
            </p>
            <p className="mb-4">
              adjusted fishing tips, added try something new section, separated
              pike, pickerel, and muskies
            </p>
            <p className="mb-4">
              added freshwater RI regulations and regulations links
            </p>
            <p className="mb-4">added rhode island saltwater regulations</p>
            <p className="mb-4">fixed mobile message styling</p>
            <p className="mb-4">
              small tweaks to what to fish app display, updated to check
              forecast for conditions text
            </p>
            <p className="mb-4">
              consolidated saltwater and freshwater fishing pages
            </p>
            <p className="mb-4">fix loading display on what to fish pages</p>
            <p>fixed alignment on hardbody swimbaits</p>
          </div>
        </ContentSection>

        <ContentSection title="v3.1.0">
          <div>
            <p className="mb-4">
              updated format of what to fish apps to display basic vs advanced
              data
            </p>
            <p className="mb-4">
              added logging to serverless functions to track some data
            </p>
            <p className="mb-4">
              fixed typo, added two tips about gut-hooking fish
            </p>
            <p className="mb-4">added some more tips, randomized tips list</p>
            <p className="mb-4">updated footer to decrease quantity of links</p>
            <p className="mb-4">updated + logic</p>
            <p className="mb-4">added facebook link</p>
            <p className="mb-4">hide flavor text on mobile</p>
            <p className="mb-4">
              updated optimal conditions text when not ideal
            </p>
            <p className="mb-4">major refactoring to resolve jscpd errors</p>
            <p className="mb-4">
              added barometric pressure readings and added to conditions quality
              check
            </p>
            <p className="mb-4">added moon and sun info</p>
            <p className="mb-4">
              added conditions quality to what to fish apps
            </p>
            <p className="mb-4">
              updated header blur functionality to collapse, fixed caught
              released timeout functionality
            </p>
            <p className="mb-4">
              rebranded, added caught and released text, added logger
            </p>
            <p className="mb-4">
              fixed loader test, updated can i fish default display
            </p>
            <p className="mb-4">fixed issue of duplicate blue</p>
            <p className="mb-4">
              fixed loading text, fixed saltwater lures spacing
            </p>
            <p className="mb-4">
              fixed padding on tackle by species page, fixed changelogs display
              to only keep most recent open
            </p>
            <p>added saltwater link to fishing page</p>
          </div>
        </ContentSection>

        <ContentSection title="v3.0.0">
          <div>
            <p className="mb-4">
              sorted species and other data alphabetically, added saltwater page
            </p>
            <p className="mb-4">change header button title on expanded</p>
            <p className="mb-4">
              added some subtle transitions on links and menu
            </p>
            <p>updated a few tests, added top nav menu component</p>
          </div>
        </ContentSection>

        <ContentSection title="v2.0.19">
          <div>
            <p className="mb-4">implemented retryCount on sql calls</p>
            <p className="mb-4">added pool care, consolidated date checks</p>
            <p className="mb-4">
              added lawn care page, added can i fish filter text
            </p>
            <p className="mb-4">added random tackle chooser</p>
            <p className="mb-4">added tackle by species page</p>
            <p className="mb-4">fixed cloudy day colors</p>
            <p className="mb-4">added tip support on tackle</p>
            <p className="mb-4">added some missing breadcrumbs</p>
            <p className="mb-4">slight tweak to the what to fish app</p>
            <p className="mb-4">reorganized pages</p>
            <p className="mb-4">refactored all classes to dedicated files</p>
            <p className="mb-4">updated useEffect on what to make app</p>
            <p className="mb-4">
              fixed loading of tackle and recipes to be in separate useEffect,
              added breadcrumbs
            </p>
            <p>added check for states to hide input if not loaded</p>
          </div>
        </ContentSection>

        <ContentSection title="v2.0.0">
          <div>
            <p className="mb-4">
              changed recipes and tackle to use postgres database
            </p>
            <p className="mb-4">
              implemented router with new directory structure
            </p>
            <p className="mb-4">fixed minimum length on can i fish</p>
            <p className="mb-4">added tip about noisy lures</p>
            <p className="mb-4">
              added trout stocking seasons for northern states
            </p>
            <p>
              fixed display of species names under lures, fixed trout to not
              show up in summer
            </p>
          </div>
        </ContentSection>

        <ContentSection title="v1.0.53">
          <div>
            <p className="mb-4">added yahtzee mechanic for recipes</p>
            <p className="mb-4">fixed bait issue for carp</p>
            <p className="mb-4">added free line rig</p>
            <p className="mb-4">fixed useFishingData bug with still check</p>
            <p className="mb-4">fixed bug with carp only rig not displaying</p>
            <p className="mb-4">added carp and catfish data</p>
            <p className="mb-4">slight tweak to the best times to fish logic</p>
            <p className="mb-4">updated inline link styles</p>
            <p className="mb-4">renamed oil prices to heating oil prices</p>
            <p>fixed some formatting issues on the canifish app</p>
          </div>
        </ContentSection>

        <ContentSection title="v1.0.30">
          <div>
            <p className="mb-4">added changelogs</p>
            <p className="mb-4">changed nav to footer, updated home page</p>
            <p className="mb-4">updated message styles</p>
            <p className="mb-4">
              changed messages to use fixed instead of absolute
            </p>
            <p className="mb-4">fixed a few small bugs</p>
            <p className="mb-4">
              slight tweak to hide message on initial page load, added in
              message component
            </p>
            <p className="mb-4">added message component</p>
            <p className="mb-4">sorted tackle by confidence level</p>
            <p className="mb-4">set a static tip based on the date</p>
            <p className="mb-4">
              updated oil prices to choose a random number to start
            </p>
            <p className="mb-4">added expand collapse to content sections</p>
            <p className="mb-4">fixed season overlap for lure colors</p>
            <p className="mb-4">slight tweak to how the tip renders</p>
            <p className="mb-4">added analytics, fixed some spelling issues</p>
            <p className="mb-4">
              added zones and added fishing tips to what to fish
            </p>
            <p className="mb-4">fixed regulations display</p>
            <p className="mb-4">updated readme</p>
            <p className="mb-4">added loader for geolocation</p>
            <p className="mb-4">updated default view of what to fish</p>
            <p className="mb-4">added geolocation</p>
            <p>updated nav, added about us</p>
          </div>
        </ContentSection>

        <ContentSection title="v1.0.0">
          <div>
            <p className="mb-4">added weather serverless function</p>
            <p className="mb-4">changed to using serverless functions</p>
            <p className="mb-4">added environment name</p>
            <p className="mb-4">
              refactored pages to use content section component
            </p>
            <p className="mb-4">updated what to fish test for more coverage</p>
            <p className="mb-4">updated readme</p>
            <p className="mb-4">
              fixed can i fish app, updated some date stuff
            </p>
            <p className="mb-4">added current vs forecast toggle</p>
            <p className="mb-4">fixed saltwater regulations rendering</p>
            <p className="mb-4">added pot roast</p>
            <p className="mb-4">
              added missing recipes, updated style linting, added more to list
            </p>
            <p className="mb-4">loaded state from weather</p>
            <p className="mb-4">fixed default display</p>
            <p className="mb-4">
              fixed tacklebox icon height, updated state-based inputs
            </p>
            <p className="mb-4">added loader</p>
            <p className="mb-4">added recommended species to target</p>
            <p className="mb-4">
              added state dropdown for determining proper spawn per state
            </p>
            <p className="mb-4">added location text to what to fish app</p>
            <p className="mb-4">slight tweak to global padding</p>
            <p className="mb-4">added copy button for ingredients</p>
            <p className="mb-4">adjusted some styles</p>
            <p className="mb-4">
              fixed homepage format, using state and binding for what to fish
              app with zip code
            </p>
            <p className="mb-4">
              converted json files to js files with exports
            </p>
            <p className="mb-4">fixed dates on saltwater grid</p>
            <p className="mb-4">
              removed duplicate text from can i fish, updated nav with
              organization
            </p>
            <p className="mb-4">
              fixed mobile display of fishing regulations grid
            </p>
            <p className="mb-4">
              fixed saltwater regulations, updated display on the can i fish
              page
            </p>
            <p className="mb-4">added plugin:jsx-a11y</p>
            <p className="mb-4">resolved color contrast issues</p>
            <p className="mb-4">added can i fish app</p>
            <p className="mb-4">added no-cache</p>
            <p className="mb-4">
              removed style linting from github actions, fixed pipeline errors
            </p>
            <p className="mb-4">
              fixed what to make page, fixed some errors from pipeline
            </p>
            <p className="mb-4">Create main.yml</p>
            <p className="mb-4">
              added cspell config, updated layout and styles
            </p>
            <p className="mb-4">updated prettier and eslint configs</p>
            <p className="mb-4">added icon</p>
            <p className="mb-4">removed .next directory</p>
            <p className="mb-4">added server and oil prices app</p>
            <p className="mb-4">
              base setup complete, what to fish app is working
            </p>
            <p>Initial commit from Create Next App</p>
          </div>
        </ContentSection>
      </div>
    </div>
  )
}
