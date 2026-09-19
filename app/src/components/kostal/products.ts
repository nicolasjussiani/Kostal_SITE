export type Product = {
  id: string; name: string; category: string; sku: string;
  file: string | null; image: string; source: string;
  description: string; detail: string;
};
export type Category = { id: string; label: string; url: string; emptyNote?: string };
export const categories: Category[] = [
  {
    "id": "chave-de-seta",
    "label": "Chave de seta",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/chave-de-seta"
  },
  {
    "id": "comutadores",
    "label": "Comutadores",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/comutadores"
  },
  {
    "id": "controles",
    "label": "Controles",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/controles"
  },
  {
    "id": "interruptor",
    "label": "Interruptor",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/interruptor"
  },
  {
    "id": "modulos",
    "label": "Módulos",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/modulos"
  },
  {
    "id": "outros",
    "label": "Outros",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/outros",
    "emptyNote": "Esta seção está sem produtos publicados no catálogo oficial."
  },
  {
    "id": "potenciometro",
    "label": "Potenciômetro",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/potenciometro",
    "emptyNote": "O catálogo informa dois produtos, mas não exibe as peças desta seção."
  },
  {
    "id": "remates",
    "label": "Remates",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/remates"
  },
  {
    "id": "sensores",
    "label": "Sensores",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/sensores"
  },
  {
    "id": "sistemas-eletricos",
    "label": "Sistemas elétricos",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/sistemas-eletricos"
  },
  {
    "id": "soquete",
    "label": "Soquete",
    "url": "https://kostalbrasil.com.br/catalogo/pecas/soquete"
  }
];
export const products: Product[] = [
  {
    "id": "chave-de-seta",
    "name": "Chave combinada",
    "category": "Chave de seta",
    "sku": "12270239",
    "file": "/assets/models/multifunction-stalk.glb",
    "image": "/assets/catalog/chave-de-seta.png",
    "source": "https://kostalbrasil.com.br/produto/1315/chave-combinada-12270239",
    "description": "Comandos de sinalização e iluminação reunidos em uma alavanca da coluna de direção.",
    "detail": "Anéis seletores, coifa e suporte metálico"
  },
  {
    "id": "comutadores",
    "name": "Comutador de ignição",
    "category": "Comutadores",
    "sku": "4827995",
    "file": "/assets/models/piezo-buzzer.glb",
    "image": "/assets/catalog/comutadores.jpg",
    "source": "https://kostalbrasil.com.br/produto/17/comutador-de-ignicao-4827995",
    "description": "Conjunto de comutação da ignição, com chicote e conector integrados.",
    "detail": "Corpo circular, fios e conector"
  },
  {
    "id": "controles",
    "name": "Chave controle remoto",
    "category": "Controles",
    "sku": "10026228",
    "file": "/assets/models/car-key-fob.glb",
    "image": "/assets/catalog/controles.jpg",
    "source": "https://kostalbrasil.com.br/produto/551/chave-controle-remoto-10026228",
    "description": "Controle remoto compacto com dois botões e indicador luminoso.",
    "detail": "Botões, indicador e pontos de encaixe"
  },
  {
    "id": "interruptor",
    "name": "Botão de emergência preto",
    "category": "Interruptor",
    "sku": "12057061",
    "file": null,
    "image": "/assets/catalog/interruptor.jpg",
    "source": "https://kostalbrasil.com.br/produto/827/botao-de-emergencia-preto-12057061",
    "description": "Conjunto do botão de emergência preto, apresentado com seus componentes na foto do catálogo.",
    "detail": "Capa, mecanismo e molas"
  },
  {
    "id": "modulos",
    "name": "Módulo do vidro elétrico",
    "category": "Módulos",
    "sku": "10020532",
    "file": "/assets/models/window-module.glb",
    "image": "/assets/catalog/modulos.jpg",
    "source": "https://kostalbrasil.com.br/produto/171/modulo-do-vidro-eletrico-10020532",
    "description": "Módulo de acionamento do vidro elétrico, com carcaça compacta e conexões superiores.",
    "detail": "Carcaça, travas e conectores"
  },
  {
    "id": "remates",
    "name": "Remate",
    "category": "Remates",
    "sku": "10200691",
    "file": "/assets/models/window-switch.glb",
    "image": "/assets/catalog/remates.jpg",
    "source": "https://kostalbrasil.com.br/produto/565/remate-10200691",
    "description": "Peça de acabamento para o painel, apresentada em vistas frontal e traseira.",
    "detail": "Face externa e travas de fixação"
  },
  {
    "id": "sensores",
    "name": "Luz de teto",
    "category": "Sensores",
    "sku": "10143573",
    "file": "/assets/models/steering-control.glb",
    "image": "/assets/catalog/sensores.png",
    "source": "https://kostalbrasil.com.br/produto/1012/luz-de-teto-10143573",
    "description": "Conjunto da luz de teto com comandos integrados, listado na seção Sensores do catálogo.",
    "detail": "Botões, difusores e contorno da carcaça"
  },
  {
    "id": "sistemas-eletricos",
    "name": "Cinta de airbag 10 vias",
    "category": "Sistemas elétricos",
    "sku": "10094738",
    "file": "/assets/models/clock-spring.glb",
    "image": "/assets/catalog/sistemas-eletricos.jpg",
    "source": "https://kostalbrasil.com.br/produto/831/cinta-de-airbag-10-vias-10094738",
    "description": "Cinta de airbag com 10 vias, chicote e conectores para a coluna de direção.",
    "detail": "Anel central, saídas elétricas e travas"
  },
  {
    "id": "soquete",
    "name": "Soquete luz de aviso",
    "category": "Soquete",
    "sku": "6120510",
    "file": "/assets/models/electrical-connector.glb",
    "image": "/assets/catalog/soquete.jpg",
    "source": "https://kostalbrasil.com.br/produto/275/soquete-luz-de-aviso-6120510",
    "description": "Soquete para luz de aviso, apresentado em duas vistas para observar o encaixe e os terminais.",
    "detail": "Abertura frontal, corpo e terminais"
  }
];
