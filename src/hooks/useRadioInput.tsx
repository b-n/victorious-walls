import { ReactElement, useState } from 'react'

interface UseRadioInputRadios<T> {
  id: string;
  label: string;
  name: string;
  options: T[];
  initialValue: T;
}

const useRadioInput = <T extends unknown>({
  id,
  label, 
  name,
  options,
  initialValue
}: UseRadioInputRadios<T>): [T, ReactElement<any>] => {
  const [value, setValue] = useState<T>(initialValue);

  const input = (
    <div>
      <div className="controls-label">{label}</div>
      <div className="radio-options">
        {options.map((option: T) => (
          <div className="radio-option">
            <input
              checked={value === option}
              id={`${id}-${option}`}
              value={option as string}
              name={name}
              onChange={e => setValue(e.target.value as T)}
              type="radio"
            />
            <label className="radio-label" htmlFor={`${id}-${option as string}`}>{option as string}</label>
          </div>
        ))}
      </div>
    </div>
  )
  return [value, input];
}

export { useRadioInput }
