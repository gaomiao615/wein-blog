// i18n types
export type Locale = 'en' | 'de' | 'zh';

export interface Translations {
  nav: {
    home: string;
    blog: string;
    wines: string;
    learning: string;
    about: string;
    language: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  wines: {
    listTitle: string;
    color: string;
    colorRed: string;
    colorWhite: string;
    colorRose: string;
    style: string;
    styleStill: string;
    styleSparkling: string;
    styleFortified: string;
    sweetness: string;
    sweetnessDry: string;
    sweetnessOffDry: string;
    sweetnessMedium: string;
    sweetnessSweet: string;
    body: string;
    bodyLight: string;
    bodyMedium: string;
    bodyFull: string;
    price: string;
    priceBudget: string;
    priceMid: string;
    pricePremium: string;
    filtersApply: string;
    filtersReset: string;
    detailsTitle: string;
    country: string;
    region: string;
    grapes: string;
    tasting: string;
    pairing: string;
    personalNotes: string;
    addToCollection: string;
    removeFromCollection: string;
    myRating: string;
  };
  learning: {
    title: string;
    subtitle: string;
    word: string;
    meaning: string;
    example: string;
  };
  comments: {
    title: string;
    name: string;
    message: string;
    submit: string;
    empty: string;
  };
  messages: {
    saved: string;
    error: string;
    addedToCollection: string;
    removedFromCollection: string;
  };
  buttons: {
    readMore: string;
    back: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
  };
  blog: {
    featuredRegions: string;
    famousWines: string;
    characteristics: string;
    foodPairing: string;
    with: string;
    articleNotFound: string;
    articleNotFoundDesc: string;
    backToBlog: string;
    backToBlogList: string;
  };
  search: {
    title: string;
    placeholder: string;
    search: string;
    scanQR: string;
    takePhoto: string;
    noResults: string;
    searching: string;
    scanning: string;
    scanningHint: string;
    codeNotFound: string;
    manualInput: string;
    enterCode: string;
    submitCode: string;
    cameraPermission: string;
    cameraError: string;
    close: string;
    cancel: string;
    retry: string;
    requestPermission: string;
    uploadImage: string;
    selectImage: string;
    analyzing: string;
    enterUrl: string;
    analyzeUrl: string;
    imageRecognized: string;
    imageNotRecognized: string;
    urlAnalyzed: string;
    urlNotRecognized: string;
  };
}

