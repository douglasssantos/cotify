/** Status do crédito para cotas contempladas (fluxo pós-contemplação) */
export type CreditStatus =
  | "pending"
  | "awaiting_docs"
  | "under_review"
  | "approved"
  | "released";

export interface Quota {
  id: string;
  groupCode: string;
  goodType: "imovel" | "veiculo" | "servico";
  goodTypeLabel: string;
  creditValue: number;
  paidAmount: number;
  installmentValue: number;
  remainingInstallments: number;
  totalInstallments: number;
  /** ativa | contemplada | cancelada | inadimplente | quitada | transferida */
  status: string;
  administradora: string;
  adminFee: number;
  reserveFund: number;
  /** Seguro mensal em R$ */
  insurance: number;
  /** Índice de correção (ex: "INPC", "IGP-M") */
  correctionIndex: string;
  /** Taxa de correção monetária anual (%) */
  correctionRate: number;
  quotaNumber: number;
  /** Quantidade de lances já realizados pelo cotista */
  bidCount: number;
  /** Status do crédito (apenas para contempladas) */
  creditStatus?: CreditStatus;
  /** Valor do crédito efetivamente liberado */
  creditReleasedValue?: number;
  /** Data de liberação do crédito */
  creditReleasedAt?: string;
  /** Data de início de inadimplência */
  defaultingSince?: string;
  listingPrice?: number;
  profitability?: number;
}

export const mockQuotas: Quota[] = [
  {
    id: "1",
    groupCode: "GRP-4052",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 350000,
    paidAmount: 87500,
    installmentValue: 2450,
    remainingInstallments: 144,
    totalInstallments: 180,
    status: "ativa",
    administradora: "Embracon",
    adminFee: 18,
    reserveFund: 3,
    insurance: 45,
    correctionIndex: "INPC",
    correctionRate: 4.5,
    quotaNumber: 12,
    bidCount: 3,
    listingPrice: 95000,
  },
  {
    id: "2",
    groupCode: "GRP-3187",
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 85000,
    paidAmount: 42500,
    installmentValue: 980,
    remainingInstallments: 36,
    totalInstallments: 72,
    status: "contemplada",
    administradora: "Porto Seguro",
    adminFee: 15,
    reserveFund: 2,
    insurance: 18,
    correctionIndex: "IGP-M",
    correctionRate: 5.2,
    quotaNumber: 45,
    bidCount: 5,
    creditStatus: "awaiting_docs",
    listingPrice: 52000,
    profitability: 12.5,
  },
  {
    id: "3",
    groupCode: "GRP-5521",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 500000,
    paidAmount: 150000,
    installmentValue: 3800,
    remainingInstallments: 120,
    totalInstallments: 200,
    status: "inadimplente",
    administradora: "Rodobens",
    adminFee: 20,
    reserveFund: 3,
    insurance: 60,
    correctionIndex: "INPC",
    correctionRate: 4.5,
    quotaNumber: 7,
    bidCount: 1,
    defaultingSince: "2026-01-15",
    listingPrice: 165000,
  },
  {
    id: "4",
    groupCode: "GRP-2899",
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 120000,
    paidAmount: 96000,
    installmentValue: 1450,
    remainingInstallments: 12,
    totalInstallments: 60,
    status: "contemplada",
    administradora: "Bradesco",
    adminFee: 14,
    reserveFund: 2.5,
    insurance: 22,
    correctionIndex: "IGP-M",
    correctionRate: 5.2,
    quotaNumber: 23,
    bidCount: 8,
    creditStatus: "approved",
    creditReleasedValue: 120000,
    creditReleasedAt: "2026-01-20",
    listingPrice: 105000,
    profitability: 8.2,
  },
  {
    id: "5",
    groupCode: "GRP-6100",
    goodType: "servico",
    goodTypeLabel: "Serviço",
    creditValue: 45000,
    paidAmount: 9000,
    installmentValue: 650,
    remainingInstallments: 54,
    totalInstallments: 60,
    status: "ativa",
    administradora: "Itaú",
    adminFee: 16,
    reserveFund: 2,
    insurance: 8,
    correctionIndex: "IPCA",
    correctionRate: 3.8,
    quotaNumber: 89,
    bidCount: 0,
    listingPrice: 12000,
  },
  {
    id: "6",
    groupCode: "GRP-7744",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 280000,
    paidAmount: 0,
    installmentValue: 1950,
    remainingInstallments: 180,
    totalInstallments: 180,
    status: "cancelada",
    administradora: "Embracon",
    adminFee: 18,
    reserveFund: 3,
    insurance: 35,
    correctionIndex: "INPC",
    correctionRate: 4.5,
    quotaNumber: 33,
    bidCount: 0,
    listingPrice: 15000,
    profitability: 22.0,
  },
  {
    id: "7",
    groupCode: "GRP-1234",
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 65000,
    paidAmount: 32500,
    installmentValue: 820,
    remainingInstallments: 30,
    totalInstallments: 60,
    status: "ativa",
    administradora: "Banco do Brasil",
    adminFee: 13,
    reserveFund: 2,
    insurance: 12,
    correctionIndex: "IPCA",
    correctionRate: 3.8,
    quotaNumber: 56,
    bidCount: 2,
    listingPrice: 38000,
  },
  {
    id: "8",
    groupCode: "GRP-8890",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 750000,
    paidAmount: 375000,
    installmentValue: 5200,
    remainingInstallments: 96,
    totalInstallments: 200,
    status: "contemplada",
    administradora: "Rodobens",
    adminFee: 20,
    reserveFund: 3.5,
    insurance: 90,
    correctionIndex: "IGP-M",
    correctionRate: 5.2,
    quotaNumber: 3,
    bidCount: 12,
    creditStatus: "released",
    creditReleasedValue: 750000,
    creditReleasedAt: "2025-10-05",
    listingPrice: 420000,
    profitability: 6.5,
  },
];

export const creditStatusLabels: Record<CreditStatus, string> = {
  pending: "Pendente",
  awaiting_docs: "Aguardando docs",
  under_review: "Em análise",
  approved: "Aprovado",
  released: "Liberado",
};

export const creditStatusColors: Record<CreditStatus, string> = {
  pending: "#6c757d",
  awaiting_docs: "#f0ad4e",
  under_review: "#0d6efd",
  approved: "#5bbb7b",
  released: "#5bbb7b",
};

export const goodTypes = [
  { value: "", label: "Todos os tipos" },
  { value: "imovel", label: "Imóvel" },
  { value: "veiculo", label: "Veículo" },
  { value: "servico", label: "Serviço" },
];

export const quotaStatuses = [
  { value: "", label: "Todos os status" },
  { value: "ativa", label: "Ativa" },
  { value: "contemplada", label: "Contemplada" },
  { value: "inadimplente", label: "Inadimplente" },
  { value: "cancelada", label: "Cancelada" },
];

export const administradoras = [
  { value: "", label: "Todas as administradoras" },
  { value: "Embracon", label: "Embracon" },
  { value: "Porto Seguro", label: "Porto Seguro" },
  { value: "Rodobens", label: "Rodobens" },
  { value: "Bradesco", label: "Bradesco" },
  { value: "Itaú", label: "Itaú" },
  { value: "Banco do Brasil", label: "Banco do Brasil" },
];

/**
 * Detalhamento da parcela mensal conforme fórmula do doc:
 * Parcela = Crédito/Prazo + (Crédito × TaxaAdm)/Prazo + (Crédito × TaxaFR)/Prazo + Seguro
 */
export function installmentBreakdown(quota: Quota) {
  const fundoComum = quota.creditValue / quota.totalInstallments;
  const taxaAdm = (quota.creditValue * (quota.adminFee / 100)) / quota.totalInstallments;
  const fundoReserva = (quota.creditValue * (quota.reserveFund / 100)) / quota.totalInstallments;
  const seguro = quota.insurance;
  const total = fundoComum + taxaAdm + fundoReserva + seguro;
  return { fundoComum, taxaAdm, fundoReserva, seguro, total };
}

/**
 * Crédito corrigido pela correção monetária no mês N:
 * CreditoCorrigido = Credito × (1 + taxa)^(mes - 1)
 */
export function correctedCreditValue(quota: Quota, month: number): number {
  const rate = quota.correctionRate / 100 / 12;
  return quota.creditValue * Math.pow(1 + rate, month - 1);
}

/**
 * Simulação de lance/sorteio para uma cota
 * @param activeQuotas total de cotas ativas no grupo
 */
export function bidSimulation(quota: Quota, activeQuotas: number) {
  const lotterProbability = activeQuotas > 0 ? ((1 / activeQuotas) * 100) : 0;
  const minBidPercent = 20; // % mínimo sobre o crédito para ser competitivo (mock)
  const minBidValue = quota.creditValue * (minBidPercent / 100);
  const currentBidPercent = quota.bidCount > 0 ? minBidPercent + quota.bidCount * 2 : 0;
  return {
    lotterProbability: Number(lotterProbability.toFixed(2)),
    minBidPercent,
    minBidValue,
    currentBidPercent,
    ranking: quota.bidCount > 0 ? Math.max(1, activeQuotas - quota.bidCount * 3) : null,
  };
}
