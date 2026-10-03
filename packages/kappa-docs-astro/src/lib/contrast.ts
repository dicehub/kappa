/**
 * WCAG contrast measurement for Kappa documentation.
 *
 * Ratios stay unrounded so the published contrast tables, the generator
 * metadata, and `contrast.test.mjs` all compare identical numbers. Alpha
 * foregrounds are composited over their background before measuring.
 */

export interface ContrastColor {
  alpha: number;
  blue: number;
  green: number;
  red: number;
}

const HEX_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_PATTERN = /^rgba?\((.*)\)$/i;
const NUMBER_PATTERN = /^(?:\d+(?:\.\d+)?|\.\d+)(%)?$/;

/** sRGB channel (0-255) to the WCAG relative-luminance curve. */
const toLinearChannel = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const parseChannel = (token: string, source: string) => {
  const match = NUMBER_PATTERN.exec(token);
  const channel = match?.[1] === "%" ? (Number.parseFloat(token) / 100) * 255 : Number.parseFloat(token);
  if (!match || !Number.isFinite(channel) || channel < 0 || channel > 255) {
    throw new Error(`Unsupported color channel "${token}" in ${source}`);
  }
  return channel;
};

const parseAlpha = (token: string, source: string) => {
  const match = NUMBER_PATTERN.exec(token);
  const alpha = match?.[1] === "%" ? Number.parseFloat(token) / 100 : Number.parseFloat(token);
  if (!match || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error(`Unsupported alpha "${token}" in ${source}`);
  }
  return alpha;
};

/**
 * Parse `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`, and `rgba()`.
 * Malformed channels, extra values, and trailing text are rejected instead of
 * being partially parsed.
 */
export function parseColor(value: string): ContrastColor {
  const source = value.trim();
  const hex = HEX_PATTERN.test(source) ? source.slice(1) : null;
  const rgb = RGB_PATTERN.exec(source)?.[1] ?? null;

  if (hex) {
    const expanded =
      hex.length <= 4 ? [...hex].map((digit) => `${digit}${digit}`).join("") : hex;
    const [red = "ff", green = "ff", blue = "ff", alpha = "ff"] = expanded.match(/../g) ?? [];
    return {
      red: Number.parseInt(red, 16),
      green: Number.parseInt(green, 16),
      blue: Number.parseInt(blue, 16),
      alpha: Number.parseInt(alpha, 16) / 255,
    };
  }

  if (rgb === null || rgb.trim() === "") throw new Error(`Unsupported color value: ${value}`);

  /*
   * Accepted shapes: `r, g, b`, `r, g, b, a`, `r g b`, and `r g b / a`.
   * Separators are validated per shape, so repeated commas, trailing commas,
   * mixed comma/slash forms, and extra tokens are rejected instead of being
   * silently collapsed into a valid-looking color.
   */
  const body = rgb.trim();
  const commaForm = body.includes(",");
  if (commaForm && body.includes("/")) throw new Error(`Unsupported color value: ${value}`);

  const tokens = commaForm
    ? body.split(",").map((token) => token.trim())
    : body.replaceAll("/", " / ").split(/\s+/);
  if (tokens.some((token) => token === "") || tokens.filter((token) => token === "/").length > 1) {
    throw new Error(`Unsupported color value: ${value}`);
  }

  const slash = tokens.indexOf("/");
  const channels = slash < 0 ? tokens.slice(0, 3) : tokens.slice(0, slash);
  const alphaToken = slash < 0 ? tokens[3] : tokens[slash + 1];
  const expectedLength = commaForm ? (tokens.length === 3 ? 3 : 4) : slash < 0 ? 3 : 5;
  if (channels.length !== 3 || tokens.length !== expectedLength) {
    throw new Error(`Unsupported color value: ${value}`);
  }

  const [red, green, blue] = channels.map((channel) => parseChannel(channel, value));
  return {
    red,
    green,
    blue,
    alpha: alphaToken === undefined ? 1 : parseAlpha(alphaToken, value),
  };
}

/** Composite a translucent foreground over an opaque or translucent backdrop. */
export function compositeOver(
  foreground: ContrastColor,
  background: ContrastColor,
): ContrastColor {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
  if (alpha === 0) return { ...background, alpha: 0 };

  const mix = (front: number, back: number) =>
    (front * foreground.alpha + back * background.alpha * (1 - foreground.alpha)) / alpha;

  return {
    red: mix(foreground.red, background.red),
    green: mix(foreground.green, background.green),
    blue: mix(foreground.blue, background.blue),
    alpha,
  };
}

export function relativeLuminance(color: ContrastColor): number {
  return (
    0.2126 * toLinearChannel(color.red) +
    0.7152 * toLinearChannel(color.green) +
    0.0722 * toLinearChannel(color.blue)
  );
}

/**
 * Contrast ratio between two CSS colors, measured from unrounded luminance.
 * A translucent background needs the opaque backdrop it sits on, passed as the
 * third argument, so the pair is measured against the surface a reader sees.
 */
export function contrastRatio(
  foregroundValue: string,
  backgroundValue: string,
  backdropValue?: string,
): number {
  const background = parseColor(backgroundValue);
  let surface = background;

  if (background.alpha < 1) {
    if (backdropValue === undefined) {
      throw new Error(
        `Translucent background "${backgroundValue}" needs an opaque backdrop as the third argument.`,
      );
    }
    const backdrop = parseColor(backdropValue);
    if (backdrop.alpha < 1) throw new Error(`Backdrop must be opaque: ${backdropValue}`);
    surface = compositeOver(background, backdrop);
  }

  const foreground = compositeOver(parseColor(foregroundValue), surface);
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(surface));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(surface));
  return (lighter + 0.05) / (darker + 0.05);
}

/** Display form only. Comparisons always use the unrounded ratio. */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
