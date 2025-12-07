// 博客文章数据
export interface BlogPost {
  id: number;
  title: string;
  titleDe?: string;
  titleZh?: string;
  excerpt: string;
  excerptDe?: string;
  excerptZh?: string;
  date: string;
  content: string;
  contentDe?: string;
  contentZh?: string;
  regions?: WineRegion[];
  vocabulary?: VocabularyItem[];
  pairings?: FoodPairing[];
}

export interface WineRegion {
  name: string;
  nameDe: string;
  description: string;
  descriptionDe: string;
  descriptionZh: string;
  famousWines: string[];
  characteristics: string;
  characteristicsDe?: string;
  characteristicsZh?: string;
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

export interface FoodPairing {
  wine: string;
  wineDe?: string;
  wineZh?: string;
  dish: string;
  dishDe?: string;
  dishZh?: string;
  description: string;
  descriptionDe?: string;
  descriptionZh?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Discovering German Wine Regions',
    titleDe: 'Deutsche Weinregionen entdecken',
    titleZh: '探索德国葡萄酒产区',
    excerpt: 'A journey through the beautiful wine regions of Germany...',
    excerptDe: 'Eine Reise durch die schönen Weinregionen Deutschlands...',
    excerptZh: '一次穿越德国美丽葡萄酒产区的旅程...',
    date: '2024-01-15',
    content: 'Germany is home to some of the world\'s most prestigious wine regions. Each region has its unique terroir, grape varieties, and winemaking traditions. Let\'s explore the most famous German wine regions and discover what makes them special.',
    contentDe: 'Deutschland beherbergt einige der renommiertesten Weinregionen der Welt. Jede Region hat ihr einzigartiges Terroir, Rebsorten und Weintraditionen. Lassen Sie uns die berühmtesten deutschen Weinregionen erkunden und entdecken, was sie besonders macht.',
    contentZh: '德国拥有世界上一些最负盛名的葡萄酒产区。每个产区都有其独特的风土、葡萄品种和酿酒传统。让我们探索最著名的德国葡萄酒产区，发现它们的独特之处。',
    regions: [
      {
        name: 'Mosel',
        nameDe: 'Mosel',
        description: 'The Mosel region is famous for its steep, slate-covered slopes that create ideal conditions for Riesling. The region produces some of the world\'s finest white wines, known for their elegance, minerality, and ability to age beautifully.',
        descriptionDe: 'Die Mosel ist berühmt für ihre steilen, schieferbedeckten Hänge, die ideale Bedingungen für Riesling schaffen. Die Region produziert einige der besten Weißweine der Welt, bekannt für ihre Eleganz, Mineralität und ihre Fähigkeit, wunderbar zu altern.',
        descriptionZh: '摩泽尔产区以其陡峭的板岩覆盖山坡而闻名，为雷司令创造了理想条件。该产区生产一些世界顶级的白葡萄酒，以其优雅、矿物质感和出色的陈年潜力而闻名。',
        famousWines: ['Riesling', 'Elbling', 'Müller-Thurgau'],
        characteristics: 'Steep slopes, slate soil, cool climate, high acidity',
        characteristicsDe: 'Steile Hänge, Schieferboden, kühles Klima, hohe Säure',
        characteristicsZh: '陡峭山坡，板岩土壤，凉爽气候，高酸度',
      },
      {
        name: 'Rheingau',
        nameDe: 'Rheingau',
        description: 'Rheingau is one of Germany\'s most prestigious wine regions, located along the Rhine River. It\'s renowned for producing powerful, full-bodied Rieslings with exceptional aging potential. The region benefits from south-facing slopes that capture maximum sunlight.',
        descriptionDe: 'Der Rheingau ist eine der renommiertesten Weinregionen Deutschlands, gelegen entlang des Rheins. Er ist bekannt für die Produktion kräftiger, vollmundiger Rieslings mit außergewöhnlichem Alterungspotenzial. Die Region profitiert von südexponierten Hängen, die maximales Sonnenlicht einfangen.',
        descriptionZh: '莱茵高是德国最负盛名的葡萄酒产区之一，位于莱茵河沿岸。以生产强劲、饱满的雷司令而闻名，具有出色的陈年潜力。该产区受益于朝南的斜坡，能获得最大日照。',
        famousWines: ['Riesling', 'Spätburgunder (Pinot Noir)'],
        characteristics: 'South-facing slopes, loess and loam soil, moderate climate',
        characteristicsDe: 'Südexponierte Hänge, Löss- und Lehmboden, gemäßigtes Klima',
        characteristicsZh: '朝南斜坡，黄土和壤土，温和气候',
      },
      {
        name: 'Pfalz',
        nameDe: 'Pfalz',
        description: 'Pfalz is Germany\'s second-largest wine region and one of the sunniest. It produces a wide variety of wines, from crisp whites to full-bodied reds. The region is known for its diverse terroir and innovative winemaking techniques.',
        descriptionDe: 'Die Pfalz ist Deutschlands zweitgrößte Weinregion und eine der sonnigsten. Sie produziert eine große Vielfalt an Weinen, von knackigen Weißweinen bis hin zu kräftigen Rotweinen. Die Region ist bekannt für ihre vielfältige Terroir und innovative Weinbereitungstechniken.',
        descriptionZh: '普法尔茨是德国第二大葡萄酒产区，也是日照最充足的地区之一。生产从清爽的白葡萄酒到饱满的红葡萄酒等多种类型。该产区以其多样化的风土和创新的酿酒技术而闻名。',
        famousWines: ['Riesling', 'Dornfelder', 'Gewürztraminer', 'Pinot Noir'],
        characteristics: 'Sunny climate, diverse soils, warm temperatures',
        characteristicsDe: 'Sonniges Klima, vielfältige Böden, warme Temperaturen',
        characteristicsZh: '阳光充足，多样化土壤，温暖气候',
      },
      {
        name: 'Baden',
        nameDe: 'Baden',
        description: 'Baden is Germany\'s southernmost and warmest wine region, located near the French border. It\'s known for producing rich, full-bodied wines, especially Pinot Noir (Spätburgunder) and Pinot Gris (Grauburgunder). The region benefits from a Mediterranean-like climate.',
        descriptionDe: 'Baden ist Deutschlands südlichste und wärmste Weinregion, gelegen nahe der französischen Grenze. Sie ist bekannt für die Produktion kräftiger, vollmundiger Weine, insbesondere Spätburgunder und Grauburgunder. Die Region profitiert von einem mediterranen Klima.',
        descriptionZh: '巴登是德国最南端和最温暖的葡萄酒产区，位于法国边境附近。以生产浓郁、饱满的葡萄酒而闻名，特别是黑皮诺（Spätburgunder）和灰皮诺（Grauburgunder）。该产区受益于类似地中海的气候。',
        famousWines: ['Spätburgunder (Pinot Noir)', 'Grauburgunder (Pinot Gris)', 'Weißburgunder (Pinot Blanc)'],
        characteristics: 'Warm climate, diverse soils, Mediterranean influence',
        characteristicsDe: 'Warmes Klima, vielfältige Böden, mediterraner Einfluss',
        characteristicsZh: '温暖气候，多样化土壤，地中海影响',
      },
    ],
  },
  {
    id: 2,
    title: 'German Vocabulary for Wine Tasting',
    titleDe: 'Deutsches Vokabular für die Weinverkostung',
    titleZh: '品酒德语词汇',
    excerpt: 'Essential German words every wine lover should know...',
    excerptDe: 'Wichtige deutsche Wörter, die jeder Weinliebhaber kennen sollte...',
    excerptZh: '每个葡萄酒爱好者都应该知道的重要德语词汇...',
    date: '2024-01-10',
    content: 'Learning German wine vocabulary will enhance your wine tasting experience and help you communicate with German winemakers. Here are essential words and phrases every wine enthusiast should know.',
    contentDe: 'Das Erlernen des deutschen Weinvokabulars wird Ihre Weinerfahrung verbessern und Ihnen helfen, mit deutschen Winzern zu kommunizieren. Hier sind wichtige Wörter und Phrasen, die jeder Weinliebhaber kennen sollte.',
    contentZh: '学习德语葡萄酒词汇将提升您的品酒体验，并帮助您与德国酿酒师交流。以下是每个葡萄酒爱好者都应该知道的重要词汇和短语。',
    vocabulary: [
      {
        word: 'trocken',
        meaning: 'dry',
        example: 'Dieser Wein ist sehr trocken. (This wine is very dry.)',
      },
      {
        word: 'halbtrocken',
        meaning: 'off-dry / semi-dry',
        example: 'Ein halbtrockener Riesling. (An off-dry Riesling.)',
      },
      {
        word: 'fruchtig',
        meaning: 'fruity',
        example: 'Ein fruchtiger Weißwein. (A fruity white wine.)',
      },
      {
        word: 'kräftig',
        meaning: 'full-bodied',
        example: 'Ein kräftiger Rotwein. (A full-bodied red wine.)',
      },
      {
        word: 'süß',
        meaning: 'sweet',
        example: 'Ein süßer Dessertwein. (A sweet dessert wine.)',
      },
      {
        word: 'säure',
        meaning: 'acidity',
        example: 'Die Säure ist gut ausbalanciert. (The acidity is well balanced.)',
      },
      {
        word: 'tannin',
        meaning: 'tannin',
        example: 'Dieser Wein hat kräftige Tannine. (This wine has strong tannins.)',
      },
      {
        word: 'bukett',
        meaning: 'bouquet / aroma',
        example: 'Ein wunderbares Bukett. (A wonderful bouquet.)',
      },
      {
        word: 'geschmack',
        meaning: 'taste / flavor',
        example: 'Ein komplexer Geschmack. (A complex flavor.)',
      },
      {
        word: 'nachhaltig',
        meaning: 'lingering / persistent',
        example: 'Ein langer, nachhaltiger Abgang. (A long, lingering finish.)',
      },
    ],
  },
  {
    id: 3,
    title: 'Pairing German Wines with Food',
    titleDe: 'Deutsche Weine mit Speisen kombinieren',
    titleZh: '德国葡萄酒与食物搭配',
    excerpt: 'Learn how to pair traditional German dishes with local wines...',
    excerptDe: 'Lernen Sie, wie man traditionelle deutsche Gerichte mit lokalen Weinen kombiniert...',
    excerptZh: '学习如何将传统德国菜肴与当地葡萄酒搭配...',
    date: '2024-01-05',
    content: 'German wines offer incredible versatility when it comes to food pairing. From crisp Rieslings to elegant Pinot Noirs, there\'s a perfect German wine for every dish. Here are some classic pairings to try.',
    contentDe: 'Deutsche Weine bieten unglaubliche Vielseitigkeit bei der Speisenkombination. Von knackigen Rieslings bis hin zu eleganten Spätburgundern gibt es für jedes Gericht den perfekten deutschen Wein. Hier sind einige klassische Kombinationen zum Ausprobieren.',
    contentZh: '德国葡萄酒在食物搭配方面具有令人难以置信的多样性。从清爽的雷司令到优雅的黑皮诺，每道菜都有完美的德国葡萄酒。以下是一些值得尝试的经典搭配。',
    pairings: [
      {
        wine: 'Dry Riesling',
        wineDe: 'Trockener Riesling',
        wineZh: '干型雷司令',
        dish: 'Schnitzel with lemon',
        dishDe: 'Schnitzel mit Zitrone',
        dishZh: '柠檬炸肉排',
        description: 'The crisp acidity of a dry Riesling cuts through the richness of fried schnitzel, while the citrus notes complement the lemon.',
        descriptionDe: 'Die knackige Säure eines trockenen Rieslings durchdringt die Reichhaltigkeit des gebratenen Schnitzels, während die Zitrusnoten die Zitrone ergänzen.',
        descriptionZh: '干型雷司令的清爽酸度能够平衡炸肉排的油腻感，而柑橘类香气与柠檬相得益彰。',
      },
      {
        wine: 'Spätburgunder (Pinot Noir)',
        wineDe: 'Spätburgunder',
        wineZh: '黑皮诺（Spätburgunder）',
        dish: 'Sauerbraten',
        dishDe: 'Sauerbraten',
        dishZh: '酸焖牛肉',
        description: 'The earthy, fruity notes of German Pinot Noir pair beautifully with the rich, marinated flavors of Sauerbraten.',
        descriptionDe: 'Die erdigen, fruchtigen Noten des deutschen Spätburgunders passen wunderbar zu den reichen, marinierten Aromen des Sauerbratens.',
        descriptionZh: '德国黑皮诺的泥土和果香与酸焖牛肉丰富的腌制风味完美搭配。',
      },
      {
        wine: 'Gewürztraminer',
        wineDe: 'Gewürztraminer',
        wineZh: '琼瑶浆',
        dish: 'Currywurst',
        dishDe: 'Currywurst',
        dishZh: '咖喱香肠',
        description: 'The spicy, aromatic character of Gewürztraminer stands up to the bold flavors of currywurst.',
        descriptionDe: 'Der würzige, aromatische Charakter des Gewürztraminers hält den kräftigen Aromen der Currywurst stand.',
        descriptionZh: '琼瑶浆的辛辣和芳香特质能够与咖喱香肠的浓郁风味相抗衡。',
      },
      {
        wine: 'Off-dry Riesling',
        wineDe: 'Halbtrockener Riesling',
        wineZh: '半干雷司令',
        dish: 'Pork knuckle (Schweinshaxe)',
        dishDe: 'Schweinshaxe',
        dishZh: '烤猪肘',
        description: 'The slight sweetness of off-dry Riesling balances the savory, fatty flavors of pork knuckle.',
        descriptionDe: 'Die leichte Süße des halbtrockenen Rieslings gleicht die herzhaften, fetten Aromen der Schweinshaxe aus.',
        descriptionZh: '半干雷司令的微甜能够平衡烤猪肘的咸香和油腻感。',
      },
      {
        wine: 'Grauburgunder (Pinot Gris)',
        wineDe: 'Grauburgunder',
        wineZh: '灰皮诺（Grauburgunder）',
        dish: 'Fish dishes',
        dishDe: 'Fischgerichte',
        dishZh: '鱼类菜肴',
        description: 'The full-bodied texture and subtle fruitiness of Pinot Gris complement delicate fish preparations.',
        descriptionDe: 'Die vollmundige Textur und die subtile Fruchtigkeit des Grauburgunders ergänzen zarte Fischzubereitungen.',
        descriptionZh: '灰皮诺的饱满口感和微妙的果香能够衬托精致的鱼类菜肴。',
      },
    ],
  },
];

// 根据 ID 获取文章
export function getPostById(id: number): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

// 获取所有文章
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

