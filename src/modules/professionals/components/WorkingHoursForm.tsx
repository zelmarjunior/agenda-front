'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import type { DayOfWeek, WorkingHour } from '@/types/professionals.types';

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'MON', label: 'Segunda' },
  { value: 'TUE', label: 'Terça' },
  { value: 'WED', label: 'Quarta' },
  { value: 'THU', label: 'Quinta' },
  { value: 'FRI', label: 'Sexta' },
  { value: 'SAT', label: 'Sábado' },
  { value: 'SUN', label: 'Domingo' },
];

interface DayConfig {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

type WeekConfig = Record<DayOfWeek, DayConfig>;

function buildInitial(existing: WorkingHour[]): WeekConfig {
  const defaults: WeekConfig = {} as WeekConfig;
  for (const d of DAYS) {
    const found = existing.find((h) => h.dayOfWeek === d.value);
    defaults[d.value] = found
      ? { enabled: true, startTime: found.startTime, endTime: found.endTime }
      : { enabled: false, startTime: '08:00', endTime: '18:00' };
  }
  return defaults;
}

interface WorkingHoursFormProps {
  existing: WorkingHour[];
  onSubmit: (
    hours: Array<{ dayOfWeek: DayOfWeek; startTime: string; endTime: string }>,
  ) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function WorkingHoursForm({
  existing,
  onSubmit,
  onCancel,
}: WorkingHoursFormProps): JSX.Element {
  const [config, setConfig] = useState<WeekConfig>(() => buildInitial(existing));
  const [saving, setSaving] = useState(false);

  function toggle(day: DayOfWeek): void {
    setConfig((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  }

  function updateTime(day: DayOfWeek, field: 'startTime' | 'endTime', value: string): void {
    setConfig((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  async function handleSubmit(): Promise<void> {
    setSaving(true);
    try {
      const hours = DAYS.filter((d) => config[d.value].enabled).map((d) => ({
        dayOfWeek: d.value,
        startTime: config[d.value].startTime,
        endTime: config[d.value].endTime,
      }));
      await onSubmit(hours);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      {DAYS.map(({ value, label }) => {
        const day = config[value];
        return (
          <div key={value} className="flex items-center gap-4">
            <label className="flex items-center gap-2 w-28 cursor-pointer">
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={() => toggle(value)}
                className="rounded"
              />
              <span
                className={`text-sm font-medium ${day.enabled ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {label}
              </span>
            </label>
            {day.enabled ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => updateTime(value, 'startTime', e.target.value)}
                  className={inputCls}
                />
                <span className="text-sm text-gray-400">até</span>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => updateTime(value, 'endTime', e.target.value)}
                  className={inputCls}
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400">Folga</span>
            )}
          </div>
        );
      })}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" loading={saving} onClick={handleSubmit}>
          Salvar horários
        </Button>
      </div>
    </div>
  );
}
