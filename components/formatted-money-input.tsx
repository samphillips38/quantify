"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FormattedMoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (value: string) => void
  icon?: React.ReactNode
}

export function FormattedMoneyInput({ value, onChange, icon, className, ...props }: FormattedMoneyInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  // Format number with commas when value changes
  const formatValue = (val: string) => {
    const numeric = val ? Number.parseInt(val.replace(/[^0-9]/g, "")) : 0
    return numeric.toLocaleString("en-GB")
  }

  // Update display value when prop value changes
  if (formatValue(value) !== displayValue) {
    setDisplayValue(formatValue(value))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "")
    setDisplayValue(formatValue(rawValue))
    onChange(rawValue)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = value.replace(/[^0-9]/g, "")
    setDisplayValue(rawValue)
  }

  const handleBlur = () => {
    setDisplayValue(formatValue(value))
  }

  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-2.5 text-muted-foreground">{icon}</div>}
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="10,000"
        className={`${icon ? "pl-9" : ""} ${className}`}
      />
    </div>
  )
}

