export function getAmbientMood(sleepHours: number | null) {
  const hours = sleepHours ?? 7;
  const mood = Math.max(-1, Math.min(1, (hours - 7) / 2));

  const hue = mood > 0 ? 43 + (mood * 5) : 43 + (mood * 172);
  const saturation = mood > 0 ? 78 + (mood * 22) : 78 + (mood * 38);
  const lightness = 94;
  const pageSaturation = mood > 0 ? 100 + (mood * 10) : 100 + (mood * 15);

  return {
    background: `hsl(${hue}, ${Math.max(0, saturation)}%, ${lightness}%)`,
    pageSaturation: `${pageSaturation}%`,
  };
}
