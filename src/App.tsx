import React, { ReactElement, useState } from 'react';
import './App.css';

interface TileOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

const champfer = 4;


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
        x={x+champfer}
        y={y+champfer}
        width={width-champfer*2}
        height={height-champfer*2}
        className="tile"
      />
    </> 
  ) 
}

interface UseInputOptions {
  id: string;
  label: string;
  extent: [number, number];
  initialValue: number;
}

const useInput = ({ id, label, extent, initialValue }: UseInputOptions): [number, ReactElement<any>] => {
  const [value, setValue] = useState(initialValue);
  const input = (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={e => setValue(+e.target.value)}
        type="range"
        min={extent[0]}
        max={extent[1]}
      />
    </div>
  )
  return [value, input];
}

const App: React.FC = () => {
  const [tileWidth, tileWidthInput] = useInput({ id: "tile-width", label: "Tile Width", extent: [10, 200], initialValue: 151});
  const [tileHeight, tileHeightInput] = useInput({ id: "tile-height", label: "Tile Height", extent: [10, 200], initialValue: 151});
  const [wallWidth, wallWidthInput] = useInput({ id: "wall-width", label: "Wall Width", extent: [tileWidth*2, 2000], initialValue: 1000});
  const [wallHeight, wallHeightInput] = useInput({ id: "wall-height", label: "Wall Height", extent: [tileHeight*2, 2000], initialValue: 1000});

  const totalTiles = {
    x: Math.floor(wallWidth / tileWidth - 1),
    y: Math.floor(wallHeight / tileHeight - 1),
  }

  const remainingSpace = {
    width: wallWidth - totalTiles.x * tileWidth,
    height: wallHeight - totalTiles.y * tileHeight,
  }

  const splitTile = {
    width: remainingSpace.width / 2,
    height: remainingSpace.height / 2,
  }

  return (
    <div>
      {tileWidthInput}
      {tileHeightInput}
      {wallWidthInput}
      {wallHeightInput}
      <svg className="viz">
        {Array(totalTiles.y+2).fill(0).map((_, i) => {
          const rowHeight = (i === 0 || i === totalTiles.y + 1) ? splitTile.height : tileHeight;
          const rowY = i === 0 ? 0 : splitTile.height + (i - 1) * tileHeight;

          return (
            <>
              <Tile x={0} y={rowY} width={splitTile.width} height={rowHeight} />
              {Array(totalTiles.x).fill(0).map((_, j) => (
                <Tile x={splitTile.width + j * tileWidth} y={rowY} width={tileWidth} height={rowHeight} />
              ))}
              <Tile x={splitTile.width + totalTiles.x * tileWidth} y={rowY} width={splitTile.width} height={rowHeight} />
            </>
          )
        })}
      </svg>
    </div>
  );
}

export default App;
