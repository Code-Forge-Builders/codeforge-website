'use client'

import { forwardRef, useState } from "react"

export interface ISelectOption {
  label: string
  value: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: ISelectOption[]
  emptyOptionLabel?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, id, className, options, emptyOptionLabel, title, onChange, ...rest }: SelectProps, ref) => {
  const [selectedOptionLabel, setSelectedOptionLabel] = useState('')

  return <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <select ref={ref} title={title ?? selectedOptionLabel} className="px-2 py-[7px] rounded-sm bg-zinc-800 text-white" id={id} onChange={(event) => {
      setSelectedOptionLabel(options.find(o => o.value === event.target.value)?.label || '')
      if (onChange) {
        onChange(event)
      }
    }} {...rest}>
      <option value="">{emptyOptionLabel ?? "Select an option..."}</option>
      {options.map((option, idx: number) => {
        return <option key={idx} value={option.value}>{option.label}</option>
      })}
    </select>
  </div>
})

Select.displayName = 'Select'

export default Select
