export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Formato abreviado para exibição em pouco espaço (ex: "R$ 85 mil", "R$ 1,2 mi"). */
export function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) {
    const mi = value / 1_000_000;
    return `R$ ${mi % 1 === 0 ? mi.toFixed(0) : mi.toFixed(1).replace(".", ",")} mi`;
  }
  if (value >= 1_000) {
    const mil = value / 1_000;
    return `R$ ${mil % 1 === 0 ? mil.toFixed(0) : mil.toFixed(1).replace(".", ",")} mil`;
  }
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

/**
 * Retorna a URL do favicon do site (via Google Favicon API) para usar como logo
 * quando não houver imagem vinda do banco. Ex.: "www.embracon.com.br" -> URL do favicon.
 */
export function getFaviconUrl(website: string | undefined): string | null {
  if (!website?.trim()) return null;
  try {
    let url = website.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
  } catch {
    return null;
  }
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
