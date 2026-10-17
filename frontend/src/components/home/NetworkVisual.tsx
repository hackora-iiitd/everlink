type Node = {
  id: string
  label: string
  caption: string
  fill: string
  text: string
  stroke: string
}

const CX = 280
const CY = 270
const ORBIT = 195

// Order around the pentagon, starting at the top and going clockwise (matches the pitch deck).
const nodes: Node[] = [
  { id: 'students', label: 'Students', caption: 'goals & skills', fill: '#FFFFFF', text: '#135106', stroke: '#E2B407' },
  { id: 'professors', label: 'Professors', caption: 'research & guidance', fill: '#053464', text: '#FFFFFF', stroke: '#053464' },
  { id: 'ventures', label: 'Ventures', caption: 'teams & startups', fill: '#FFFFFF', text: '#053464', stroke: '#2A7F7B' },
  { id: 'research', label: 'Research', caption: 'projects & papers', fill: '#E2B407', text: '#212529', stroke: '#E2B407' },
  { id: 'alumni', label: 'Alumni', caption: 'industry & referrals', fill: '#2A7F7B', text: '#FFFFFF', stroke: '#2A7F7B' },
]

const positioned = nodes.map((n, i) => {
  const angle = (-90 + i * 72) * (Math.PI / 180)
  return { ...n, x: CX + ORBIT * Math.cos(angle), y: CY + ORBIT * Math.sin(angle) }
})

// Small "skill" satellites hinting at the shared graph underneath.
const satellites = [
  { x: 92, y: 120, r: 5 },
  { x: 470, y: 96, r: 4 },
  { x: 516, y: 330, r: 6 },
  { x: 56, y: 330, r: 4 },
  { x: 150, y: 482, r: 5 },
  { x: 420, y: 500, r: 4 },
  { x: 300, y: 28, r: 3 },
]

export default function NetworkVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <svg
        viewBox="0 0 560 540"
        role="img"
        aria-label="Everlink at the centre of a network connecting Students, Alumni, Professors, Research and Ventures"
        className="h-auto w-full overflow-visible"
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E2B407" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E2B407" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* faint satellites */}
        {satellites.map((s, i) => (
          <g key={i}>
            <line x1={s.x} y1={s.y} x2={CX} y2={CY} stroke="#DCF6F4" strokeOpacity="0.18" strokeWidth="1" />
            <circle cx={s.x} cy={s.y} r={s.r} fill="#DCF6F4" fillOpacity="0.45" />
          </g>
        ))}

        {/* ring between neighbours */}
        {positioned.map((n, i) => {
          const next = positioned[(i + 1) % positioned.length]
          return (
            <line
              key={`ring-${n.id}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="#DCF6F4"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          )
        })}

        {/* spokes + travelling pulses */}
        {positioned.map((n, i) => (
          <g key={`spoke-${n.id}`}>
            <line x1={CX} y1={CY} x2={n.x} y2={n.y} stroke="#DCF6F4" strokeOpacity="0.45" strokeWidth="2" />
            <circle r="4.5" fill="#E2B407" className="ev-pulse">
              <animateMotion
                dur={`${3 + i * 0.55}s`}
                repeatCount="indefinite"
                path={`M${CX},${CY} L${n.x},${n.y}`}
              />
            </circle>
          </g>
        ))}

        {/* hub */}
        <circle cx={CX} cy={CY} r="96" fill="url(#hubGlow)" />
        <circle cx={CX} cy={CY} r="64" fill="#DCF6F4" stroke="#E2B407" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="64" fill="none" stroke="#E2B407" strokeOpacity="0.6" className="animate-pulse-ring" style={{ transformOrigin: `${CX}px ${CY}px` }} />
        <text x={CX} y={CY + 7} textAnchor="middle" fontSize="22" fontWeight="800" fill="#135106" style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
          Everlink
        </text>

        {/* nodes */}
        {positioned.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="50" fill={n.fill} stroke={n.id === 'students' ? n.stroke : '#DCF6F4'} strokeWidth="3" />
            <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="15" fontWeight="700" fill={n.text}>
              {n.label}
            </text>
            <text x={n.x} y={n.y + 15} textAnchor="middle" fontSize="9.5" fill={n.text} fillOpacity="0.8">
              {n.caption}
            </text>
          </g>
        ))}
      </svg>

      <style>{`@media (prefers-reduced-motion: reduce){.ev-pulse{display:none}.animate-pulse-ring{animation:none}}`}</style>
    </div>
  )
}
