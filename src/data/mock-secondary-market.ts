export type ListingStatus = "ativo" | "pausado" | "vendido" | "expirado" | "rascunho";
export type ProposalStatus = "pendente" | "aceita" | "recusada" | "contra_proposta" | "expirada" | "cancelada";
export type TransferStatus = "aguardando_docs" | "docs_enviados" | "analise_admin" | "aprovado" | "reprovado" | "concluido" | "cancelado";
export type NegotiationStatus = "em_andamento" | "acordo" | "cancelada" | "repasse";

export interface Listing {
  id: string;
  quotaId: string;
  groupCode: string;
  quotaNumber: number;
  goodType: "imovel" | "veiculo" | "servico";
  goodTypeLabel: string;
  creditValue: number;
  paidAmount: number;
  installmentValue: number;
  remainingInstallments: number;
  totalInstallments: number;
  administradora: string;
  adminFee: number;
  reserveFund: number;
  status: ListingStatus;
  askingPrice: number;
  description: string;
  isContemplada: boolean;
  acceptsFinancing: boolean;
  acceptsCounterOffer: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  proposals: number;
}

export interface Proposal {
  id: string;
  listingId: string;
  type: "recebida" | "enviada";
  buyerName: string;
  buyerAvatar?: string;
  sellerName: string;
  offeredPrice: number;
  message: string;
  status: ProposalStatus;
  counterOfferPrice?: number;
  counterOfferMessage?: string;
  createdAt: string;
  updatedAt: string;
  listing: {
    groupCode: string;
    quotaNumber: number;
    creditValue: number;
    goodTypeLabel: string;
    askingPrice: number;
  };
}

export interface NegotiationMessage {
  id: string;
  sender: "comprador" | "vendedor" | "sistema";
  senderName: string;
  content: string;
  timestamp: string;
  type: "mensagem" | "proposta" | "contra_proposta" | "aceite" | "recusa" | "sistema";
  value?: number;
}

export interface Negotiation {
  id: string;
  listingId: string;
  proposalId: string;
  buyerName: string;
  sellerName: string;
  status: NegotiationStatus;
  listing: {
    groupCode: string;
    quotaNumber: number;
    creditValue: number;
    goodTypeLabel: string;
    administradora: string;
    askingPrice: number;
    installmentValue: number;
  };
  currentOffer: number;
  messages: NegotiationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TransferStep {
  id: string;
  label: string;
  description: string;
  status: "completo" | "atual" | "pendente";
  date?: string;
}

export interface Transfer {
  id: string;
  negotiationId: string;
  listingId: string;
  status: TransferStatus;
  buyerName: string;
  sellerName: string;
  agreedPrice: number;
  listing: {
    groupCode: string;
    quotaNumber: number;
    creditValue: number;
    goodTypeLabel: string;
    administradora: string;
    installmentValue: number;
  };
  steps: TransferStep[];
  documents: {
    name: string;
    status: "pendente" | "enviado" | "aprovado" | "rejeitado";
    uploadedAt?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
}

export const mockListings: Listing[] = [
  {
    id: "l1",
    quotaId: "1",
    groupCode: "GRP-4052",
    quotaNumber: 12,
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 350000,
    paidAmount: 87500,
    installmentValue: 2450,
    remainingInstallments: 144,
    totalInstallments: 180,
    administradora: "Embracon",
    adminFee: 18,
    reserveFund: 3,
    status: "ativo",
    askingPrice: 95000,
    description: "Cota de consórcio imobiliário em grupo sólido com bom histórico de contemplações. Aceito propostas e negociação.",
    isContemplada: false,
    acceptsFinancing: true,
    acceptsCounterOffer: true,
    createdAt: "2026-02-10",
    updatedAt: "2026-02-25",
    views: 142,
    proposals: 5,
  },
  {
    id: "l2",
    quotaId: "2",
    groupCode: "GRP-3187",
    quotaNumber: 45,
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 85000,
    paidAmount: 42500,
    installmentValue: 980,
    remainingInstallments: 36,
    totalInstallments: 72,
    administradora: "Porto Seguro",
    adminFee: 15,
    reserveFund: 2,
    status: "ativo",
    askingPrice: 52000,
    description: "Cota contemplada de veículo com crédito disponível para uso imediato. Documentação em dia.",
    isContemplada: true,
    acceptsFinancing: false,
    acceptsCounterOffer: true,
    createdAt: "2026-01-20",
    updatedAt: "2026-02-20",
    views: 287,
    proposals: 12,
  },
  {
    id: "l3",
    quotaId: "5",
    groupCode: "GRP-6100",
    quotaNumber: 89,
    goodType: "servico",
    goodTypeLabel: "Serviço",
    creditValue: 45000,
    paidAmount: 9000,
    installmentValue: 650,
    remainingInstallments: 54,
    totalInstallments: 60,
    administradora: "Itaú",
    adminFee: 16,
    reserveFund: 2,
    status: "pausado",
    askingPrice: 12000,
    description: "Cota de serviço com boa parcela mensal. Parado temporariamente para avaliação.",
    isContemplada: false,
    acceptsFinancing: true,
    acceptsCounterOffer: false,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-15",
    views: 56,
    proposals: 1,
  },
  {
    id: "l4",
    quotaId: "7",
    groupCode: "GRP-1234",
    quotaNumber: 56,
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 65000,
    paidAmount: 32500,
    installmentValue: 820,
    remainingInstallments: 30,
    totalInstallments: 60,
    administradora: "Banco do Brasil",
    adminFee: 13,
    reserveFund: 2,
    status: "vendido",
    askingPrice: 38000,
    description: "Cota vendida com sucesso. Repasse concluído.",
    isContemplada: false,
    acceptsFinancing: true,
    acceptsCounterOffer: true,
    createdAt: "2025-12-15",
    updatedAt: "2026-01-28",
    views: 198,
    proposals: 8,
  },
];

export const mockProposals: Proposal[] = [
  {
    id: "p1",
    listingId: "l1",
    type: "recebida",
    buyerName: "Carlos Mendes",
    sellerName: "Você",
    offeredPrice: 88000,
    message: "Olá, tenho interesse na cota. Posso oferecer R$ 88.000 à vista. Tenho documentação pronta para iniciar o repasse imediatamente.",
    status: "pendente",
    createdAt: "2026-02-26",
    updatedAt: "2026-02-26",
    listing: { groupCode: "GRP-4052", quotaNumber: 12, creditValue: 350000, goodTypeLabel: "Imóvel", askingPrice: 95000 },
  },
  {
    id: "p2",
    listingId: "l1",
    type: "recebida",
    buyerName: "Ana Beatriz Silva",
    sellerName: "Você",
    offeredPrice: 92000,
    message: "Tenho interesse e posso fechar rapidamente. Minha proposta é de R$ 92.000.",
    status: "pendente",
    createdAt: "2026-02-25",
    updatedAt: "2026-02-25",
    listing: { groupCode: "GRP-4052", quotaNumber: 12, creditValue: 350000, goodTypeLabel: "Imóvel", askingPrice: 95000 },
  },
  {
    id: "p3",
    listingId: "l2",
    type: "recebida",
    buyerName: "Roberto Almeida",
    sellerName: "Você",
    offeredPrice: 48000,
    message: "Ofereço R$ 48.000 pela cota contemplada.",
    status: "contra_proposta",
    counterOfferPrice: 50000,
    counterOfferMessage: "Aceito por R$ 50.000, já que a cota está contemplada e pronta para uso.",
    createdAt: "2026-02-22",
    updatedAt: "2026-02-24",
    listing: { groupCode: "GRP-3187", quotaNumber: 45, creditValue: 85000, goodTypeLabel: "Veículo", askingPrice: 52000 },
  },
  {
    id: "p4",
    listingId: "l2",
    type: "recebida",
    buyerName: "Fernanda Costa",
    sellerName: "Você",
    offeredPrice: 52000,
    message: "Aceito o valor pedido. Quando podemos iniciar?",
    status: "aceita",
    createdAt: "2026-02-20",
    updatedAt: "2026-02-21",
    listing: { groupCode: "GRP-3187", quotaNumber: 45, creditValue: 85000, goodTypeLabel: "Veículo", askingPrice: 52000 },
  },
  {
    id: "p5",
    listingId: "l1",
    type: "recebida",
    buyerName: "Marcos Paulo Lima",
    sellerName: "Você",
    offeredPrice: 78000,
    message: "Consigo pagar R$ 78.000.",
    status: "recusada",
    createdAt: "2026-02-18",
    updatedAt: "2026-02-19",
    listing: { groupCode: "GRP-4052", quotaNumber: 12, creditValue: 350000, goodTypeLabel: "Imóvel", askingPrice: 95000 },
  },
  {
    id: "p6",
    listingId: "ext-1",
    type: "enviada",
    buyerName: "Você",
    sellerName: "João Pedro Santos",
    offeredPrice: 160000,
    message: "Tenho interesse nesta cota de imóvel. Posso oferecer R$ 160.000.",
    status: "pendente",
    createdAt: "2026-02-27",
    updatedAt: "2026-02-27",
    listing: { groupCode: "GRP-5521", quotaNumber: 7, creditValue: 500000, goodTypeLabel: "Imóvel", askingPrice: 165000 },
  },
];

export const mockNegotiations: Negotiation[] = [
  {
    id: "n1",
    listingId: "l2",
    proposalId: "p4",
    buyerName: "Fernanda Costa",
    sellerName: "Você",
    status: "repasse",
    listing: {
      groupCode: "GRP-3187",
      quotaNumber: 45,
      creditValue: 85000,
      goodTypeLabel: "Veículo",
      administradora: "Porto Seguro",
      askingPrice: 52000,
      installmentValue: 980,
    },
    currentOffer: 52000,
    messages: [
      { id: "m1", sender: "comprador", senderName: "Fernanda Costa", content: "Aceito o valor pedido. Quando podemos iniciar?", timestamp: "2026-02-20T10:30:00", type: "proposta", value: 52000 },
      { id: "m2", sender: "vendedor", senderName: "Você", content: "Ótimo! Podemos iniciar o processo de repasse imediatamente. A documentação está toda em dia.", timestamp: "2026-02-20T11:15:00", type: "mensagem" },
      { id: "m3", sender: "sistema", senderName: "Sistema", content: "Proposta aceita por ambas as partes. Valor acordado: R$ 52.000,00. Iniciando processo de repasse.", timestamp: "2026-02-21T09:00:00", type: "aceite", value: 52000 },
      { id: "m4", sender: "sistema", senderName: "Sistema", content: "Processo de repasse iniciado. Acompanhe o progresso na aba de Repasses.", timestamp: "2026-02-21T09:05:00", type: "sistema" },
    ],
    createdAt: "2026-02-20",
    updatedAt: "2026-02-21",
  },
  {
    id: "n2",
    listingId: "l2",
    proposalId: "p3",
    buyerName: "Roberto Almeida",
    sellerName: "Você",
    status: "em_andamento",
    listing: {
      groupCode: "GRP-3187",
      quotaNumber: 45,
      creditValue: 85000,
      goodTypeLabel: "Veículo",
      administradora: "Porto Seguro",
      askingPrice: 52000,
      installmentValue: 980,
    },
    currentOffer: 50000,
    messages: [
      { id: "m5", sender: "comprador", senderName: "Roberto Almeida", content: "Ofereço R$ 48.000 pela cota contemplada.", timestamp: "2026-02-22T14:00:00", type: "proposta", value: 48000 },
      { id: "m6", sender: "vendedor", senderName: "Você", content: "Aceito por R$ 50.000, já que a cota está contemplada e pronta para uso.", timestamp: "2026-02-22T16:30:00", type: "contra_proposta", value: 50000 },
      { id: "m7", sender: "comprador", senderName: "Roberto Almeida", content: "Vou avaliar e retorno em breve.", timestamp: "2026-02-23T09:00:00", type: "mensagem" },
    ],
    createdAt: "2026-02-22",
    updatedAt: "2026-02-23",
  },
  {
    id: "n3",
    listingId: "l1",
    proposalId: "p2",
    buyerName: "Ana Beatriz Silva",
    sellerName: "Você",
    status: "em_andamento",
    listing: {
      groupCode: "GRP-4052",
      quotaNumber: 12,
      creditValue: 350000,
      goodTypeLabel: "Imóvel",
      administradora: "Embracon",
      askingPrice: 95000,
      installmentValue: 2450,
    },
    currentOffer: 92000,
    messages: [
      { id: "m8", sender: "comprador", senderName: "Ana Beatriz Silva", content: "Tenho interesse e posso fechar rapidamente. Minha proposta é de R$ 92.000.", timestamp: "2026-02-25T08:00:00", type: "proposta", value: 92000 },
      { id: "m9", sender: "vendedor", senderName: "Você", content: "Obrigado pela proposta, Ana. Estou avaliando. O valor mínimo que aceito é R$ 93.000.", timestamp: "2026-02-25T10:00:00", type: "contra_proposta", value: 93000 },
      { id: "m10", sender: "comprador", senderName: "Ana Beatriz Silva", content: "Posso fechar por R$ 93.000 se iniciarmos o processo esta semana.", timestamp: "2026-02-26T14:00:00", type: "mensagem" },
    ],
    createdAt: "2026-02-25",
    updatedAt: "2026-02-26",
  },
];

export const mockTransfers: Transfer[] = [
  {
    id: "t1",
    negotiationId: "n1",
    listingId: "l2",
    status: "analise_admin",
    buyerName: "Fernanda Costa",
    sellerName: "Você",
    agreedPrice: 52000,
    listing: {
      groupCode: "GRP-3187",
      quotaNumber: 45,
      creditValue: 85000,
      goodTypeLabel: "Veículo",
      administradora: "Porto Seguro",
      installmentValue: 980,
    },
    steps: [
      { id: "s1", label: "Acordo Firmado", description: "Valor acordado entre comprador e vendedor", status: "completo", date: "2026-02-21" },
      { id: "s2", label: "Documentação Enviada", description: "Documentos de ambas as partes enviados para análise", status: "completo", date: "2026-02-23" },
      { id: "s3", label: "Análise da Administradora", description: "Porto Seguro está analisando a documentação e a viabilidade do repasse", status: "atual", date: "2026-02-24" },
      { id: "s4", label: "Pagamento do Repasse", description: "Transferência do valor acordado via escrow da plataforma", status: "pendente" },
      { id: "s5", label: "Transferência da Cota", description: "Alteração de titularidade junto à administradora", status: "pendente" },
      { id: "s6", label: "Repasse Concluído", description: "Processo finalizado e cota transferida", status: "pendente" },
    ],
    documents: [
      { name: "RG/CPF do Vendedor", status: "aprovado", uploadedAt: "2026-02-22" },
      { name: "Comprovante de Residência (Vendedor)", status: "aprovado", uploadedAt: "2026-02-22" },
      { name: "RG/CPF do Comprador", status: "enviado", uploadedAt: "2026-02-23" },
      { name: "Comprovante de Residência (Comprador)", status: "enviado", uploadedAt: "2026-02-23" },
      { name: "Comprovante de Renda (Comprador)", status: "enviado", uploadedAt: "2026-02-23" },
      { name: "Termo de Cessão de Direitos", status: "pendente" },
    ],
    createdAt: "2026-02-21",
    updatedAt: "2026-02-24",
    estimatedCompletion: "2026-03-10",
  },
  {
    id: "t2",
    negotiationId: "n-old",
    listingId: "l4",
    status: "concluido",
    buyerName: "Lucas Ferreira",
    sellerName: "Você",
    agreedPrice: 36500,
    listing: {
      groupCode: "GRP-1234",
      quotaNumber: 56,
      creditValue: 65000,
      goodTypeLabel: "Veículo",
      administradora: "Banco do Brasil",
      installmentValue: 820,
    },
    steps: [
      { id: "s1", label: "Acordo Firmado", description: "Valor acordado entre comprador e vendedor", status: "completo", date: "2026-01-10" },
      { id: "s2", label: "Documentação Enviada", description: "Documentos enviados para análise", status: "completo", date: "2026-01-12" },
      { id: "s3", label: "Análise da Administradora", description: "Documentação aprovada pelo Banco do Brasil", status: "completo", date: "2026-01-18" },
      { id: "s4", label: "Pagamento do Repasse", description: "Valor transferido via escrow da plataforma", status: "completo", date: "2026-01-20" },
      { id: "s5", label: "Transferência da Cota", description: "Titularidade alterada junto à administradora", status: "completo", date: "2026-01-25" },
      { id: "s6", label: "Repasse Concluído", description: "Processo finalizado com sucesso", status: "completo", date: "2026-01-28" },
    ],
    documents: [
      { name: "RG/CPF do Vendedor", status: "aprovado", uploadedAt: "2026-01-11" },
      { name: "Comprovante de Residência (Vendedor)", status: "aprovado", uploadedAt: "2026-01-11" },
      { name: "RG/CPF do Comprador", status: "aprovado", uploadedAt: "2026-01-12" },
      { name: "Comprovante de Residência (Comprador)", status: "aprovado", uploadedAt: "2026-01-12" },
      { name: "Comprovante de Renda (Comprador)", status: "aprovado", uploadedAt: "2026-01-12" },
      { name: "Termo de Cessão de Direitos", status: "aprovado", uploadedAt: "2026-01-18" },
    ],
    createdAt: "2026-01-10",
    updatedAt: "2026-01-28",
    estimatedCompletion: "2026-01-28",
  },
];

export function getListingStatusLabel(status: ListingStatus): string {
  const labels: Record<ListingStatus, string> = {
    ativo: "Ativo", pausado: "Pausado", vendido: "Vendido", expirado: "Expirado", rascunho: "Rascunho",
  };
  return labels[status] || status;
}

export function getListingStatusClass(status: ListingStatus): string {
  const map: Record<ListingStatus, string> = {
    ativo: "#5bbb7b", pausado: "#f0ad4e", vendido: "#6c757d", expirado: "#eb6753", rascunho: "#adb5bd",
  };
  return map[status] || "#6c757d";
}

export function getProposalStatusLabel(status: ProposalStatus): string {
  const labels: Record<ProposalStatus, string> = {
    pendente: "Pendente", aceita: "Aceita", recusada: "Recusada", contra_proposta: "Contra-proposta", expirada: "Expirada", cancelada: "Cancelada",
  };
  return labels[status] || status;
}

export function getProposalStatusColor(status: ProposalStatus): string {
  const map: Record<ProposalStatus, string> = {
    pendente: "#f0ad4e", aceita: "#5bbb7b", recusada: "#eb6753", contra_proposta: "#0d6efd", expirada: "#6c757d", cancelada: "#adb5bd",
  };
  return map[status] || "#6c757d";
}

export function getTransferStatusLabel(status: TransferStatus): string {
  const labels: Record<TransferStatus, string> = {
    aguardando_docs: "Aguardando Documentos", docs_enviados: "Docs Enviados", analise_admin: "Em Análise", aprovado: "Aprovado", reprovado: "Reprovado", concluido: "Concluído", cancelado: "Cancelado",
  };
  return labels[status] || status;
}

export function getTransferStatusColor(status: TransferStatus): string {
  const map: Record<TransferStatus, string> = {
    aguardando_docs: "#f0ad4e", docs_enviados: "#0d6efd", analise_admin: "#6f42c1", aprovado: "#5bbb7b", reprovado: "#eb6753", concluido: "#5bbb7b", cancelado: "#6c757d",
  };
  return map[status] || "#6c757d";
}

export function getNegotiationStatusLabel(status: NegotiationStatus): string {
  const labels: Record<NegotiationStatus, string> = {
    em_andamento: "Em Andamento", acordo: "Acordo Firmado", cancelada: "Cancelada", repasse: "Em Repasse",
  };
  return labels[status] || status;
}

export function getNegotiationStatusColor(status: NegotiationStatus): string {
  const map: Record<NegotiationStatus, string> = {
    em_andamento: "#0d6efd", acordo: "#5bbb7b", cancelada: "#6c757d", repasse: "#6f42c1",
  };
  return map[status] || "#6c757d";
}
