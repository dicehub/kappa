interface DecimalParts {
  coefficient: bigint;
  exponent: number;
}

const toDecimalParts = (value: number): DecimalParts | undefined => {
  if (!Number.isFinite(value)) return undefined;
  const [coefficientSource, exponentSource = "0"] = value.toString().toLowerCase().split("e");
  const negative = coefficientSource.startsWith("-");
  const unsigned = negative ? coefficientSource.slice(1) : coefficientSource;
  const [integer, fraction = ""] = unsigned.split(".");
  const digits = `${integer}${fraction}`.replace(/^0+(?=\d)/, "") || "0";

  return {
    coefficient: BigInt(`${negative ? "-" : ""}${digits}`),
    exponent: Number(exponentSource) - fraction.length,
  };
};

const scaleCoefficient = (parts: DecimalParts, exponent: number) =>
  parts.coefficient * 10n ** BigInt(parts.exponent - exponent);

export const addNumberInputDecimalSteps = (value: number, step: number, units: number) => {
  const valueParts = toDecimalParts(value);
  const stepParts = toDecimalParts(step);
  const unitParts = toDecimalParts(units);
  if (!valueParts || !stepParts || !unitParts) return value + step * units;

  const deltaParts = {
    coefficient: stepParts.coefficient * unitParts.coefficient,
    exponent: stepParts.exponent + unitParts.exponent,
  };
  const exponent = Math.min(valueParts.exponent, deltaParts.exponent);
  const coefficient =
    scaleCoefficient(valueParts, exponent) + scaleCoefficient(deltaParts, exponent);
  return Number(`${coefficient}e${exponent}`);
};
