import React from 'react';
import './Main.css';
import { Tile } from '../components/Tile'
import { TileSummaryTable } from '../components/TileSummaryTable'
import { Visualizer } from '../components/Visualizer'
import { calculateTiles, SplitMethod } from '../lib/tiles'
import { useCartesianInput } from '../hooks/useCartesianInput'
import { useRadioInput } from '../hooks/useRadioInput'

const App: React.FC = () => {
  const [[tileWidth, tileHeight], tileInput] = useCartesianInput({
    className: "dimension",
    id: "tile",
    label: "Tile",
    extentX: [10, 200],
    extentY: [10, 200],
    initialValues: [151, 151]
  })
  const [[wallWidth, wallHeight], wallInput] = useCartesianInput({
    className: "dimension",
    id: "wall",
    label: "Wall",
    extentX: [tileWidth, Infinity],
    extentY: [tileHeight, Infinity],
    initialValues: [tileWidth*3, tileHeight*3]
  });
  const [[paddingWidth, paddingHeight], paddingInput] = useCartesianInput({
    className: "dimension",
    id: "padding",
    label: "Padding",
    extentX: [0, wallWidth/2 - 2],
    extentY: [0, wallHeight/2 - 2],
    initialValues: [3, 3]
  });
  const [[spacingWidth, spacingHeight], spacingInput] = useCartesianInput({
    className: "dimension",
    id: "spacing-width",
    label: "Spacing Width",
    extentX: [0, (wallWidth - paddingWidth) / 2 - 2],
    extentY: [0, (wallHeight - paddingHeight) / 2 - 2],
    initialValues: [3, 3]
  });
  const [splitMethod, splitMethodInput] = useRadioInput<SplitMethod>({
    className: "dimension",
    id: 'split-method',
    name: 'split-method',
    label: 'Split Method',
    options: [
      SplitMethod.MostFullTiles,
      SplitMethod.AtLeastHalfSplitTiles,
    ],
    initialValue: SplitMethod.AtLeastHalfSplitTiles,
  })

  const tiles = calculateTiles({
    canvas: {
      width: wallWidth,
      height: wallHeight,
    },
    tile: { 
      width: tileWidth,
      height: tileHeight,
    },
    padding: {
      width: paddingWidth,
      height: paddingHeight,
    },
    spacing: {
      width: spacingWidth, 
      height: spacingHeight,
    },
    splitMethod: splitMethod,
  })

  return (
    <div>
      {tileInput}
      {wallInput}
      {paddingInput}
      {spacingInput}
      {splitMethodInput}
      <div className="tile-summary">
        <TileSummaryTable
          tiles={tiles}
          className="summary-table"
        />
      </div>
      <Visualizer
        width={wallWidth}
        height={wallHeight}
        className="viz"
      >
        {tiles.map(({width, height, x, y}) => (
          <Tile
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={width}
            height={height}
          />
        ))}
      </Visualizer>
    </div>
  );
}

export default App;
