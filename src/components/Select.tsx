import { ChangeEvent, Dispatch } from 'react'

interface SelectItem {
  key: string
  name: string
}

interface SelectItems {
  [key: string]: SelectItem
}

interface SelectProps {
  name: string
  selectionHandler: Dispatch<ChangeEvent<HTMLSelectElement>>
  items: SelectItems
  selected: SelectItem | undefined
}

const Select = (props: SelectProps): JSX.Element => {
  const { name, items, selected, selectionHandler } = props

  return (
    <div>
      <label className="form-label">
        <strong>{name}</strong>
      </label>
      <select
        className="form-control custom-select"
        onChange={selectionHandler}
        value={selected ? selected.key : 0}>
        <option disabled value={0}>
          {name}
        </option>
        {items &&
          Object.entries(items).map(([key, item]) => {
            return (
              <option key={key} value={key}>
                {item.name}
              </option>
            )
          })}
      </select>
    </div>
  )
}

export default Select
