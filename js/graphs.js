export function renderXpGraph(data) {
  // SVG area chart for XP over time
  const width = 400, height = 250, pad = 40
  const points = data.map(d => ({ x: new Date(d.createdAt), y: d.amount }))
  points.sort((a, b) => a.x - b.x)

  let cumulative = 0
  const cumPoints = points.map(p => {
    cumulative += p.y
    return { x: p.x, y: cumulative }
  })

  if (cumPoints.length === 0) return ''

  const minDate = cumPoints[0].x.getTime()
  const maxDate = cumPoints[cumPoints.length - 1].x.getTime()
  const maxVal = Math.max(...cumPoints.map(p => p.y))
  const dateRange = maxDate - minDate || 1

  const scaleX = (d) => pad + ((d.getTime() - minDate) / dateRange) * (width - 2 * pad)
  const scaleY = (v) => height - pad - (v / maxVal) * (height - 2 * pad)

  const pathD = cumPoints.map((p, i) => {
    const x = scaleX(p.x).toFixed(1)
    const y = scaleY(p.y).toFixed(1)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const fillD = pathD + ` L ${scaleX(cumPoints[cumPoints.length - 1].x).toFixed(1)} ${height - pad} L ${scaleX(cumPoints[0].x).toFixed(1)} ${height - pad} Z`

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent, #4f46e5)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--accent, #4f46e5)" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#xpGrad)"/>
      <path d="${pathD}" fill="none" stroke="var(--accent, #4f46e5)" stroke-width="2"/>
      ${cumPoints.map((p, i) => {
        if (i === 0 || i === cumPoints.length - 1 || i % Math.max(1, Math.floor(cumPoints.length / 5)) === 0) {
          const x = scaleX(p.x).toFixed(1)
          const y = scaleY(p.y).toFixed(1)
          return `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent, #4f46e5)"/>`
        }
        return ''
      }).join('\n      ')}
      <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)">Time</text>
      <text x="10" y="${height / 2}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)" transform="rotate(-90, 10, ${height / 2})">XP</text>
    </svg>`
}

export function renderProjectsGraph(data) {
  // Bar chart for project results (pass/fail counts)
  const width = 400, height = 250, pad = 40
  const barWidth = 30
  const gap = 10

  if (data.length === 0) return ''

  const maxCount = Math.max(...data.map(d => Math.max(d.pass, d.fail)), 1)

  const scaleY = (v) => height - pad - (v / maxCount) * (height - 2 * pad)
  const barH = (v) => (v / maxCount) * (height - 2 * pad)

  const chartWidth = data.length * (barWidth * 2 + gap) + gap
  const effectiveWidth = Math.max(width, chartWidth)

  return `
    <svg viewBox="0 0 ${effectiveWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${data.map((d, i) => {
        const x = gap + i * (barWidth * 2 + gap)
        const passH = barH(d.pass)
        const failH = barH(d.fail)
        const label = d.name.length > 10 ? d.name.slice(0, 10) + '...' : d.name
        return `
          <rect x="${x}" y="${scaleY(d.pass)}" width="${barWidth}" height="${passH}" fill="var(--success, #16a34a)" rx="2">
            <title>${d.name}: ${d.pass} pass</title>
          </rect>
          <rect x="${x + barWidth}" y="${scaleY(d.fail)}" width="${barWidth}" height="${failH}" fill="var(--error, #dc2626)" rx="2">
            <title>${d.name}: ${d.fail} fail</title>
          </rect>
          <text x="${x + barWidth}" y="${height - 5}" text-anchor="middle" font-size="8" fill="var(--text-secondary, #666)" transform="rotate(-45, ${x + barWidth}, ${height - 5})">${label}</text>`
      }).join('\n      ')}
      <text x="${effectiveWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)" transform="">Projects</text>
      <text x="10" y="${height / 2}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)" transform="rotate(-90, 10, ${height / 2})">Count</text>
      <rect x="${effectiveWidth - 100}" y="10" width="10" height="10" fill="var(--success, #16a34a)"/>
      <text x="${effectiveWidth - 86}" y="20" font-size="10" fill="var(--text-secondary, #666)">Pass</text>
      <rect x="${effectiveWidth - 50}" y="10" width="10" height="10" fill="var(--error, #dc2626)"/>
      <text x="${effectiveWidth - 36}" y="20" font-size="10" fill="var(--text-secondary, #666)">Fail</text>
    </svg>`
}
