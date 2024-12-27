export const saturation = 50; // Lower saturation for pastel colors
export const lightness = 85; // Higher lightness for pastel colors

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};

export const getContrastYIQ = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    const yiq = ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
};
