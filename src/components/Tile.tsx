import React from 'react'

interface TileOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

const chamfer = 4;

// TODO: Chamfer breaks when tile is smaller that 8 due to rect getting negative width :-(
const Tile = ({ x, y, width, height }: TileOptions) => {
  return (
    <>
      <polyline
        points={`${x} ${y} ${x+width} ${y} ${x} ${y+height} ${x} ${y}`}
        className="shadow-tl"
      />
      <polyline
        points={`${x} ${y+height} ${x+width} ${y} ${x+width} ${y+height} ${x} ${y+height}`}
        className="shadow-br"
      />
      <rect
        x={x+chamfer}
        y={y+chamfer}
        width={width-chamfer*2}
        height={height-chamfer*2}
        className="tile"
      />
    </> 
  ) 
}

export { Tile }
