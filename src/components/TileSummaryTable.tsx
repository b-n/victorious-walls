import { TileDimensions } from '../lib/tiles'

interface TileSummaryTableOptions {
  tiles: TileDimensions[];
  className?: string;
}

const TileSummaryTable = ({ tiles, className = ''}: TileSummaryTableOptions) => {

  const tileSummaryMap = tiles
    .reduce((acc, t) => {
      const key = `${t.width} x ${t.height}`;
      if (!acc[key]) {
        acc[key] = 0
      }
      acc[key] += 1
      return acc;
    }, {} as Record<string, number>)

  const tileSummary = Object.keys(tileSummaryMap).map((key) => ({
    label: key,
    count: tileSummaryMap[key]
  }))

  return (
    <table className={className}>
      <thead>
        <tr>
          <th className="header header-label">Label</th>
          <th className="header header-count">Count</th>
        </tr>
      </thead>
      <tbody>
        {tileSummary.map((summaryItem) => (
          <tr>
            <td className="row row-label">{summaryItem.label}</td>
            <td className="row row-count">{summaryItem.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { TileSummaryTable }
