import { ReactElement, useState } from 'react'

interface UseRangeInputOptions {
  id: string;
  label: string;
  extent: [number, number];
  initialValue: number;
}

const useRangeInput = ({ id, label, extent, initialValue }: UseRangeInputOptions): [number, ReactElement<any>] => {
  const [value, setValue] = useState(initialValue);
  const input = (
    <div>
      <label className="controls-label" htmlFor={id}>{label}</label>
      <input
        className="controls-range"
        id={id}
        value={value}
        onChange={e => setValue(+e.target.value)}
        type="range"
        min={extent[0]}
        max={extent[1]}
      />
      <span className="controls-value">{value}</span>
    </div>
  )
  return [value, input];
}

export { useRangeInput }
