import { ReactElement, useState, useEffect } from 'react'

interface UseNumberInputOptions {
  id: string;
  label: string;
  extent: [number, number];
  initialValue: number;
  className?: string;
}

const useNumberInput = ({ id, className = '', label, extent, initialValue }: UseNumberInputOptions): [number, ReactElement<any>] => {
  const [reportedValue, setReportedValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +e.target.value
    setInputValue(newValue);
  }

  useEffect(() => {
    if (inputValue >= extent[0] && inputValue <= extent[1]) {
      setReportedValue(inputValue)
    }
  }, [inputValue, extent])

  const input = (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        className="value"
        id={id}
        value={inputValue}
        onChange={handleChange}
        type="number"
        min={extent[0]}
        max={extent[1]}
      />
    </div>
  )
  return [reportedValue, input];
}

export { useNumberInput }
