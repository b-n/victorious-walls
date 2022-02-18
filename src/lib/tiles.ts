export interface TileDimensions {
  x: number
  y: number
  width: number
  height: number
}

export enum SplitMethod {
  MostFullTiles = 'Most uncut tiles',
  AtLeastHalfSplitTiles = 'At least a half tile',
}

interface CartesianallySized {
  width: number
  height: number
}

type CanvasSize = CartesianallySized;
type TileSize = CartesianallySized;
type CanvasPadding = CartesianallySized;
type TileSpacing = CartesianallySized;

export interface CalculationOptions {
  canvas: CanvasSize
  tile: TileSize
  padding: CanvasPadding
  spacing: TileSpacing
  splitMethod: SplitMethod
}

type FullTiles = number;
type RemainingSpace = number;

type MaxFullTileResult = [FullTiles, RemainingSpace]
const maxFullTiles = (options: CalculationOptions, accessor: DimensionAccessor): MaxFullTileResult => {

  const length = accessor(options.canvas)
  const itemLength = accessor(options.tile)
  const padding = accessor(options.padding)
  const spacing = accessor(options.spacing)

  // not above the minimum, return 0
  if (length <= padding * 2) {
    return [0, 0]
  }

  const lengthWithoutPadding = length - 2 * padding

  // if the space isn't big enough for at least one tile then
  //  there will never be a full tile
  if (itemLength > lengthWithoutPadding) {
    return [0, lengthWithoutPadding - spacing]
  }

  // The first tile has no spacing, and it only complicates formula's. we can
  // remove it and add it back later. every subsequent tile has spacing.
  const withoutPaddingAndTile = lengthWithoutPadding - itemLength; 
  const itemWithSpacing = itemLength + spacing;

  // Edge case, since we sometimes fit exactly tiles in the space (no extra splits)
  if (withoutPaddingAndTile % itemWithSpacing === 0) {
    return [Math.floor(withoutPaddingAndTile / itemWithSpacing) + 1, 0]
  }
  
  // otherwise we have 2 split tiles, both with spacing (since we already removed
  //  the first tile without spacing)
  const availableSpace = withoutPaddingAndTile - 2 * spacing;

  // + 1 since we're adding on the one we removed earlier
  const maxFullTiles = Math.floor(availableSpace/itemWithSpacing) + 1

  const spaceForSplits = lengthWithoutPadding - (maxFullTiles * itemWithSpacing + spacing);

  // Edge case, it's possible we are trying to great split tiles in a 0 space 
  if (spaceForSplits === 0) {
    return [maxFullTiles - 1, itemLength + spacing]
  }

  return [maxFullTiles, spaceForSplits]
}

type DimensionAccessor = (obj: CartesianallySized) => number;
type TileSizingFunction = ([fullTiles, splitSpace]: MaxFullTileResult, accessor: DimensionAccessor) => number[];

const getTileSizes = (options: CalculationOptions): TileSizingFunction => {
  return ([fullTiles, splitSpace]: MaxFullTileResult, accessor: DimensionAccessor): number[] => {
    const itemLength = accessor(options.tile)
    const spacing = accessor(options.spacing);
    if (splitSpace === 0) {
      return Array(fullTiles).fill(itemLength);
    }

    // if we want at least half a tile in the split, and
    //  the remaing space is less than a tile and it's spacing
    //  just remove a full tile, the spacing will adjust
    if (options.splitMethod === SplitMethod.AtLeastHalfSplitTiles && fullTiles >= 1 && splitSpace < itemLength - spacing) {
      fullTiles -= 1;
      splitSpace += itemLength + spacing;
    }

    const splitTileLength = splitSpace / 2;

    return [ splitTileLength, ...Array(fullTiles).fill(itemLength), splitTileLength ]
  }
}

const calculateTiles = (options: CalculationOptions): Array<TileDimensions> => {
  const widthAccessor = (obj: CartesianallySized) => obj.width;
  const heightAccessor = (obj: CartesianallySized) => obj.height;
  const tileSizes = getTileSizes(options);

  const xTiles = tileSizes(maxFullTiles(options, widthAccessor), widthAccessor);
  const yTiles = tileSizes(maxFullTiles(options, heightAccessor), heightAccessor);

  // both X and Y tiles return:
  // - first tile: padding + 0 on the first tile
  // - n + 1 tile: padding + first tile + (currentTileIndex - 1) * (tileWidth + tileSpacing))
  // The second option is since the first tile could be variable sizes

  const { spacing, padding, tile } = options;

  return yTiles.flatMap((height, y) => {
    return xTiles.map((width, x) => {
      return {
        width,
        height,
        x: padding.width + ((x === 0) ? 0 : xTiles[0] + spacing.width + (spacing.width + tile.width) * (x - 1)),
        y: padding.height + ((y === 0) ? 0 : yTiles[0] + spacing.height + (spacing.height + tile.height) * (y - 1)),
      }
    })
  })
}

export {
  calculateTiles
};
