import React from 'react';
import './Main.css';
import { Tile } from '../components/Tile'
import { TileSummaryTable } from '../components/TileSummaryTable'
import { calculateTiles, SplitMethod } from '../lib/tiles'
import { useNumberInput } from '../hooks/useNumberInput'
import { useRadioInput } from '../hooks/useRadioInput'

const App: React.FC = () => {
  const [tileWidth, tileWidthInput] = useNumberInput({
    className: "dimension",
    id: "tile-width",
    label: "Tile Width",
    extent: [10, 200],
    initialValue: 151
  });
  const [tileHeight, tileHeightInput] = useNumberInput({
    className: "dimension",
    id: "tile-height",
    label: "Tile Height",
    extent: [10, 200],
    initialValue: 151
  });
  const [wallWidth, wallWidthInput] = useNumberInput({
    className: "dimension",
    id: "wall-width",
    label: "Wall Width",
    extent: [tileWidth, 2000],
    initialValue: tileWidth*3
  });
  const [wallHeight, wallHeightInput] = useNumberInput({
    className: "dimension",
    id: "wall-height",
    label: "Wall Height",
    extent: [tileHeight, 2000],
    initialValue: tileHeight*2
  });
  const [paddingWidth, paddingWidthInput] = useNumberInput({
    className: "dimension",
    id: "padding-width",
    label: "Padding Width",
    extent: [0, wallWidth/2 - 2],
    initialValue: 3
  });
  const [paddingHeight, paddingHeightInput] = useNumberInput({
    className: "dimension",
    id: "padding-height",
    label: "Padding Height",
    extent: [0, wallHeight/2 - 2],
    initialValue: 3
  });
  const [spacingWidth, spacingWidthInput] = useNumberInput({
    className: "dimension",
    id: "spacing-width",
    label: "Spacing Width",
    extent: [0, (wallWidth - paddingWidth) / 2 - 2],
    initialValue: 3
  });
  const [spacingHeight, spacingHeightInput] = useNumberInput({
    className: "dimension",
    id: "spacing-height",
    label: "Spacing Height",
    extent: [0, (wallHeight - paddingHeight) / 2 - 2],
    initialValue: 3
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
      {tileWidthInput}
      {tileHeightInput}
      {wallWidthInput}
      {wallHeightInput}
      {paddingWidthInput}
      {paddingHeightInput}
      {spacingWidthInput}
      {spacingHeightInput}
      {splitMethodInput}
      <div className="tile-summary">
        <TileSummaryTable
          tiles={tiles}
          className="summary-table"
        />
      </div>
      <svg className="viz">
        {tiles.map(({width, height, x, y}) => (
          <Tile
            x={x}
            y={y}
            width={width}
            height={height}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;
