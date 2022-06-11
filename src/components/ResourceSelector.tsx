import { ChangeEvent, Dispatch, useEffect, useState } from 'react'
import { CalendarConfig } from '../utils/fetchCalendars'
import Select from './Select'

interface ResourceSelectorProps {
  config: CalendarConfig
  updateUrl: Dispatch<string | null>
}

const ResourceSelector = (props: ResourceSelectorProps): JSX.Element => {
  const { config, updateUrl } = props

  const search = new URLSearchParams(location.search)
  const [initialCategoryKey] = useState(search.get('type') ?? config.default)
  const [initialResourceKey] = useState(search.get('ressource'))

  const [selectedCategoryKey, setSelectedCategoryKey] =
    useState(initialCategoryKey)
  const [selectedResourceKey, setSelectedResourceKey] =
    useState(initialResourceKey)

  const [expanded, setExpanded] = useState(!selectedResourceKey)

  const selectedCategory = config.data[selectedCategoryKey]
  const selectedResource = selectedResourceKey
    ? selectedCategory?.items[selectedResourceKey]
    : undefined

  useEffect(() =>
    updateUrl(
      selectedResource
        ? new URL(selectedResource.calendar, config.root).toString()
        : null
    )
  )

  useEffect(() => {
    const defaultTitle: string = 'ESI Horaires'

    document.title = selectedResource
      ? `${selectedResource.name} - ${defaultTitle}`
      : defaultTitle
  }, [selectedResource])

  const categorySelectionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryKey(e.target.value)
    setSelectedResourceKey(null)
  }

  const calSelectionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const newResourceKey = e.target.value
    setSelectedResourceKey(newResourceKey)
    setExpanded(false)
    history.pushState(
      {
        category: selectedCategoryKey,
        resource: newResourceKey
      },
      '',
      `?type=${selectedCategoryKey}&ressource=${newResourceKey}`
    )
  }

  /**
   * Si l'utilisateur retourne à la page précédente, affiche le bon calendrier
   */
  const popStateHandler = (e: PopStateEvent) => {
    setSelectedCategoryKey(e.state?.category || initialCategoryKey)
    setSelectedResourceKey(e.state?.resource || initialResourceKey)
  }

  useEffect(() => {
    window.addEventListener('popstate', popStateHandler)
    return () => window.removeEventListener('popstate', popStateHandler)
  })

  return (
    <>
      <div className="accordion mb-3" id="calSelector">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className={`accordion-button ${expanded ? '' : 'collapsed'}`}
              type="button"
              aria-expanded={expanded}
              aria-controls="collapseOne"
              onClick={() => setExpanded(!expanded)}>
              <strong>
                {selectedResource?.name ?? 'Parcourir les horaires..'}
              </strong>
            </button>
          </h2>
          <div
            className={`accordion-collapse collapse ${expanded ? 'show' : ''}`}
            aria-labelledby="headingOne"
            data-bs-parent="#calSelector">
            <div className="accordion-body">
              <div className="row">
                <Select
                  name="Type"
                  selected={selectedCategory}
                  selectionHandler={categorySelectionHandler}
                  items={config.data}
                />
                {selectedCategory && (
                  <Select
                    name={`Choisissez parmi les ${selectedCategory.name.toLowerCase()}`}
                    selected={selectedResource}
                    selectionHandler={calSelectionHandler}
                    items={selectedCategory.items}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResourceSelector
