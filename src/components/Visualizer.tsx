import React, { useRef } from 'react'
import { useScroll } from '../hooks/useScroll'

interface VisualizerProps {
  width: number;
  height: number;
  className: string;
}

const gridLinePositions = (domain: number, step: number): number[] => {
  if (step > domain) {
    return []
  }

  const lines = Math.floor(domain / step);

  return Array(lines).fill(step).map((v, i) => v * (i + 1))
}

const Visualizer: React.FC<VisualizerProps> = ({ 
  width,
  height,
  className,
  children
}) => {
  const wrapperRef = useRef(null);

  const [scrollLeft, scrollTop] = useScroll(wrapperRef);

  const horizontalGridLines = gridLinePositions(height, 500);
  const verticalGridLines = gridLinePositions(width, 500);

  return (
    <div ref={wrapperRef} className={className}>
      <svg width={width} height={height}>
        {children}
        <g className="grid grid-horizontal">
          {horizontalGridLines.map(y => (
            <g key={`grid-y-${y}`}>
              <text x={scrollLeft+5} y={y-5} textAnchor="start" alignmentBaseline="baseline">{y}</text>
              <line x1={0} y1={y} x2={width} y2={y} />
            </g>
          ))}
        </g>
        <g className="grid grid-vertical">
          {verticalGridLines.map(x => (
            <g key={`grid-x-${x}`}>
              <text x={x-5} y={scrollTop+5} textAnchor="end" alignmentBaseline="hanging">{x}</text>
              <line x1={x} y1={0} x2={x} y2={height} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

export { Visualizer }
