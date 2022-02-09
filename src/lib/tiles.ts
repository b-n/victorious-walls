export interface TileDimensions {
  x: number
  y: number
  width: number
  height: number
}

export enum SplitMethod {
  MostFullTiles,
  AtLeastHalfSplitTiles,
}

type HasSplitTiles = boolean;

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
  splitTile: SplitMethod
}

type FullTiles = number;

type MaxFullTileResult = [FullTiles, HasSplitTiles]
const maxFullTiles = (options: CalculationOptions, accessor: DimensionAccessor): MaxFullTileResult => {

  const length = accessor(options.canvas)
  const itemLength = accessor(options.tile)
  const padding = accessor(options.padding)
  const spacing = accessor(options.spacing)


  // not above the minimum, return 0
  if (length <= padding * 2) {
    return [0, true]
  }

  const lengthWithoutPadding = length - 2 * padding

  // if the space isn't big enough for at least one tile, it'll always be 0
  if (itemLength > lengthWithoutPadding) {
    return [0, true]
  }

  // The first tile has no spacing, and it only complicates formula's. we can
  // remove it and add it back later. every subsequent tile has spacing.
  const withoutPaddingAndTile = lengthWithoutPadding - itemLength; 
  const itemWithSpacing = itemLength + spacing;

  // Edge case, since we sometimes fit exactly tiles in the space (no extra splits)
  if (withoutPaddingAndTile % itemWithSpacing === 0) {
    return [Math.floor(withoutPaddingAndTile / itemWithSpacing) + 1, false]
  }
  
  // Otherwise we assume we always have 2 spaces for the split tiles (technically
  // only for the second split tile + adding the space back to the first, but it
  // has the same net effect) - 1 because we need at least some tile to split
  let remainingSpace = withoutPaddingAndTile - 2 * spacing - 1;

  // return how many full tiles which is that remaining space floored + the one
  // we removed earlier
  return [Math.floor(remainingSpace/itemWithSpacing)+1, true]
}

type DimensionAccessor = (obj: CartesianallySized) => number;
type TileSizingFunction = ([fullTiles, hasSplits]: [FullTiles, HasSplitTiles], accessor: DimensionAccessor) => number[];

const getTileSizes = (options: CalculationOptions): TileSizingFunction => {
  return ([fullTiles, hasSplits]: MaxFullTileResult, accessor: DimensionAccessor): number[] => {
    const itemLength = accessor(options.tile)
    if (!hasSplits) {
      return Array(fullTiles).fill(itemLength);
    }

    // At least half a tile = removing one of the full tiles
    if (options.splitTile === SplitMethod.AtLeastHalfSplitTiles) {
      fullTiles -= 1;
    }

    const length = accessor(options.canvas);
    const padding = accessor(options.padding);
    const spacing = accessor(options.spacing);

    // total spacing = total full tiles + 1 since there will be a space either side for the split tiles
    const totalSpacing = (fullTiles + 1) * spacing
    const availableForSplitTiles = (length) - (2 * padding) - totalSpacing - (fullTiles * itemLength)

    const splitTileLength = availableForSplitTiles / 2

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
