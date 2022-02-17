import { TileDimensions } from '../lib/tiles'

const MAX_CHAMFER = 4;

const Tile = ({ x, y, width, height }: TileDimensions) => {
  const xChamfer = Math.min(MAX_CHAMFER, width/2)
  const yChamfer = Math.min(MAX_CHAMFER, height/2)

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className="tile"
      />
      <polyline
        points={`
          ${x} ${y}
          ${x+width} ${y}
          ${x+width-xChamfer} ${y+yChamfer}
          ${x+xChamfer} ${y+yChamfer}
          ${x+xChamfer} ${y+height-yChamfer}
          ${x} ${y+height}
          ${x} ${y}
        `}
        className="shadow-tl"
      />
      <polyline
        points={`
          ${x} ${y+height}
          ${x+xChamfer} ${y+height-yChamfer}
          ${x+width-xChamfer} ${y+height-yChamfer}
          ${x+width-xChamfer} ${y+yChamfer}
          ${x+width} ${y}
          ${x+width} ${y+height}
          ${x} ${y+height}
        `}
        className="shadow-br"
      />
    </> 
  ) 
}

export { Tile }
