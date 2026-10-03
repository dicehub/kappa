export const MATRIX_LOADER_SIZES = {
  sm: 16,
  base: 24,
  lg: 32,
} as const;

export const MATRIX_LOADER_SHAPES = ["square", "circle", "diamond", "ring"] as const;
export const MATRIX_LOADER_MOTIONS = ["pulse", "scan", "twinkle", "orbit"] as const;

export type MatrixLoaderSize = keyof typeof MATRIX_LOADER_SIZES;
export type MatrixLoaderShape = (typeof MATRIX_LOADER_SHAPES)[number];
export type MatrixLoaderMotion = (typeof MATRIX_LOADER_MOTIONS)[number];

export interface MatrixLoaderProps {
  /** Preset size or a custom positive pixel value. */
  size?: MatrixLoaderSize | number;
  /** Outline formed by the visible dots. */
  shape?: MatrixLoaderShape;
  /** Phase sequence used to animate the dots. */
  motion?: MatrixLoaderMotion;
  /** Duration of one animation cycle in milliseconds. */
  duration?: number;
  /** Text announced when the loader appears. Translate this value for the current locale. */
  label?: string;
  /** Hides the loader from assistive technology when nearby text already describes the state. */
  decorative?: boolean;
}

export interface MatrixLoaderDot {
  column: number;
  index: number;
  phase: number;
  row: number;
  visible: boolean;
}

export const MATRIX_LOADER_DIMENSION = 5;
export const MATRIX_LOADER_DEFAULT_SIZE = "base" satisfies MatrixLoaderSize;
export const MATRIX_LOADER_DEFAULT_SHAPE = "square" satisfies MatrixLoaderShape;
export const MATRIX_LOADER_DEFAULT_MOTION = "pulse" satisfies MatrixLoaderMotion;
export const MATRIX_LOADER_DEFAULT_DURATION = 1200;
export const MATRIX_LOADER_DEFAULT_LABEL = "Loading";

const MATRIX_LOADER_MIN_DURATION = 400;
const MATRIX_LOADER_MAX_DURATION = 10_000;
const MATRIX_LOADER_CENTER = (MATRIX_LOADER_DIMENSION - 1) / 2;

export const isMatrixLoaderSize = (value: unknown): value is MatrixLoaderSize =>
  typeof value === "string" && Object.hasOwn(MATRIX_LOADER_SIZES, value);

export const isMatrixLoaderShape = (value: unknown): value is MatrixLoaderShape =>
  typeof value === "string" && MATRIX_LOADER_SHAPES.includes(value as MatrixLoaderShape);

export const isMatrixLoaderMotion = (value: unknown): value is MatrixLoaderMotion =>
  typeof value === "string" && MATRIX_LOADER_MOTIONS.includes(value as MatrixLoaderMotion);

export const resolveMatrixLoaderSize = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  return isMatrixLoaderSize(value)
    ? MATRIX_LOADER_SIZES[value]
    : MATRIX_LOADER_SIZES[MATRIX_LOADER_DEFAULT_SIZE];
};

export const resolveMatrixLoaderShape = (value: unknown): MatrixLoaderShape =>
  isMatrixLoaderShape(value) ? value : MATRIX_LOADER_DEFAULT_SHAPE;

export const resolveMatrixLoaderMotion = (value: unknown): MatrixLoaderMotion =>
  isMatrixLoaderMotion(value) ? value : MATRIX_LOADER_DEFAULT_MOTION;

export const resolveMatrixLoaderDuration = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return MATRIX_LOADER_DEFAULT_DURATION;
  return Math.min(MATRIX_LOADER_MAX_DURATION, Math.max(MATRIX_LOADER_MIN_DURATION, value));
};

export const resolveMatrixLoaderLabel = (value: unknown): string =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : MATRIX_LOADER_DEFAULT_LABEL;

const isVisibleInShape = (row: number, column: number, shape: MatrixLoaderShape): boolean => {
  const x = column - MATRIX_LOADER_CENTER;
  const y = row - MATRIX_LOADER_CENTER;
  const distanceSquared = x * x + y * y;

  switch (shape) {
    case "circle":
      return distanceSquared <= 5;
    case "diamond":
      return Math.abs(x) + Math.abs(y) <= MATRIX_LOADER_CENTER;
    case "ring":
      return distanceSquared >= 2 && distanceSquared <= 5;
    default:
      return true;
  }
};

const resolveDotPhase = (row: number, column: number, motion: MatrixLoaderMotion): number => {
  const x = column - MATRIX_LOADER_CENTER;
  const y = row - MATRIX_LOADER_CENTER;
  const index = row * MATRIX_LOADER_DIMENSION + column;

  switch (motion) {
    case "scan":
      return (column + row * 0.12) / MATRIX_LOADER_DIMENSION;
    case "twinkle":
      return ((index * 17) % (MATRIX_LOADER_DIMENSION ** 2)) /
        (MATRIX_LOADER_DIMENSION ** 2);
    case "orbit": {
      if (x === 0 && y === 0) return 0.5;
      const angle = Math.atan2(y, x);
      return (angle + Math.PI) / (Math.PI * 2);
    }
    default:
      return Math.hypot(x, y) / Math.hypot(MATRIX_LOADER_CENTER, MATRIX_LOADER_CENTER);
  }
};

export const createMatrixLoaderDots = (
  shape: MatrixLoaderShape,
  motion: MatrixLoaderMotion,
): MatrixLoaderDot[] =>
  Array.from({ length: MATRIX_LOADER_DIMENSION ** 2 }, (_, index) => {
    const row = Math.floor(index / MATRIX_LOADER_DIMENSION);
    const column = index % MATRIX_LOADER_DIMENSION;

    return {
      column,
      index,
      phase: resolveDotPhase(row, column, motion),
      row,
      visible: isVisibleInShape(row, column, shape),
    };
  });
