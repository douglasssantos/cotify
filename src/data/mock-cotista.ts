/**
 * Dados mock do cotista logado (dashboard)
 */

export type BidType = "sorteio" | "lance_livre" | "lance_fixo" | "lance_embutido";
export type BidResult = "aguardando" | "contemplado" | "nao_contemplado";

export interface MyBid {
  id: string;
  groupId: string;
  groupCode: string;
  assemblyNumber: number;
  assemblyDate: string;
  type: BidType;
  bidValue?: number; // % ou valor para lance
  result: BidResult;
  goodTypeLabel: string;
  administradora: string;
}

export interface MyPayment {
  id: string;
  date: string;
  groupCode: string;
  quotaNumber: number;
  description: string;
  value: number;
  status: "pago" | "pendente" | "atrasado" | "agendado";
  type: "parcela" | "lance" | "taxa" | "seguro";
}

export const mockMyBids: MyBid[] = [
  {
    id: "b1",
    groupId: "1",
    groupCode: "GRP-4052",
    assemblyNumber: 36,
    assemblyDate: "2026-02-15",
    type: "lance_livre",
    bidValue: 15,
    result: "nao_contemplado",
    goodTypeLabel: "Imóvel",
    administradora: "Embracon",
  },
  {
    id: "b2",
    groupId: "1",
    groupCode: "GRP-4052",
    assemblyNumber: 35,
    assemblyDate: "2026-01-15",
    type: "sorteio",
    result: "nao_contemplado",
    goodTypeLabel: "Imóvel",
    administradora: "Embracon",
  },
  {
    id: "b3",
    groupId: "2",
    groupCode: "GRP-3187",
    assemblyNumber: 48,
    assemblyDate: "2026-02-10",
    type: "lance_fixo",
    bidValue: 25,
    result: "nao_contemplado",
    goodTypeLabel: "Veículo",
    administradora: "Porto Seguro",
  },
  {
    id: "b4",
    groupId: "2",
    groupCode: "GRP-3187",
    assemblyNumber: 49,
    assemblyDate: "2026-03-10",
    type: "lance_livre",
    bidValue: 30,
    result: "aguardando",
    goodTypeLabel: "Veículo",
    administradora: "Porto Seguro",
  },
];

export const mockMyPayments: MyPayment[] = [
  { id: "p1", date: "2026-02-15", groupCode: "GRP-4052", quotaNumber: 12, description: "Parcela mensal", value: 2450, status: "pago", type: "parcela" },
  { id: "p2", date: "2026-01-15", groupCode: "GRP-4052", quotaNumber: 12, description: "Parcela mensal", value: 2450, status: "pago", type: "parcela" },
  { id: "p3", date: "2025-12-15", groupCode: "GRP-4052", quotaNumber: 12, description: "Parcela mensal", value: 2450, status: "pago", type: "parcela" },
  { id: "p4", date: "2026-03-15", groupCode: "GRP-4052", quotaNumber: 12, description: "Parcela mensal", value: 2450, status: "agendado", type: "parcela" },
  { id: "p5", date: "2026-02-10", groupCode: "GRP-3187", quotaNumber: 45, description: "Parcela mensal", value: 980, status: "pago", type: "parcela" },
  { id: "p6", date: "2026-01-10", groupCode: "GRP-3187", quotaNumber: 45, description: "Parcela mensal", value: 980, status: "pago", type: "parcela" },
];

/** Solicitação de contemplação por cota */
export type ContemplationRequestStatus = "pendente" | "aprovada" | "recusada";

export interface ContemplationRequest {
  id: string;
  quotaId: string;
  status: ContemplationRequestStatus;
  requestedAt: string;
  respondedAt?: string;
  message?: string;
}

/** Documentos da cota (contrato, regulamento, comprovantes) */
export interface QuotaDocument {
  id: string;
  quotaId: string;
  name: string;
  type: "contrato_adesao" | "regulamento" | "comprovante_pagamento" | "outro";
  uploadedAt: string;
  url: string; // placeholder para download
}

export const mockContemplationRequests: ContemplationRequest[] = [
  { id: "cr1", quotaId: "1", status: "pendente", requestedAt: "2026-02-01" },
];

export const mockQuotaDocuments: QuotaDocument[] = [
  { id: "d1", quotaId: "1", name: "Contrato de adesão - GRP-4052", type: "contrato_adesao", uploadedAt: "2023-06-10", url: "#" },
  { id: "d2", quotaId: "1", name: "Regulamento do grupo GRP-4052", type: "regulamento", uploadedAt: "2023-06-10", url: "#" },
  { id: "d3", quotaId: "1", name: "Comprovante parcela 02/2026", type: "comprovante_pagamento", uploadedAt: "2026-02-15", url: "#" },
  { id: "d4", quotaId: "2", name: "Contrato de adesão - GRP-3187", type: "contrato_adesao", uploadedAt: "2022-03-15", url: "#" },
  { id: "d5", quotaId: "2", name: "Regulamento do grupo GRP-3187", type: "regulamento", uploadedAt: "2022-03-15", url: "#" },
];

export function getContemplationRequestStatusLabel(s: ContemplationRequestStatus): string {
  const labels: Record<ContemplationRequestStatus, string> = {
    pendente: "Pendente",
    aprovada: "Aprovada",
    recusada: "Recusada",
  };
  return labels[s] || s;
}

export function getDocumentTypeLabel(t: QuotaDocument["type"]): string {
  const labels: Record<QuotaDocument["type"], string> = {
    contrato_adesao: "Contrato de adesão",
    regulamento: "Regulamento",
    comprovante_pagamento: "Comprovante de pagamento",
    outro: "Outro",
  };
  return labels[t] || t;
}

// ─── Bens adquiridos com carta de crédito ────────────────────────────────────

export type AcquiredAssetType = "imovel" | "veiculo" | "servico";
export type AcquiredAssetStatus = "disponivel" | "vendido" | "anunciado";

export interface AcquiredAssetImovel {
  tipo: "apartamento" | "casa" | "comercial" | "terreno";
  area: number; // m²
  dormitorios?: number;
  banheiros?: number;
  vagas?: number;
  andar?: number;
  condominio?: number; // R$/mês
  iptu?: number; // R$/mês
  cidade: string;
  estado: string;
  bairro: string;
}

export interface AcquiredAssetVeiculo {
  marca: string;
  modelo: string;
  ano: number;
  km: number;
  cor: string;
  cambio: "manual" | "automatico";
  combustivel: "gasolina" | "etanol" | "flex" | "diesel" | "eletrico" | "hibrido";
  placaFinal?: string;
}

export interface AcquiredAsset {
  id: string;
  quotaId: string;
  type: AcquiredAssetType;
  title: string;
  description: string;
  acquiredValue: number;
  acquiredAt: string;
  status: AcquiredAssetStatus;
  askingPrice?: number;
  imovelData?: AcquiredAssetImovel;
  veiculoData?: AcquiredAssetVeiculo;
}

export const mockAcquiredAssets: AcquiredAsset[] = [
  {
    id: "asset-1",
    quotaId: "4",
    type: "veiculo",
    title: "Toyota Corolla 2022 - Prata",
    description: "Veículo adquirido via carta de crédito do consórcio. Único dono, revisões em dia.",
    acquiredValue: 120000,
    acquiredAt: "2026-02-01",
    status: "disponivel",
    askingPrice: 115000,
    veiculoData: {
      marca: "Toyota",
      modelo: "Corolla XEi",
      ano: 2022,
      km: 18000,
      cor: "Prata",
      cambio: "automatico",
      combustivel: "flex",
      placaFinal: "***-4589",
    },
  },
  {
    id: "asset-2",
    quotaId: "8",
    type: "imovel",
    title: "Apartamento 3 quartos – Moema, SP",
    description: "Apartamento adquirido com carta de crédito. Alto padrão, lazer completo.",
    acquiredValue: 750000,
    acquiredAt: "2025-11-15",
    status: "disponivel",
    askingPrice: 820000,
    imovelData: {
      tipo: "apartamento",
      area: 98,
      dormitorios: 3,
      banheiros: 2,
      vagas: 2,
      andar: 12,
      condominio: 1100,
      iptu: 380,
      cidade: "São Paulo",
      estado: "SP",
      bairro: "Moema",
    },
  },
];

export function getAcquiredAssetsForQuota(quotaId: string): AcquiredAsset[] {
  return mockAcquiredAssets.filter((a) => a.quotaId === quotaId);
}

export const mockCotistaProfile = {
  name: "Maria Silva",
  email: "maria.silva@email.com",
  phone: "(11) 98765-4321",
  cpf: "123.456.789-00",
  birthDate: "1985-03-20",
  address: {
    street: "Rua das Flores, 100",
    complement: "Apto 42",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zip: "01234-567",
  },
  createdAt: "2023-06-10",
};

export function getBidTypeLabel(type: BidType): string {
  const labels: Record<BidType, string> = {
    sorteio: "Sorteio",
    lance_livre: "Lance Livre",
    lance_fixo: "Lance Fixo",
    lance_embutido: "Lance Embutido",
  };
  return labels[type] || type;
}

export function getBidResultLabel(result: BidResult): string {
  const labels: Record<BidResult, string> = {
    aguardando: "Aguardando",
    contemplado: "Contemplado",
    nao_contemplado: "Não contemplado",
  };
  return labels[result] || result;
}

export function getBidResultColor(result: BidResult): string {
  const colors: Record<BidResult, string> = {
    aguardando: "#f0ad4e",
    contemplado: "#5bbb7b",
    nao_contemplado: "#6c757d",
  };
  return colors[result] || "#6c757d";
}

/** Parcela do cronograma da cota */
export type InstallmentStatus = "paga" | "pendente" | "atrasada" | "agendada";

export interface QuotaInstallment {
  quotaId: string;
  number: number;
  dueDate: string;
  value: number;
  interest?: number;
  status: InstallmentStatus;
  paidAt?: string;
  daysLate?: number;
}

/** Gera o cronograma de parcelas de uma cota (mock). Base: primeiro vencimento a partir de startYear/startMonth. */
export function getQuotaInstallments(
  quotaId: string,
  _groupCode: string,
  _quotaNumber: number,
  totalInstallments: number,
  installmentValue: number,
  paidCount: number,
  options?: { startYear?: number; startMonth?: number }
): QuotaInstallment[] {
  const installments: QuotaInstallment[] = [];
  const startYear = options?.startYear ?? 2023;
  const startMonth = (options?.startMonth ?? 6) - 1;
  const baseDate = new Date(startYear, startMonth, 15);
  const interestRatePerMonth = 0.01;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let n = 1; n <= totalInstallments; n++) {
    const due = new Date(baseDate);
    due.setMonth(due.getMonth() + n);
    const dueStr = due.toISOString().slice(0, 10);
    const dueDate = new Date(dueStr);
    dueDate.setHours(0, 0, 0, 0);
    let status: InstallmentStatus = "agendada";
    let interest: number | undefined;
    let paidAt: string | undefined;
    let daysLate: number | undefined;
    if (n <= paidCount) {
      status = "paga";
      paidAt = dueStr;
    } else {
      if (dueDate < today) {
        status = "atrasada";
        daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        interest = Math.round(installmentValue * interestRatePerMonth * Math.max(1, Math.ceil((daysLate || 0) / 30)));
      } else {
        status = n === paidCount + 1 ? "pendente" : "agendada";
      }
    }
    installments.push({
      quotaId,
      number: n,
      dueDate: dueStr,
      value: installmentValue,
      interest: status === "atrasada" ? interest : undefined,
      status,
      paidAt,
      daysLate,
    });
  }
  return installments;
}

export function getInstallmentStatusLabel(s: InstallmentStatus): string {
  const labels: Record<InstallmentStatus, string> = {
    paga: "Paga",
    pendente: "Pendente",
    atrasada: "Atrasada",
    agendada: "Agendada",
  };
  return labels[s] || s;
}

export function getInstallmentStatusColor(s: InstallmentStatus): string {
  const colors: Record<InstallmentStatus, string> = {
    paga: "#5bbb7b",
    pendente: "#f0ad4e",
    atrasada: "#eb6753",
    agendada: "#6c757d",
  };
  return colors[s] || "#6c757d";
}

/** Inadimplência: total em atraso, juros, quantidade de parcelas atrasadas */
export interface QuotaOverdueSummary {
  quotaId: string;
  overdueCount: number;
  totalOverdueValue: number;
  totalInterest: number;
  interestRatePercent: number;
  oldestDueDate: string;
  daysLateOldest: number;
}

export function getQuotaOverdueSummary(
  installments: QuotaInstallment[]
): QuotaOverdueSummary | null {
  const atrasadas = installments.filter((i) => i.status === "atrasada");
  if (atrasadas.length === 0) return null;
  const totalOverdueValue = atrasadas.reduce((s, i) => s + i.value, 0);
  const totalInterest = atrasadas.reduce((s, i) => s + (i.interest || 0), 0);
  const oldest = atrasadas.reduce((a, b) => (a.dueDate < b.dueDate ? a : b));
  return {
    quotaId: installments[0]?.quotaId || "",
    overdueCount: atrasadas.length,
    totalOverdueValue,
    totalInterest,
    interestRatePercent: 1,
    oldestDueDate: oldest.dueDate,
    daysLateOldest: oldest.daysLate || 0,
  };
}

export function getPaymentStatusLabel(status: MyPayment["status"]): string {
  const labels: Record<MyPayment["status"], string> = {
    pago: "Pago",
    pendente: "Pendente",
    atrasado: "Atrasado",
    agendado: "Agendado",
  };
  return labels[status] || status;
}

export function getPaymentStatusColor(status: MyPayment["status"]): string {
  const colors: Record<MyPayment["status"], string> = {
    pago: "#5bbb7b",
    pendente: "#f0ad4e",
    atrasado: "#eb6753",
    agendado: "#0d6efd",
  };
  return colors[status] || "#6c757d";
}
