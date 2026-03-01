"use client";

import { NumericFormat, type NumericFormatProps } from "react-number-format";

export interface CurrencyInputProps
  extends Omit<NumericFormatProps, "value" | "onValueChange" | "onChange"> {
  value: number;
  onValueChange: (value: number) => void;
}

/**
 * Input com máscara de moeda pt-BR (R$ 1.234,56).
 * value e onValueChange trabalham com número; a exibição é formatada.
 */
export function CurrencyInput({
  value,
  onValueChange,
  className = "form-control",
  ...rest
}: CurrencyInputProps) {
  return (
    <NumericFormat
      value={value || ""}
      onValueChange={(values) => {
        const num = values.floatValue;
        onValueChange(num ?? 0);
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      prefix="R$ "
      className={className}
      {...rest}
    />
  );
}
