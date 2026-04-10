import { Box, Group, Stack, Text, UnstyledButton, useComputedColorScheme } from '@mantine/core'
import { useMemo, useState } from 'react'
import { MONTHS_RU, WEEK_DAYS, buildMonthGrid, todayKey } from '../../lib/dateUtils'
import { IconChevron } from '../../ui/icons'

export interface BookingCalendarProps {
  availableDates: Set<string>
  selectedDate: string | null
  onSelect: (key: string) => void
}

export function BookingCalendar({ availableDates, selectedDate, onSelect }: BookingCalendarProps) {
  const colorScheme = useComputedColorScheme('light')
  const today = todayKey()
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fw={600} size="md">
          {MONTHS_RU[viewMonth]}{' '}
          <Text span c="dimmed" fw={400}>{viewYear}</Text>
        </Text>
        <Group gap={4}>
          <UnstyledButton
            onClick={prevMonth}
            style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}
          >
            <IconChevron direction="left" />
          </UnstyledButton>
          <UnstyledButton
            onClick={nextMonth}
            style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}
          >
            <IconChevron direction="right" />
          </UnstyledButton>
        </Group>
      </Group>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          textAlign: 'center',
        }}
      >
        {WEEK_DAYS.map(d => (
          <Text key={d} size="xs" c="dimmed" fw={500}>{d}</Text>
        ))}
      </Box>

      <Stack gap={4}>
        {grid.map((week, wi) => (
          <Box
            key={wi}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}
          >
            {week.map((day, di) => {
              if (!day) return <div key={di} />
              const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isAvailable = availableDates.has(key)
              const isSelected = selectedDate === key
              const isToday = today === key

              let bg = 'transparent'
              let color = 'var(--mantine-color-dimmed)'
              let border = 'none'
              let fw: number | undefined = undefined
              const cursor = isAvailable ? 'pointer' : 'default'

              if (isSelected) {
                bg = 'var(--mantine-color-brand-6)'
                color = 'white'
                fw = 600
              } else if (isAvailable && isToday) {
                bg = colorScheme === 'dark' ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-dark-7)'
                color = 'white'
                border = '2px solid var(--mantine-color-brand-5)'
              } else if (isAvailable) {
                bg = colorScheme === 'dark' ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-dark-7)'
                color = 'white'
              } else if (isToday) {
                border = '2px solid var(--mantine-color-brand-5)'
                color = 'var(--mantine-color-brand-6)'
              }

              return (
                <UnstyledButton
                  key={di}
                  onClick={() => { if (isAvailable) onSelect(key) }}
                  style={{
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    color,
                    border,
                    borderRadius: 8,
                    cursor,
                    fontWeight: fw,
                    fontSize: 14,
                    opacity: !isAvailable && !isToday ? 0.35 : 1,
                  }}
                >
                  {day}
                </UnstyledButton>
              )
            })}
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
