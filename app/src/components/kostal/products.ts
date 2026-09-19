export type Product = {
  id: string; name: string; file: string; category: string;
  description: string; function: string; detail: string;
};
export const products: Product[] = [
  { id: "multifunction", name: "Alavanca multifuncional", file: "/assets/models/multifunction-stalk.glb", category: "Comandos",
    description: "Comandos reunidos ao alcance das mãos, com seletores integrados ao conjunto da coluna de direção.",
    function: "Interface de comando na coluna de direção", detail: "Anéis seletores, coifa e suporte de montagem" },
  { id: "steering", name: "Controle do volante", file: "/assets/models/steering-control.glb", category: "Comandos",
    description: "Uma interface compacta que reúne botões de acionamento no volante.",
    function: "Acionamento de funções pelo volante", detail: "Superfícies de contato e disposição dos botões" },
  { id: "window", name: "Interruptor dos vidros", file: "/assets/models/window-switch.glb", category: "Comandos",
    description: "Explore a capa e o encaixe de um comando de vidro elétrico, representados lado a lado.",
    function: "Interface de acionamento dos vidros", detail: "Geometria da capa e pontos de fixação" },
  { id: "signal-stalk", name: "Alavanca de comando: variante", file: "/assets/models/signal-stalk.glb", category: "Comandos",
    description: "Outra representação do conjunto de comando, para observar o corpo da alavanca e sua conexão com o suporte.",
    function: "Interface de comando na coluna de direção", detail: "Seletores, conexão e montagem do conjunto" },
  { id: "connector", name: "Conector elétrico", file: "/assets/models/electrical-connector.glb", category: "Conexão",
    description: "O ponto de encontro entre componentes e chicotes. Observe a carcaça, os encaixes e a região dos terminais.",
    function: "Interconexão de circuitos elétricos", detail: "Carcaça, terminais e travas de encaixe" },
  { id: "spring", name: "Cinta de airbag", file: "/assets/models/clock-spring.glb", category: "Movimento",
    description: "Um conjunto para continuidade elétrica entre a coluna de direção e os sistemas presentes no volante.",
    function: "Conexão elétrica durante a rotação do volante", detail: "Carcaça circular e saídas dos conectores" },
  { id: "buzzer", name: "Avisador piezoelétrico", file: "/assets/models/piezo-buzzer.glb", category: "Sinal",
    description: "Uma solução compacta para sinalização sonora. Explore o corpo do componente, seus cabos e o conector.",
    function: "Emissão de avisos sonoros", detail: "Corpo do avisador e interface elétrica" },
  { id: "key", name: "Chave automotiva", file: "/assets/models/car-key-fob.glb", category: "Acesso",
    description: "Acionamento na palma da mão. Observe a disposição dos botões e a forma da carcaça.",
    function: "Interface de acesso ao veículo", detail: "Botões, acabamento e ergonomia da carcaça" },
];
