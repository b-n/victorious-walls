import { TileDimensions } from '../lib/tiles'

interface TileSummaryTableOptions {
  tiles: TileDimensions[];
  className?: string;
}

interface SummaryItem {
  width: number;
  height: number;
  quantity: number;
}

const TileSummaryTable = ({ tiles, className = ''}: TileSummaryTableOptions) => {

  const tileSummary = Object.values(
    tiles
      .reduce((acc, t) => {
        const { width, height } = t;
        const key = `${width}-${height}`;
        if (!acc[key]) {
          acc[key] = {
            width,
            height,
            quantity: 0
          }
        }
        acc[key].quantity += 1
        return acc;
      }, {} as Record<string, SummaryItem>)
  )

  return (
    <table className={className}>
      <thead>
        <tr>
          <th className="header header-label">Width</th>
          <th className="header header-label">Height</th>
          <th className="header header-quantity">Count</th>
        </tr>
      </thead>
      <tbody>
        {tileSummary.map(({ width, height, quantity }) => (
          <tr key={`${width}x${height}`}>
            <td className="row row-label">{width}</td>
            <td className="row row-label">{height}</td>
            <td className="row row-quantity">{quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { TileSummaryTable }
