export function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function formatTimeInTimeZone(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(new Date(iso))
}

export function formatDayHeader(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatModalDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).replace(" г.", "")
}

export const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

// Mon-first: Пн Вт Ср Чт Пт Сб Вс
export const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDow = new Date(year, month, 1).getDay() // 0=Sun
  const padding = (firstDow + 6) % 7                // convert to Mon-first
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array<null>(padding).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const grid: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) grid.push(cells.slice(i, i + 7))
  return grid
}
