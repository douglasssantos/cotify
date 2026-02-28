export type GoodCategory = "veiculo" | "imovel" | "moto" | "caminhao" | "servico";
export type GoodCondition = "excelente" | "bom" | "regular" | "precisa_reparos";
export type RepasseStatus = "disponivel" | "reservado" | "vendido" | "negociacao";

export interface VehicleDetails {
  brand: string;
  model: string;
  year: number;
  yearModel: number;
  color: string;
  km: number;
  fuel: string;
  transmission: string;
  doors?: number;
  plate?: string;
  hasAccidentHistory: boolean;
  accidentDescription?: string;
  ipvaUpToDate: boolean;
  hasFines: boolean;
  extras: string[];
}

export interface PropertyDetails {
  propertyType: "casa" | "apartamento" | "terreno" | "comercial" | "chacara";
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  floor?: number;
  hasPool: boolean;
  hasBarbecue: boolean;
  furnished: boolean;
  condominium?: number;
  iptuMonthly?: number;
  neighborhood: string;
  city: string;
  state: string;
  extras: string[];
}

export interface RepasseGood {
  id: string;
  category: GoodCategory;
  categoryLabel: string;
  title: string;
  description: string;
  condition: GoodCondition;
  askingPrice: number;
  status: RepasseStatus;
  images: string[];
  createdAt: string;
  views: number;
  proposals: number;

  vehicleDetails?: VehicleDetails;
  propertyDetails?: PropertyDetails;

  creditLetter: {
    groupCode: string;
    quotaNumber: number;
    creditValue: number;
    paidAmount: number;
    installmentValue: number;
    remainingInstallments: number;
    totalInstallments: number;
    adminFee: number;
    reserveFund: number;
    administradora: string;
    status: string;
    isContemplada: boolean;
    contemplationDate?: string;
  };

  seller: {
    name: string;
    rating: number;
    reviews: number;
    memberSince: string;
    verified: boolean;
    responseTime: string;
  };
}

export const mockRepasses: RepasseGood[] = [
  {
    id: "rp-1",
    category: "veiculo",
    categoryLabel: "Veículo",
    title: "Toyota Corolla Cross XRE 2.0 2025",
    description: "Veículo adquirido via consórcio, em excelente estado. Único dono, todas as revisões feitas na concessionária. IPVA 2026 pago. Documento em dia. Comprador assume as parcelas restantes do consórcio.",
    condition: "excelente",
    askingPrice: 155000,
    status: "disponivel",
    images: [
      "/images/listings/g-1.jpg",
      "/images/listings/g-2.jpg",
      "/images/listings/g-3.jpg",
      "/images/listings/g-4.jpg",
    ],
    createdAt: "2026-02-15",
    views: 342,
    proposals: 8,
    vehicleDetails: {
      brand: "Toyota",
      model: "Corolla Cross XRE 2.0",
      year: 2024,
      yearModel: 2025,
      color: "Branco Pérola",
      km: 18500,
      fuel: "Flex (Gasolina/Etanol)",
      transmission: "Automático CVT",
      doors: 4,
      plate: "ABC•••23",
      hasAccidentHistory: false,
      ipvaUpToDate: true,
      hasFines: false,
      extras: ["Teto solar panorâmico", "Central multimídia 9\"", "Câmera de ré", "Sensor de estacionamento", "Bancos em couro", "Piloto automático adaptativo", "Alerta de colisão"],
    },
    creditLetter: {
      groupCode: "GRP-3187",
      quotaNumber: 45,
      creditValue: 180000,
      paidAmount: 108000,
      installmentValue: 2100,
      remainingInstallments: 24,
      totalInstallments: 72,
      adminFee: 15,
      reserveFund: 2,
      administradora: "Porto Seguro",
      status: "contemplada",
      isContemplada: true,
      contemplationDate: "2024-08-15",
    },
    seller: {
      name: "Ricardo Mendes",
      rating: 4.9,
      reviews: 12,
      memberSince: "2023",
      verified: true,
      responseTime: "< 1h",
    },
  },
  {
    id: "rp-2",
    category: "imovel",
    categoryLabel: "Imóvel",
    title: "Apartamento 3 Quartos - Residencial Parque Verde",
    description: "Apartamento novo, nunca habitado, adquirido via consórcio contemplado por lance. Localização privilegiada próximo a shoppings e metrô. Pronto para morar. Comprador assume o restante das parcelas.",
    condition: "excelente",
    askingPrice: 420000,
    status: "disponivel",
    images: [
      "/images/listings/g-5.jpg",
      "/images/listings/g-6.jpg",
      "/images/listings/g-7.jpg",
      "/images/listings/g-8.jpg",
      "/images/listings/g-9.jpg",
    ],
    createdAt: "2026-01-28",
    views: 589,
    proposals: 15,
    propertyDetails: {
      propertyType: "apartamento",
      area: 85,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpots: 2,
      floor: 8,
      hasPool: true,
      hasBarbecue: true,
      furnished: false,
      condominium: 650,
      iptuMonthly: 280,
      neighborhood: "Jardim das Flores",
      city: "São Paulo",
      state: "SP",
      extras: ["Varanda gourmet", "Piso porcelanato", "Ar condicionado split", "Armários planejados na cozinha", "Área de lazer completa", "Portaria 24h", "Elevador"],
    },
    creditLetter: {
      groupCode: "GRP-4052",
      quotaNumber: 12,
      creditValue: 450000,
      paidAmount: 180000,
      installmentValue: 3200,
      remainingInstallments: 120,
      totalInstallments: 180,
      adminFee: 18,
      reserveFund: 3,
      administradora: "Embracon",
      status: "contemplada",
      isContemplada: true,
      contemplationDate: "2025-03-20",
    },
    seller: {
      name: "Maria Clara Santos",
      rating: 4.8,
      reviews: 5,
      memberSince: "2024",
      verified: true,
      responseTime: "< 2h",
    },
  },
  {
    id: "rp-3",
    category: "moto",
    categoryLabel: "Motocicleta",
    title: "Honda CB 500F ABS 2025",
    description: "Moto comprada via consórcio contemplado por sorteio. Pouquíssimo uso, apenas fins de semana. Sem quedas ou arranhões. Comprador assume parcelas restantes.",
    condition: "excelente",
    askingPrice: 35000,
    status: "disponivel",
    images: [
      "/images/listings/g-10.jpg",
      "/images/listings/g-11.jpg",
      "/images/listings/g-12.jpg",
    ],
    createdAt: "2026-02-20",
    views: 215,
    proposals: 6,
    vehicleDetails: {
      brand: "Honda",
      model: "CB 500F ABS",
      year: 2025,
      yearModel: 2025,
      color: "Vermelho Racing",
      km: 3200,
      fuel: "Gasolina",
      transmission: "Manual 6 marchas",
      hasAccidentHistory: false,
      ipvaUpToDate: true,
      hasFines: false,
      extras: ["Freios ABS", "Painel digital TFT", "Iluminação full LED", "Tomada USB", "Slider de proteção"],
    },
    creditLetter: {
      groupCode: "GRP-2899",
      quotaNumber: 23,
      creditValue: 45000,
      paidAmount: 33750,
      installmentValue: 680,
      remainingInstallments: 12,
      totalInstallments: 60,
      adminFee: 14,
      reserveFund: 2.5,
      administradora: "Bradesco",
      status: "contemplada",
      isContemplada: true,
      contemplationDate: "2025-01-10",
    },
    seller: {
      name: "Felipe Oliveira",
      rating: 5.0,
      reviews: 3,
      memberSince: "2024",
      verified: true,
      responseTime: "< 30min",
    },
  },
  {
    id: "rp-4",
    category: "veiculo",
    categoryLabel: "Veículo",
    title: "Hyundai HB20S Platinum 1.0 Turbo 2024",
    description: "Sedan completo, adquirido via consórcio. Carro de garagem, segundo dono. Pequeno amassado na porta traseira direita (já orçado). Ótima oportunidade pelo valor. Comprador assume parcelas.",
    condition: "bom",
    askingPrice: 82000,
    status: "negociacao",
    images: [
      "/images/listings/g-13.jpg",
      "/images/listings/g-14.jpg",
      "/images/listings/g-15.jpg",
      "/images/listings/g-16.jpg",
    ],
    createdAt: "2026-02-10",
    views: 178,
    proposals: 4,
    vehicleDetails: {
      brand: "Hyundai",
      model: "HB20S Platinum 1.0 Turbo",
      year: 2023,
      yearModel: 2024,
      color: "Cinza Silk",
      km: 32000,
      fuel: "Flex (Gasolina/Etanol)",
      transmission: "Automático 6 marchas",
      doors: 4,
      plate: "DEF•••78",
      hasAccidentHistory: true,
      accidentDescription: "Pequeno amassado na porta traseira direita, sem comprometimento estrutural. Reparo orçado em R$ 1.200.",
      ipvaUpToDate: true,
      hasFines: false,
      extras: ["Central multimídia 8\"", "Câmera de ré", "Carregador wireless", "Bancos em couro sintético", "Ar digital", "Chave presencial"],
    },
    creditLetter: {
      groupCode: "GRP-6100",
      quotaNumber: 89,
      creditValue: 95000,
      paidAmount: 57000,
      installmentValue: 1250,
      remainingInstallments: 24,
      totalInstallments: 60,
      adminFee: 16,
      reserveFund: 2,
      administradora: "Itaú",
      status: "contemplada",
      isContemplada: true,
      contemplationDate: "2024-06-20",
    },
    seller: {
      name: "Anderson Costa",
      rating: 4.6,
      reviews: 8,
      memberSince: "2022",
      verified: true,
      responseTime: "< 3h",
    },
  },
  {
    id: "rp-5",
    category: "imovel",
    categoryLabel: "Imóvel",
    title: "Casa 4 Quartos com Piscina - Condomínio Reserva",
    description: "Casa ampla em condomínio fechado com segurança 24h. Adquirida por consórcio contemplado. Possui piscina aquecida, churrasqueira e jardim. Excelente para família. Comprador assume parcelas restantes.",
    condition: "excelente",
    askingPrice: 680000,
    status: "disponivel",
    images: [
      "/images/listings/g-17.jpg",
      "/images/listings/g-18.jpg",
      "/images/listings/g-19.jpg",
      "/images/listings/g-20.jpg",
      "/images/listings/g-21.jpg",
    ],
    createdAt: "2026-02-05",
    views: 723,
    proposals: 11,
    propertyDetails: {
      propertyType: "casa",
      area: 220,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpots: 3,
      hasPool: true,
      hasBarbecue: true,
      furnished: true,
      condominium: 1200,
      iptuMonthly: 450,
      neighborhood: "Condomínio Reserva do Bosque",
      city: "Campinas",
      state: "SP",
      extras: ["Piscina aquecida", "Churrasqueira", "Jardim paisagístico", "Suíte master com closet", "Cozinha planejada", "Home office", "Energia solar", "Cisterna"],
    },
    creditLetter: {
      groupCode: "GRP-8890",
      quotaNumber: 3,
      creditValue: 750000,
      paidAmount: 375000,
      installmentValue: 5200,
      remainingInstallments: 96,
      totalInstallments: 200,
      adminFee: 20,
      reserveFund: 3.5,
      administradora: "Rodobens",
      status: "contemplada",
      isContemplada: true,
      contemplationDate: "2023-11-15",
    },
    seller: {
      name: "Juliana Ferreira",
      rating: 4.9,
      reviews: 7,
      memberSince: "2023",
      verified: true,
      responseTime: "< 1h",
    },
  },
  {
    id: "rp-6",
    category: "caminhao",
    categoryLabel: "Caminhão",
    title: "Mercedes-Benz Accelo 815 Baú 2024",
    description: "Caminhão 3/4 com baú de alumínio, ideal para transporte e entregas. Adquirido via consórcio para uso comercial. Baixa km, manutenções em dia. Ótima oportunidade para quem busca iniciar no transporte.",
    condition: "bom",
    askingPrice: 265000,
    status: "disponivel",
    images: [
      "/images/listings/g-22.jpg",
      "/images/listings/pro-1.jpg",
      "/images/listings/pro-2.jpg",
    ],
    createdAt: "2026-02-18",
    views: 134,
    proposals: 3,
    vehicleDetails: {
      brand: "Mercedes-Benz",
      model: "Accelo 815 Baú",
      year: 2023,
      yearModel: 2024,
      color: "Branco",
      km: 45000,
      fuel: "Diesel",
      transmission: "Manual 6 marchas",
      hasAccidentHistory: false,
      ipvaUpToDate: true,
      hasFines: false,
      extras: ["Baú de alumínio 5,5m", "Plataforma elevatória", "Tacógrafo digital", "Ar condicionado", "Direção hidráulica", "Rastreador GPS"],
    },
    creditLetter: {
      groupCode: "GRP-5521",
      quotaNumber: 7,
      creditValue: 320000,
      paidAmount: 128000,
      installmentValue: 3800,
      remainingInstallments: 160,
      totalInstallments: 200,
      adminFee: 20,
      reserveFund: 3,
      administradora: "Rodobens",
      status: "contemplada",
      isContemplada: true,
      contemplationDate: "2024-02-20",
    },
    seller: {
      name: "Transportes Silva Ltda",
      rating: 4.7,
      reviews: 15,
      memberSince: "2022",
      verified: true,
      responseTime: "< 2h",
    },
  },
];

export const repasseCategories = [
  { value: "", label: "Todas as categorias" },
  { value: "veiculo", label: "Veículos" },
  { value: "imovel", label: "Imóveis" },
  { value: "moto", label: "Motocicletas" },
  { value: "caminhao", label: "Caminhões" },
];

export function getConditionLabel(c: GoodCondition): string {
  const m: Record<GoodCondition, string> = {
    excelente: "Excelente", bom: "Bom", regular: "Regular", precisa_reparos: "Precisa de Reparos",
  };
  return m[c] || c;
}

export function getConditionColor(c: GoodCondition): string {
  const m: Record<GoodCondition, string> = {
    excelente: "#5bbb7b", bom: "#0d6efd", regular: "#f0ad4e", precisa_reparos: "#eb6753",
  };
  return m[c] || "#6c757d";
}

export function getRepasseStatusLabel(s: RepasseStatus): string {
  const m: Record<RepasseStatus, string> = {
    disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido", negociacao: "Em Negociação",
  };
  return m[s] || s;
}

export function getRepasseStatusColor(s: RepasseStatus): string {
  const m: Record<RepasseStatus, string> = {
    disponivel: "#5bbb7b", reservado: "#f0ad4e", vendido: "#6c757d", negociacao: "#0d6efd",
  };
  return m[s] || "#6c757d";
}

export function getCategoryIcon(c: GoodCategory): string {
  const m: Record<GoodCategory, string> = {
    veiculo: "fas fa-car", imovel: "flaticon-home", moto: "fas fa-motorcycle", caminhao: "fas fa-truck", servico: "flaticon-briefcase",
  };
  return m[c] || "flaticon-home";
}
