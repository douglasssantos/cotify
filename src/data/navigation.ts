export interface NavItem {
  name: string;
  path?: string;
  children?: NavItem[];
}

export const publicNavigation: NavItem[] = [
  { name: "Início", path: "/" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "Repasses", path: "/marketplace/repasses" },
  { name: "Grupos", path: "/marketplace/grupos" },
  { name: "Assembleias", path: "/marketplace/assembleias" },
  { name: "Simulador", path: "/simulador" },
];

export const headerNavigation: NavItem[] = [
  {
    name: "Marketplace",
    children: [
      { name: "Todas as Cotas", path: "/marketplace" },
      { name: "Repasses", path: "/marketplace/repasses" },
      { name: "Grupos", path: "/marketplace/grupos" },
      { name: "Administradoras", path: "/marketplace/administradoras" },
      { name: "Assembleias", path: "/marketplace/assembleias" },
    ],
  },
  { name: "Simulador", path: "/simulador" },
  {
    name: "Dashboards",
    children: [
      { name: "Cotista", path: "/cotista" },
      { name: "Administradora", path: "/administradora" },
      { name: "Cooperativa", path: "/cooperativa" },
      { name: "Revenda", path: "/revenda" },
    ],
  },
];

export const megaMenuCategories = [
  {
    icon: "flaticon-home",
    title: "Imóveis",
    subCategories: [
      {
        title: "Residencial",
        items: [
          { name: "Casa", path: "/marketplace?tipo=imovel" },
          { name: "Apartamento", path: "/marketplace?tipo=imovel" },
          { name: "Terreno", path: "/marketplace?tipo=imovel" },
          { name: "Chácara / Sítio", path: "/marketplace?tipo=imovel" },
        ],
      },
      {
        title: "Comercial",
        items: [
          { name: "Sala Comercial", path: "/marketplace?tipo=imovel" },
          { name: "Loja", path: "/marketplace?tipo=imovel" },
          { name: "Galpão", path: "/marketplace?tipo=imovel" },
        ],
      },
    ],
  },
  {
    icon: "flaticon-car",
    title: "Veículos",
    subCategories: [
      {
        title: "Leves",
        items: [
          { name: "Carro", path: "/marketplace?tipo=veiculo" },
          { name: "Moto", path: "/marketplace?tipo=veiculo" },
          { name: "Utilitário", path: "/marketplace?tipo=veiculo" },
        ],
      },
      {
        title: "Pesados",
        items: [
          { name: "Caminhão", path: "/marketplace?tipo=veiculo" },
          { name: "Van", path: "/marketplace?tipo=veiculo" },
          { name: "Ônibus", path: "/marketplace?tipo=veiculo" },
        ],
      },
    ],
  },
  {
    icon: "flaticon-developer",
    title: "Serviços",
    subCategories: [
      {
        title: "Pessoal",
        items: [
          { name: "Reforma", path: "/marketplace?tipo=servico" },
          { name: "Educação", path: "/marketplace?tipo=servico" },
          { name: "Saúde", path: "/marketplace?tipo=servico" },
          { name: "Viagem", path: "/marketplace?tipo=servico" },
        ],
      },
      {
        title: "Empresarial",
        items: [
          { name: "Equipamentos", path: "/marketplace?tipo=servico" },
          { name: "Tecnologia", path: "/marketplace?tipo=servico" },
          { name: "Infraestrutura", path: "/marketplace?tipo=servico" },
        ],
      },
    ],
  },
];

export const cotistaNavigation = [
  { name: "Dashboard", path: "/cotista", icon: "flaticon-discovery" },
  { name: "Minhas Cotas", path: "/cotista/minhas-cotas", icon: "flaticon-document" },
  // { name: "Meus Lances", path: "/cotista/lances", icon: "flaticon-flash" },
  // { name: "Financeiro", path: "/cotista/financeiro", icon: "flaticon-dollar" },
  { name: "Anunciar Cota", path: "/cotista/anunciar", icon: "flaticon-megaphone" },
  { name: "Meus Anúncios", path: "/cotista/anuncios", icon: "flaticon-shop" },
  { name: "Transferências", path: "/cotista/transferencias", icon: "flaticon-transfer" },
  { name: "Meu Perfil", path: "/cotista/perfil", icon: "flaticon-user" },
];

export const administradoraNavigation = [
  { name: "Dashboard", path: "/administradora", icon: "flaticon-discovery" },
  { name: "Grupos", path: "/administradora/grupos", icon: "flaticon-document" },
  { name: "Cotas", path: "/administradora/cotas", icon: "flaticon-contract" },
  { name: "Assembleias", path: "/administradora/assembleias", icon: "flaticon-calendar" },
  { name: "Transferências", path: "/administradora/transferencias", icon: "flaticon-transfer" },
  { name: "Financeiro", path: "/administradora/financeiro", icon: "flaticon-dollar" },
  { name: "Relatórios", path: "/administradora/relatorios", icon: "flaticon-chart" },
];

export const cooperativaNavigation = [
  { name: "Dashboard", path: "/cooperativa", icon: "flaticon-discovery" },
  { name: "Cooperados", path: "/cooperativa/cooperados", icon: "flaticon-user" },
  { name: "Grupos", path: "/cooperativa/grupos", icon: "flaticon-document" },
  { name: "Assembleias", path: "/cooperativa/assembleias", icon: "flaticon-calendar" },
  { name: "Sobras", path: "/cooperativa/sobras", icon: "flaticon-dollar" },
  { name: "Relatórios", path: "/cooperativa/relatorios", icon: "flaticon-chart" },
];

export const revendaNavigation = [
  { name: "Dashboard", path: "/revenda", icon: "flaticon-discovery" },
  { name: "Minhas Vendas", path: "/revenda/vendas", icon: "flaticon-shop" },
  { name: "Comissões", path: "/revenda/comissoes", icon: "flaticon-dollar" },
  { name: "Leads", path: "/revenda/leads", icon: "flaticon-user" },
  { name: "Links", path: "/revenda/links", icon: "flaticon-link" },
  { name: "Simulador", path: "/revenda/simulador", icon: "flaticon-flash" },
];

export const footerAbout = [
  { name: "Sobre nós", path: "/sobre" },
  { name: "Como funciona", path: "/como-funciona" },
  { name: "Carreiras", path: "/carreiras" },
  { name: "Blog", path: "/blog" },
];

export const footerCategories = [
  { name: "Imóveis", path: "/marketplace?tipo=imovel" },
  { name: "Veículos", path: "/marketplace?tipo=veiculo" },
  { name: "Serviços", path: "/marketplace?tipo=servico" },
  { name: "Cotas Contempladas", path: "/marketplace?status=contemplada" },
];

export const footerSupport = [
  { name: "Central de Ajuda", path: "/ajuda" },
  { name: "Termos de Uso", path: "/termos" },
  { name: "Política de Privacidade", path: "/privacidade" },
  { name: "Contato", path: "/contato" },
];
