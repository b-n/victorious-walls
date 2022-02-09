import React from 'react';
import './Main.css';
import { Tile } from '../components/Tile'
import { calculateTiles, SplitMethod } from '../lib/tiles'
import { useRangeInput } from '../hooks/useRangeInput'
import { useRadioInput } from '../hooks/useRadioInput'

const App: React.FC = () => {
  const [tileWidth, tileWidthInput] = useRangeInput({
    id: "tile-width",
    label: "Tile Width",
    extent: [10, 200],
    initialValue: 151
  });
  const [tileHeight, tileHeightInput] = useRangeInput({
    id: "tile-height",
    label: "Tile Height",
    extent: [10, 200],
    initialValue: 151
  });
  const [wallWidth, wallWidthInput] = useRangeInput({
    id: "wall-width",
    label: "Wall Width",
    extent: [tileWidth, 2000],
    initialValue: tileWidth*3
  });
  const [wallHeight, wallHeightInput] = useRangeInput({
    id: "wall-height",
    label: "Wall Height",
    extent: [tileHeight, 2000],
    initialValue: tileHeight*2
  });
  const [paddingWidth, paddingWidthInput] = useRangeInput({
    id: "padding-width",
    label: "Padding Width",
    extent: [0, 10],
    initialValue: 3
  });
  const [paddingHeight, paddingHeightInput] = useRangeInput({
    id: "padding-height",
    label: "Padding Height",
    extent: [0, 10],
    initialValue: 3
  });
  const [spacingWidth, spacingWidthInput] = useRangeInput({
    id: "spacing-width",
    label: "Spacing Width",
    extent: [0, 10],
    initialValue: 3
  });
  const [spacingHeight, spacingHeightInput] = useRangeInput({
    id: "spacing-height",
    label: "Spacing Height",
    extent: [0, 10],
    initialValue: 3
  });
  const [splitMethod, splitMethodInput] = useRadioInput<SplitMethod>({
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
