// create different shades of green/red based on the value
// used for tables in Albino Skies section

export default function getColorShades(value: number, min: number, max: number) {
    const range = max - min;
    const step = range / 5;

    if (value >= max - step) return "bg-green-700/70 text-primary-dark";
    if (value >= max - 2 * step) return "bg-green-400/70 text-primary";
    if (value <= min + step) return "bg-red-700/70 text-primary-dark";
    if (value <= min + 2 * step) return "bg-red-400/70 text-primary";
    return "bg-transparent";
}