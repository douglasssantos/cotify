export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function calculateInstallment(
  creditValue: number,
  term: number,
  adminFee: number,
  reserveFund: number,
  insurance: number
): number {
  const commonFund = creditValue / term;
  const adminFeeMonthly = (creditValue * (adminFee / 100)) / term;
  const reserveFundMonthly = (creditValue * (reserveFund / 100)) / term;
  const insuranceMonthly = (creditValue * (insurance / 100)) / term;
  return commonFund + adminFeeMonthly + reserveFundMonthly + insuranceMonthly;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ativa: "ativa",
    contemplada: "contemplada",
    cancelada: "cancelada",
    inadimplente: "inadimplente",
    quitada: "quitada",
    transferida: "transferida",
  };
  return colors[status.toLowerCase()] || "ativa";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ativa: "Ativa",
    contemplada: "Contemplada",
    cancelada: "Cancelada",
    inadimplente: "Inadimplente",
    quitada: "Quitada",
    transferida: "Transferida",
    disponivel: "Disponível",
  };
  return labels[status.toLowerCase()] || status;
}
