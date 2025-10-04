import { useEffect, useMemo, useState } from 'react'

type RiskKind = 'very hot' | 'very cold' | 'very windy' | 'very wet' | 'very uncomfortable'

type RiskScore = {
  kind: RiskKind
  probability: number
}

type ForecastResponse = {
  locationName: string
  latitude: number
  longitude: number
  isoDateTime: string
  risks: RiskScore[]
}

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'

function formatHourLabel(dateIso: string) {
  const d = new Date(dateIso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function App() {
  const [query, setQuery] = useState('Thrissur, India')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16))
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [data, setData] = useState<ForecastResponse | null>(null)

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    // Initial fetch with defaults
    void fetchRisk()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchRisk() {
    try {
      setLoading(true)
      setError(null)

      const url = new URL(baseUrl + '/api/risk')
      url.searchParams.set('q', query)
      url.searchParams.set('datetime', new Date(date).toISOString())

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json = (await res.json()) as ForecastResponse
      setData(json)
    } catch (err) {
      console.error(err)
      setError('Unable to load risk right now. Showing a mock preview.')
      // Fallback mock for UI development
      const mock: ForecastResponse = {
        locationName: 'Thrissur, India',
        latitude: 10.52,
        longitude: 76.21,
        isoDateTime: new Date(date).toISOString(),
        risks: [
          { kind: 'very hot', probability: 0.12 },
          { kind: 'very cold', probability: 0.04 },
          { kind: 'very windy', probability: 0.18 },
          { kind: 'very wet', probability: 0.24 },
          { kind: 'very uncomfortable', probability: 0.35 },
        ],
      }
      setData(mock)
    } finally {
      setLoading(false)
    }
  }

  const sorted = useMemo(
    () => (data?.risks ? [...data.risks].sort((a, b) => b.probability - a.probability) : []),
    [data]
  )

  return (
    <div className="h-full w-full relative">
      {/* Background image */}
      <img
        src={DEFAULT_BG}
        alt="sky"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative h-full w-full max-w-md mx-auto px-4 py-5 text-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="text-sm/6 opacity-90">
            {data?.locationName || '—'}, {new Date(date).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </div>
          <button
            className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/25 backdrop-blur-xs"
            aria-label="Menu"
          >
            <span className="i">≡</span>
          </button>
        </div>

        {/* Temperature Placeholder */}
        <div className="mt-8 text-center">
          <div className="text-[140px] leading-none font-semibold drop-shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            {Math.round(23)}
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl bg-white/20 placeholder-white/70 text-white px-4 py-3 backdrop-blur-xs outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Search location"
            />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl bg-white/20 text-white px-3 py-3 backdrop-blur-xs outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              onClick={fetchRisk}
              disabled={loading}
              className="rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 px-4 py-3 font-medium shadow-soft"
            >
              {loading ? 'Loading…' : 'Check'}
            </button>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/20 backdrop-blur-xs px-4 py-2">
            <span className="text-sm">Top risk</span>
            {sorted[0] ? (
              <div className="text-sm font-semibold">
                {sorted[0].kind} · {(sorted[0].probability * 100).toFixed(0)}%
              </div>
            ) : (
              <div className="text-sm">—</div>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="mt-5 rounded-3xl bg-white/20 backdrop-blur-md shadow-soft p-5 grid grid-cols-3 gap-4">
          {(['very wet', 'very uncomfortable', 'very windy'] as RiskKind[]).map((k) => {
            const value = data?.risks.find((r) => r.kind === k)?.probability ?? 0
            return (
              <div key={k} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
                  {(value * 100).toFixed(0)}
                </div>
                <div className="mt-2 text-xs opacity-90 capitalize">{k}</div>
              </div>
            )
          })}
        </div>

        {/* Hourly mini-graph placeholder */}
        <div className="mt-5 rounded-3xl bg-white/15 backdrop-blur-md p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            {Array.from({ length: 3 }).map((_, i) => {
              const base = data?.isoDateTime ?? new Date().toISOString()
              const d = new Date(base)
              d.setHours(d.getHours() + i)
              return (
                <div key={i} className="opacity-90">
                  <div className="text-xs">{formatHourLabel(d.toISOString())}</div>
                  <div className="mt-2">🌙</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Risks list */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          {sorted.map((r) => (
            <div key={r.kind} className="flex items-center justify-between rounded-2xl bg-white/15 backdrop-blur-xs px-4 py-3">
              <div className="capitalize">{r.kind}</div>
              <div className="font-semibold">{(r.probability * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
