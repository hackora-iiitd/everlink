import { useEffect, useMemo, useRef, useState } from 'react'
import cytoscape, { type Core, type EdgeSingular, type NodeSingular } from 'cytoscape'
import { Filter, RotateCcw, Users } from 'lucide-react'
import type { CommunityGraphData, GraphNodeKind } from '../../lib/communityGraphData'

const colors: Record<GraphNodeKind, string> = { person: '#A8D5A2', skill: '#E2B407', interest: '#E2B407', project: '#E2B407', department: '#E2B407' }
const labels: Record<GraphNodeKind, string> = { person: 'People', skill: 'Skills', interest: 'Interests', project: 'Projects', department: 'Departments' }

export default function CommunityGraph({ data, currentUserId = 'current-user' }: { data: CommunityGraphData; currentUserId?: string }) {
  const mount = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const [selectedId, setSelectedId] = useState(currentUserId)
  const [enabled, setEnabled] = useState<Record<GraphNodeKind, boolean>>({ person: true, skill: true, interest: true, project: true, department: true })
  const [error, setError] = useState('')
  const selected = data.nodes.find((node) => node.id === selectedId)
  const visibleData = useMemo(() => {
    const nodes = data.nodes.filter((node) => enabled[node.kind])
    const nodeIds = new Set(nodes.map((node) => node.id))
    const edgeIds = new Set<string>()
    const edges = data.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target) && !edgeIds.has(edge.id) && (edgeIds.add(edge.id), true))
    return { nodes, edges }
  }, [data, enabled])

  useEffect(() => {
    if (!mount.current) return
    let cy: Core | null = null
    try {
      cy = cytoscape({
        container: mount.current,
        elements: [
          ...visibleData.nodes.map((node, index) => ({ data: { ...node, ...(node.id === currentUserId ? { current: true } : {}) }, position: node.id === currentUserId ? { x: 360, y: 230 } : { x: 100 + (index % 4) * 150, y: 80 + Math.floor(index / 4) * 160 } })),
          ...visibleData.edges.map((edge) => ({ data: edge })),
        ],
        style: [
          { selector: 'node', style: { label: 'data(label)', 'background-color': (element: NodeSingular) => colors[element.data('kind') as GraphNodeKind], color: '#000000', 'text-outline-color': '#FFFFFF', 'text-outline-width': 1, 'font-size': '9px', 'font-weight': 700, 'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap', 'text-overflow-wrap': 'anywhere', 'text-max-width': '52px', width: '62px', height: '62px', shape: 'ellipse', 'border-width': (element: NodeSingular) => element.data('kind') === 'person' ? 1 : 0, 'border-color': '#135106', 'overlay-opacity': 0 } },
          { selector: 'node[current]', style: { width: '70px', height: '70px', 'background-color': '#135106', 'font-size': '10px', 'border-width': 0 } },
          { selector: 'edge', style: { width: 'mapData(strength, 0.1, 1, 1.5, 5)', 'line-color': '#135106', opacity: 0.78, 'curve-style': 'bezier', 'source-arrow-shape': 'none', 'target-arrow-shape': 'none' } },
          { selector: 'node.dim', style: { 'border-width': 1, 'border-color': '#6B7280', 'border-opacity': 0.6 } },
          { selector: 'node.focus', style: { 'border-width': 2, 'border-color': '#135106', 'border-opacity': 0.8 } },
          { selector: 'edge.dim', style: { opacity: 0.14 } },
          { selector: 'edge.focus', style: { width: 'mapData(strength, 0.1, 1, 2.5, 6)', opacity: 0.95 } },
          { selector: 'node.selected', style: { 'border-width': 3, 'border-color': '#FFFFFF', 'border-opacity': 1 } },
          { selector: 'edge.selected', style: { width: 'mapData(strength, 0.1, 1, 3, 7)', opacity: 1 } },
        ],
        layout: { name: 'cose', animate: false, randomize: false, fit: true, padding: 54, nodeDimensionsIncludeLabels: true, componentSpacing: 110, nodeRepulsion: 9000, idealEdgeLength: (edge: EdgeSingular) => 110 + (1 - Number(edge.data('strength'))) * 140, edgeElasticity: 0.35, gravity: 0.28 } as cytoscape.LayoutOptions,
      })
      cy.on('tap', 'node', (event) => setSelectedId((event.target as NodeSingular).id()))
      cy.on('tap', 'edge', (event) => setSelectedId((event.target as EdgeSingular).id()))
      cy.on('tap', (event) => { if (event.target === cy) setSelectedId(currentUserId) })
      cyRef.current = cy
    } catch { setError('The community network could not be displayed. Please refresh and try again.') }
    return () => cy?.destroy()
  }, [visibleData, currentUserId])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().removeClass('dim focus selected')
    const element = cy.getElementById(selectedId)
    if (element.nonempty()) { element.addClass('selected'); const neighborhood = element.closedNeighborhood(); cy.elements().not(neighborhood).addClass('dim'); neighborhood.addClass('focus') }
  }, [selectedId])

  const selectedEdge = data.edges.find((edge) => edge.id === selectedId)
  const direct = visibleData.edges.filter((edge) => edge.source === currentUserId || edge.target === currentUserId).length
  const indirect = visibleData.nodes.filter((node) => node.id !== currentUserId && !visibleData.edges.some((edge) => (edge.source === currentUserId && edge.target === node.id) || (edge.target === currentUserId && edge.source === node.id))).length
  const strongest = [...visibleData.edges].sort((a, b) => b.strength - a.strength)[0]
  const reset = () => { setSelectedId(currentUserId); cyRef.current?.fit(undefined, 54) }
  return <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat label="People shown" value={visibleData.nodes.filter((node) => node.kind === 'person').length} /><Stat label="Direct connections" value={direct} /><Stat label="Indirect connections" value={indirect} /><Stat label="Strongest" value={strongest ? `${Math.round(strongest.strength * 100)}%` : '—'} /></div>
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{(Object.keys(labels) as GraphNodeKind[]).map((kind) => <label key={kind} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/75"><input type="checkbox" checked={enabled[kind]} onChange={() => setEnabled((previous) => ({ ...previous, [kind]: !previous[kind] }))} className="accent-forest-green" />{labels[kind]}</label>)}</div><button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-forest-green/25 px-3 py-1.5 text-sm font-semibold text-forest-green focus:outline-none focus:ring-2 focus:ring-teal" onClick={reset}><RotateCcw size={14} /> Fit graph</button></div>
    {error ? <p role="alert" className="rounded-xl bg-cream-surface p-4 text-sm text-ink">{error}</p> : visibleData.nodes.length === 0 ? <p className="rounded-xl bg-cream-surface p-4 text-sm text-ink">No nodes match these filters.</p> : <div ref={mount} className="h-[420px] w-full rounded-xl border border-forest-green/15 bg-white-surface sm:h-[470px]" aria-label="Interactive community network. Pan, zoom, drag nodes, and select nodes or relationships." />}
    <div className="grid gap-4 rounded-xl bg-cream-surface p-4 sm:grid-cols-[1fr_auto]"><div>{selectedEdge ? <><p className="font-bold text-forest-green">{selectedEdge.type} · {Math.round(selectedEdge.strength * 100)}% relevance</p><p className="mt-1 text-sm text-ink/80">{selectedEdge.explanation}</p></> : selected ? <><p className="font-bold text-forest-green">{selected.label} <span className="font-normal text-ink/60">· {selected.role ?? selected.detail}</span></p>{selected.skills && <p className="mt-1 text-sm text-ink/75">Skills: {selected.skills.join(', ')}</p>}{selected.interests && <p className="text-sm text-ink/75">Interests: {selected.interests.join(', ')}</p>}</> : <p className="text-sm text-ink/70">Select a node or relationship for details.</p>}</div><div className="text-xs text-ink/65"><p className="font-bold"><Filter size={12} className="mr-1 inline" />Legend</p><p className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-forest-green" />Dark green — You</p><p className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#A8D5A2]" />Light green — People</p><p className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-buttermilk" />Yellow — Topics, skills, and projects</p><p className="mt-1">Thicker, shorter green lines = stronger relevance</p></div></div>
  </div>
}
function Stat({ label, value }: { label: string; value: string | number }) { return <div className="rounded-xl border border-forest-green/15 p-3"><p className="font-display text-xl font-extrabold text-forest-green"><Users size={15} className="mr-1 inline" />{value}</p><p className="text-xs text-ink/65">{label}</p></div> }
