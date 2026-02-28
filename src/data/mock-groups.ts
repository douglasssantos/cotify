export interface Assembly {
  id: string;
  number: number;
  date: string;
  status: "realizada" | "agendada" | "em_andamento";
  contemplatedCount: number;
  totalParticipants: number;
  type: "ordinaria" | "extraordinaria";
  winnerType?: "sorteio" | "lance_livre" | "lance_fixo" | "lance_embutido";
  winnerQuota?: string;
  winnerBidValue?: number;
}

export interface Group {
  id: string;
  code: string;
  goodType: "imovel" | "veiculo" | "servico";
  goodTypeLabel: string;
  creditValue: number;
  totalQuotas: number;
  activeQuotas: number;
  contemplatedQuotas: number;
  administradora: string;
  cooperativa?: string;
  comissionado?: string;
  term: number;
  currentAssembly: number;
  adminFee: number;
  reserveFund: number;
  status: "em_andamento" | "encerrado" | "formacao";
  createdAt: string;
  nextAssemblyDate: string;
  totalArrecadado: number;
  fundoComum: number;
  assemblies: Assembly[];
}

export const mockGroups: Group[] = [
  {
    id: "1",
    code: "GRP-4052",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 350000,
    totalQuotas: 200,
    activeQuotas: 168,
    contemplatedQuotas: 32,
    administradora: "Embracon",
    cooperativa: "Sicoob Consórcios",
    comissionado: "Revendas Brasil Ltda",
    term: 180,
    currentAssembly: 36,
    adminFee: 18,
    reserveFund: 3,
    status: "em_andamento",
    createdAt: "2023-01-15",
    nextAssemblyDate: "2026-03-15",
    totalArrecadado: 12600000,
    fundoComum: 11200000,
    assemblies: [
      { id: "a1", number: 36, date: "2026-02-15", status: "realizada", contemplatedCount: 2, totalParticipants: 168, type: "ordinaria", winnerType: "sorteio", winnerQuota: "Cota #45" },
      { id: "a2", number: 35, date: "2026-01-15", status: "realizada", contemplatedCount: 1, totalParticipants: 170, type: "ordinaria", winnerType: "lance_livre", winnerQuota: "Cota #12", winnerBidValue: 35 },
      { id: "a3", number: 34, date: "2025-12-15", status: "realizada", contemplatedCount: 2, totalParticipants: 172, type: "ordinaria", winnerType: "sorteio", winnerQuota: "Cota #89" },
      { id: "a4", number: 37, date: "2026-03-15", status: "agendada", contemplatedCount: 0, totalParticipants: 168, type: "ordinaria" },
      { id: "a5", number: 38, date: "2026-04-15", status: "agendada", contemplatedCount: 0, totalParticipants: 168, type: "ordinaria" },
    ],
  },
  {
    id: "2",
    code: "GRP-3187",
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 85000,
    totalQuotas: 150,
    activeQuotas: 98,
    contemplatedQuotas: 52,
    administradora: "Porto Seguro",
    cooperativa: "Sicredi Consórcios",
    term: 72,
    currentAssembly: 48,
    adminFee: 15,
    reserveFund: 2,
    status: "em_andamento",
    createdAt: "2022-03-10",
    nextAssemblyDate: "2026-03-10",
    totalArrecadado: 6120000,
    fundoComum: 5500000,
    assemblies: [
      { id: "b1", number: 48, date: "2026-02-10", status: "realizada", contemplatedCount: 3, totalParticipants: 98, type: "ordinaria", winnerType: "lance_fixo", winnerQuota: "Cota #23", winnerBidValue: 25 },
      { id: "b2", number: 47, date: "2026-01-10", status: "realizada", contemplatedCount: 2, totalParticipants: 100, type: "ordinaria", winnerType: "sorteio", winnerQuota: "Cota #67" },
      { id: "b3", number: 49, date: "2026-03-10", status: "agendada", contemplatedCount: 0, totalParticipants: 98, type: "ordinaria" },
    ],
  },
  {
    id: "3",
    code: "GRP-5521",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 500000,
    totalQuotas: 250,
    activeQuotas: 220,
    contemplatedQuotas: 30,
    administradora: "Rodobens",
    comissionado: "Consórcio Fácil ME",
    term: 200,
    currentAssembly: 24,
    adminFee: 20,
    reserveFund: 3,
    status: "em_andamento",
    createdAt: "2024-02-20",
    nextAssemblyDate: "2026-03-20",
    totalArrecadado: 30000000,
    fundoComum: 27000000,
    assemblies: [
      { id: "c1", number: 24, date: "2026-02-20", status: "realizada", contemplatedCount: 2, totalParticipants: 220, type: "ordinaria", winnerType: "lance_embutido", winnerQuota: "Cota #7", winnerBidValue: 20 },
      { id: "c2", number: 23, date: "2026-01-20", status: "realizada", contemplatedCount: 1, totalParticipants: 222, type: "ordinaria", winnerType: "sorteio", winnerQuota: "Cota #156" },
      { id: "c3", number: 25, date: "2026-03-20", status: "agendada", contemplatedCount: 0, totalParticipants: 220, type: "ordinaria" },
    ],
  },
  {
    id: "4",
    code: "GRP-2899",
    goodType: "veiculo",
    goodTypeLabel: "Veículo",
    creditValue: 120000,
    totalQuotas: 100,
    activeQuotas: 15,
    contemplatedQuotas: 85,
    administradora: "Bradesco",
    cooperativa: "Sicoob Consórcios",
    term: 60,
    currentAssembly: 55,
    adminFee: 14,
    reserveFund: 2.5,
    status: "em_andamento",
    createdAt: "2021-08-05",
    nextAssemblyDate: "2026-03-05",
    totalArrecadado: 6600000,
    fundoComum: 6000000,
    assemblies: [
      { id: "d1", number: 55, date: "2026-02-05", status: "realizada", contemplatedCount: 2, totalParticipants: 15, type: "ordinaria", winnerType: "lance_livre", winnerQuota: "Cota #3", winnerBidValue: 40 },
      { id: "d2", number: 56, date: "2026-03-05", status: "agendada", contemplatedCount: 0, totalParticipants: 15, type: "ordinaria" },
    ],
  },
  {
    id: "5",
    code: "GRP-6100",
    goodType: "servico",
    goodTypeLabel: "Serviço",
    creditValue: 45000,
    totalQuotas: 80,
    activeQuotas: 72,
    contemplatedQuotas: 8,
    administradora: "Itaú",
    term: 60,
    currentAssembly: 6,
    adminFee: 16,
    reserveFund: 2,
    status: "formacao",
    createdAt: "2025-08-01",
    nextAssemblyDate: "2026-03-01",
    totalArrecadado: 324000,
    fundoComum: 280000,
    assemblies: [
      { id: "e1", number: 6, date: "2026-02-01", status: "realizada", contemplatedCount: 1, totalParticipants: 72, type: "ordinaria", winnerType: "sorteio", winnerQuota: "Cota #55" },
      { id: "e2", number: 7, date: "2026-03-01", status: "agendada", contemplatedCount: 0, totalParticipants: 72, type: "ordinaria" },
    ],
  },
  {
    id: "6",
    code: "GRP-7744",
    goodType: "imovel",
    goodTypeLabel: "Imóvel",
    creditValue: 280000,
    totalQuotas: 180,
    activeQuotas: 0,
    contemplatedQuotas: 180,
    administradora: "Embracon",
    cooperativa: "Unicred Consórcios",
    term: 180,
    currentAssembly: 180,
    adminFee: 18,
    reserveFund: 3,
    status: "encerrado",
    createdAt: "2011-01-10",
    nextAssemblyDate: "-",
    totalArrecadado: 50400000,
    fundoComum: 50400000,
    assemblies: [],
  },
];

export const groupStatuses = [
  { value: "", label: "Todos os status" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "formacao", label: "Em Formação" },
  { value: "encerrado", label: "Encerrado" },
];

export const groupAdministradoras = [
  { value: "", label: "Todas" },
  { value: "Embracon", label: "Embracon" },
  { value: "Porto Seguro", label: "Porto Seguro" },
  { value: "Rodobens", label: "Rodobens" },
  { value: "Bradesco", label: "Bradesco" },
  { value: "Itaú", label: "Itaú" },
];

export const groupGoodTypes = [
  { value: "", label: "Todos os tipos" },
  { value: "imovel", label: "Imóvel" },
  { value: "veiculo", label: "Veículo" },
  { value: "servico", label: "Serviço" },
];

export function getGroupStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    em_andamento: "Em Andamento",
    encerrado: "Encerrado",
    formacao: "Em Formação",
  };
  return labels[status] || status;
}

export function getGroupStatusClass(status: string): string {
  const classes: Record<string, string> = {
    em_andamento: "style1",
    formacao: "style2",
    encerrado: "style3",
  };
  return classes[status] || "style1";
}

export function getAssemblyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    realizada: "Realizada",
    agendada: "Agendada",
    em_andamento: "Em Andamento",
  };
  return labels[status] || status;
}

export function getWinnerTypeLabel(type?: string): string {
  if (!type) return "-";
  const labels: Record<string, string> = {
    sorteio: "Sorteio",
    lance_livre: "Lance Livre",
    lance_fixo: "Lance Fixo",
    lance_embutido: "Lance Embutido",
  };
  return labels[type] || type;
}
