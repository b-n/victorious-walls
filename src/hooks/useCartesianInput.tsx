import { ReactElement, useState, useEffect } from 'react'

interface useCartesianInputOptions {
  id: string;
  label: string;
  extentX: [number, number];
  extentY: [number, number];
  initialValues: [number, number];
  className?: string;
}

enum CartesianDimension {
  Width,
  Height
}

const useCartesianInput = ({
  id,
  className = '',
  label,
  extentX,
  extentY,
  initialValues
}: useCartesianInputOptions): [[number, number], ReactElement<any>] => {
  const [reportedValue, setReportedValue] = useState(initialValues);
  const [width, setWidth] = useState(initialValues[0]);
  const [height, setHeight] = useState(initialValues[1]);

  const handleChange = (dimension: CartesianDimension) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +e.target.value
    if (dimension === CartesianDimension.Width) {
      setWidth(newValue);
      if (newValue >= extentX[0] && newValue <= extentX[1]) {
        setReportedValue([newValue, height])
      }
    }
    if (dimension === CartesianDimension.Height) {
      setHeight(newValue);
      if (newValue >= extentY[0] && newValue <= extentY[1]) {
        setReportedValue([width, newValue])
      }
    }
  }

  const input = (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        className="value"
        id={id}
        value={width}
        onChange={handleChange(CartesianDimension.Width)}
        type="number"
        min={extentX[0]}
        max={extentX[1]}
      />
      <span>&nbsp;x&nbsp;</span>
      <input
        className="value"
        id={id}
        value={height}
        onChange={handleChange(CartesianDimension.Height)}
        type="number"
        min={extentY[0]}
        max={extentY[1]}
      />
    </div>
  )
  return [reportedValue, input];
}

export { useCartesianInput }
