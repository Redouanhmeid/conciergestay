export const getHouseRuleDetails = (rule) => {
 const icons = {
  noNoise: {
   icon: <i className="icon-style-dg fa-light fa-volume-slash"></i>,
   title: 'Pas de bruit après 23h',
  },
  noFoodDrinks: {
   icon: <i className="icon-style-dg fa-light fa-utensils-slash"></i>,
   title: 'Pas de nourriture ni de boissons dans les chambres à coucher',
  },
  noParties: {
   icon: <i className="icon-style-dg fa-light fa-champagne-glasses"></i>,
   title: "Pas de fêtes ni d'événements",
  },
  noSmoking: {
   icon: <i className="icon-style-dg fa-light fa-ban-smoking"></i>,
   title: 'Défense de fumer',
  },
  noPets: {
   icon: <i className="icon-style-dg fa-light fa-paw-simple"></i>,
   title: 'Animaux de compagnie autorisés',
  },
  additionalRules: {
   icon: <i className="icon-style-dg fa-light fa-circle-info"></i>,
   title: 'Règles supplémentaires',
  },
 };
 return icons[rule] || { icon: null, title: '' };
};

export const getElementsDetails = (element) => {
 const elements = {
  cameras: {
   icon: <i className="icon-style-dg fa-light fa-camera-cctv"></i>,
   title: 'Caméras de surveillance extérieures',
  },
  sonometers: {
   icon: <i className="icon-style-dg fa-light fa-gauge-low"></i>,
   title: 'Sonomètres',
  },
 };
 return elements[element] || { icon: null, title: '' };
};

export const getSafetyFeaturesDetails = (feature) => {
 const features = {
  smokeDetector: {
   icon: <i className="icon-style-dg fa-light fa-sensor-cloud"></i>,
   title: 'Détecteur de fumée',
  },
  firstAidKit: {
   icon: <i className="icon-style-dg fa-light fa-suitcase-medical"></i>,
   title: 'Kit de premiers secours',
  },
  fireExtinguisher: {
   icon: <i className="icon-style-dg fa-light fa-fire-extinguisher"></i>,
   title: 'Extincteur',
  },
  carbonMonoxideDetector: {
   icon: <i className="icon-style-dg fa-light fa-sensor"></i>,
   title: 'Détecteur de monoxyde de carbone',
  },
 };
 return features[feature] || { icon: null, title: '' };
};

export const getEarlyCheckInDetails = (earlyCheckIn) => {
 switch (earlyCheckIn) {
  case 'heureNonFlexible':
   return "Malheureusement l'heure d'arrivée n'est pas flexible.";
  case 'ajustementHeure':
   return "À l'occasion il est possible d'ajuster votre heure d'arrivée si vous nous contactez.";
  case 'autreHeureArrivee':
   return 'Lorsque que cela est possible, nous pouvons vous arranger en vous proposant une autre heure d’arrivée qui vous conviendrait mieux. Contactez nous à l’avance si vous souhaitez modifier votre heure d’arrivée.';
  case 'laissezBagages':
   return 'Vous pouvez laissez vos bagages pendant la journée.';
  default:
   return '';
 }
};

export const getAccessToPropertyDetails = (accessToProperty) => {
 switch (accessToProperty) {
  case 'cleDansBoite':
   return 'La clé de la maison se trouve dans la boîte à clé';
  case 'acceuilContactezMoi':
   return 'On sera là pour vous accueillir, sinon, contactez moi quand vous arrivez.';
  case 'codesAccesCourriel':
   return 'Nous vous enverrons vos codes d’accès par courriel avant votre arrivée.';
  case 'verifiezCourriel':
   return 'Vérifiez votre courriel pour les instructions relatives à votre arrivée.';
  case 'serrureNumero':
   return 'Nous avons une serrure à numéro.';
  default:
   return '';
 }
};

export const getLateCheckOutPolicyDetails = (lateCheckOutPolicy) => {
 switch (lateCheckOutPolicy) {
  case 'heureNonFlexible':
   return 'Malheureusement l’heure de départ n’est pas flexible.';
  case 'heureDepartAlternative':
   return 'Lorsque l’horaire le permet, il nous fait plaisir d’accommoder une heure de départ alternative. Contactez-nous à l’avance si vous souhaitez prendre un arrangement à cet effet.';
  case 'contactezNous':
   return 'Communiquez avec nous si vous aimeriez quitter plus tard.';
  case 'optionDepartTardif':
   return 'Montrer l’option du départ tardif (si ce n’est pas coché on ne va pas le mentionner)';
  default:
   return '';
 }
};

export const getBeforeCheckOutDetails = (beforeCheckOut) => {
 switch (beforeCheckOut) {
  case 'vaisselleLaveVaisselle':
   return 'Mettez la vaisselle de dernière minute dans le lave-vaisselle.';
  case 'eteindreAppareilsElectriques':
   return 'Merci de vous assurer que vous avez bien éteint la cuisinière, lumières et autres appareils électriques.';
  case 'porteNonVerrouillee':
   return 'Assurez-vous que les portes sont verrouillées.';
  case 'laissezBagages':
   return 'Vous pouvez laissez vos bagages dans la propriété après l’heure du départ.';
  case 'signezLivreOr':
   return 'S’il vous plait, signez notre livre d’or avant de partir.';
  case 'litsNonFaits':
   return 'Laissez les lits que vous avez utilisés défaits.';
  case 'laverVaisselle':
   return 'Merci de laver et ranger vaisselle et plats utilisés.';
  case 'replacezMeubles':
   return 'Replacez les meubles à leur endroit original.';
  case 'deposePoubelles':
   return 'Merci de déposer poubelles et déchets dans les containers appropriés.';
  case 'serviettesDansBaignoire':
   return 'Mettez vos serviettes utilisées dans la baignoire.';
  case 'serviettesParTerre':
   return 'Laissez les serviettes utilisées par terre.';
  case 'portesVerrouillees':
   return 'Laissez la porte déverrouillée.';
  case 'laissezCleMaison':
   return ' Laissez la clé dans la maison.';
  case 'laissezCleBoiteCle':
   return 'Laissez la clé dans la boîte à clef.';
  default:
   return '';
 }
};
