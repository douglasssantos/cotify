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
  status: string;
  administradora: string;
  adminFee: number;
  reserveFund: number;
  quotaNumber: number;
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
    quotaNumber: 12,
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
    quotaNumber: 45,
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
    status: "ativa",
    administradora: "Rodobens",
    adminFee: 20,
    reserveFund: 3,
    quotaNumber: 7,
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
    quotaNumber: 23,
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
    quotaNumber: 89,
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
    quotaNumber: 33,
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
    quotaNumber: 56,
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
    quotaNumber: 3,
    listingPrice: 420000,
    profitability: 6.5,
  },
];

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
