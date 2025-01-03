import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '../../context/TranslationContext';

// useBasicTranslations.js
export const useBasicTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 const loadTranslations = useCallback(async () => {
  setTranslations({
   title: await t(
    'property.basic.title',
    'Enregistrez les informations de votre propriété'
   ),
   name: await t('property.basic.name', 'Nom'),
   description: await t('property.basic.description', 'Description'),
   type: await t('property.basic.type', 'Type de propriété'),
   location: await t('property.basic.location', 'Emplacement'),
   capacity: await t('property.basic.capacity', 'Max Personnes'),
   rooms: await t('property.basic.capacity', 'Chambres'),
   beds: await t('property.basic.capacity', 'Lits'),
   price: await t('property.basic.price', 'Fixez votre prix'),
   airbnbUrl: await t('property.basic.airbnbUrl', 'Airbnb URL'),
   bookingUrl: await t('property.basic.bookingUrl', 'Booking URL'),
   selectLocation: await t(
    'property.basic.selectLocation',
    'Sélectionnez un emplacement sur la carte'
   ),
  });
 }, [t]);

 useEffect(() => {
  loadTranslations();
 }, [loadTranslations]);

 return translations;
};

// usePropertyTypeTranslations.js
export const usePropertyTypeTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    house: await t('type.house', 'Maison'),
    apartment: await t('type.apartment', 'Appartement'),
    guesthouse: await t('type.guesthouse', "Maison d'hôtes"),
    select: await t(
     'type.select',
     'Veuillez sélectionner un type de propriété!'
    ),
   });
  };

  loadTranslations();
 }, [t]);

 return translations;
};

// useValidationTranslations.js
export const useValidationTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    required: await t('validation.required', 'Ce champ est requis'),
    selectType: await t(
     'validation.selectType',
     'Veuillez sélectionner un type de propriété!'
    ),
    enterName: await t('validation.enterName', 'Veuillez saisir votre nom!'),
    enterDescription: await t(
     'validation.enterDescription',
     'Veuillez saisir une description!'
    ),
    selectLocation: await t(
     'validation.selectLocation',
     'Veuillez sélectionner un emplacement sur la carte'
    ),
    enterPrice: await t('validation.enterPrice', 'Veuillez saisir un prix!'),
    enterCapacity: await t(
     'validation.enterCapacity',
     'Veuillez saisir une capacité!'
    ),
    enterRooms: await t(
     'validation.enterRooms',
     'Veuillez saisir le nombre de chambres!'
    ),
    enterBeds: await t(
     'validation.enterBeds',
     'Veuillez saisir le nombre de lits!'
    ),
    validUrl: await t('validation.validUrl', 'Veuillez saisir une URL valide!'),
   });
  };

  loadTranslations();
 }, [t]);

 return translations;
};

export const usePhotosTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    title: await t('photo.title', 'Ajouter des Photos de votre logement'),
    addPhotos: await t('validation.addPhotos', 'Ajouter des Photos'),
    dragDrop: await t(
     'photo.dragDrop',
     'Vous pouvez réorganiser vos photos en les glissant-déposant'
    ),
    maxReached: await t(
     'photo.maxReached',
     'Vous avez atteint le nombre maximum de photos.'
    ),
    upload: await t('photo.upload', 'Charger'),
    uploading: await t('photo.uploading', 'Téléchargement en cours...'),
    uploadSuccess: await t(
     'photo.uploadSuccess',
     'Photos téléchargées avec succès'
    ),
    uploadError: await t(
     'photo.uploadError',
     'Erreur lors du téléchargement des photos'
    ),
   });
  };
  loadTranslations();
 }, [t]);

 return translations;
};

export const useButtonsTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    back: await t('button.back', 'Retour'),
    continue: await t('button.continue', 'Continue'),
    save: await t('button.save', 'Enregistrer'),
    update: await t('button.update', 'Mettre à jour'),
    delete: await t('button.delete', 'Supprimer'),
    confirm: await t('button.confirm', 'Confirmer'),
   });
  };
  loadTranslations();
 }, [t]);
 return translations;
};

export const useCheckInTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    title: await t('checkIn.title', 'Arrivée'),
    earliestTime: await t(
     'checkIn.earliestTime',
     "Quand est l'heure la plus tôt à laquelle les invités peuvent s'enregistrer ?"
    ),
    policyTitle: await t(
     'checkIn.policyTitle',
     'Sélectionnez les déclarations qui décrivent le mieux votre politique en matière de check-in anticipé.'
    ),
    policyNotFlexible: await t(
     'checkIn.policyNotFlexible',
     "Malheureusement l'heure d'arrivée n'est pas flexible."
    ),
    policyAdjustTime: await t(
     'checkIn.policyAdjustTime',
     "À l'occasion il est possible d'ajuster votre heure d'arrivée si vous nous contactez."
    ),
    policyAlternateTime: await t(
     'checkIn.policyAlternateTime',
     'Lorsque que cela est possible, nous pouvons vous arranger...'
    ),
    policyStoreBags: await t(
     'checkIn.policyStoreBags',
     'Vous pouvez laissez vos bagages pendant la journée.'
    ),
    accessTitle: await t(
     'checkIn.accessTitle',
     'Sélectionnez les déclarations qui décrivent le mieux la manière dont vos invités accéderont à la propriété.'
    ),
    accessKeyInBox: await t(
     'checkIn.accessKeyInBox',
     'La clé de la maison se trouve dans la boîte à clé'
    ),
    accessWelcomeContact: await t(
     'checkIn.accessWelcomeContact',
     'On sera là pour vous accueillir, sinon, contactez moi quand vous arrivez.'
    ),
    accessCodesByEmail: await t(
     'checkIn.accessCodesByEmail',
     "Nous vous enverrons vos codes d'accès par courriel avant votre arrivée."
    ),
    accessCheckEmail: await t(
     'checkIn.accessCheckEmail',
     'Vérifiez votre courriel pour les instructions relatives à votre arrivée.'
    ),
    accessNumberLock: await t(
     'checkIn.accessNumberLock',
     'Nous avons une serrure à numéro.'
    ),
    guestInfo: await t(
     'checkIn.guestInfo',
     'Quelles informations vos invités doivent-ils connaître pour accéder à la propriété ?'
    ),
    frontPhoto: await t(
     'checkIn.frontPhoto',
     'Photo de la façade de la résidence ou de la maison.'
    ),
    videoInstructions: await t(
     'checkIn.videoInstructions',
     "Lien vidéo pour les instructions d'enregistrement"
    ),
    hostVideo: await t(
     'checkIn.hostVideo',
     'Hébergez vos vidéos sur Vimeo ou Youtube avant'
    ),
   });
  };
  loadTranslations();
 }, [t]);
 return translations;
};

export const useCheckOutTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    checkOutTitle: await t('property.checkOutTitle', 'Départ'),
    checkOutDepartureTime: await t(
     'property.checkOutDepartureTime',
     'À quelle heure voulez-vous demander aux invités de quitter les lieux ?'
    ),
    policyTitle: await t(
     'property.checkOut.policyTitle',
     'Sélectionnez les déclarations qui décrivent le mieux votre politique de départ tardif :'
    ),
    policyNotFlexible: await t(
     'checkOut.policyNotFlexible',
     "Malheureusement l'heure de départ n'est pas flexible."
    ),
    policyAlternateTime: await t(
     'checkOut.policyAlternateTime',
     "Lorsque l'horaire le permet, il nous fait plaisir d'accommoder une heure de départ alternative."
    ),
    policyContactUs: await t(
     'checkOut.policyContactUs',
     'Communiquez avec nous si vous aimeriez quitter plus tard.'
    ),
    policyLateOption: await t(
     'checkOut.policyLateOption',
     "Montrer l'option du départ tardif"
    ),
    tasksTitle: await t(
     'checkOut.tasksTitle',
     'Que doivent faire les invités avant de partir ?'
    ),
    tasksStoreBags: await t(
     'checkOut.tasksStoreBags',
     "Vous pouvez laissez vos bagages dans la propriété après l'heure du départ."
    ),
    tasksGuestBook: await t(
     'checkOut.tasksGuestBook',
     "S'il vous plait, signez notre livre d'or avant de partir."
    ),
    tasksUnmadeBeds: await t(
     'checkOut.tasksUnmadeBeds',
     'Laissez les lits que vous avez utilisés défaits.'
    ),
    tasksCleanDishes: await t(
     'checkOut.tasksCleanDishes',
     'Merci de laver et ranger vaisselle et plats utilisés.'
    ),
    tasksFinalDishes: await t(
     'checkOut.tasksFinalDishes',
     'Mettez la vaisselle de dernière minute dans le lave-vaisselle.'
    ),
    tasksTurnOffAppliances: await t(
     'checkOut.tasksTurnOffAppliances',
     'Merci de vous assurer que vous avez bien éteint la cuisinière, lumières et autres appareils électriques.'
    ),
    tasksReplaceFurniture: await t(
     'checkOut.tasksReplaceFurniture',
     'Replacez les meubles à leur endroit original.'
    ),
    tasksGarbage: await t(
     'checkOut.tasksGarbage',
     'Merci de déposer poubelles et déchets dans les containers appropriés.'
    ),
    tasksTowelsInBath: await t(
     'checkOut.tasksTowelsInBath',
     'Mettez vos serviettes utilisées dans la baignoire.'
    ),
    tasksTowelsOnFloor: await t(
     'checkOut.tasksTowelsOnFloor',
     'Laissez les serviettes utilisées par terre.'
    ),
    tasksDoorUnlocked: await t(
     'checkOut.tasksDoorUnlocked',
     'Laissez la porte déverrouillée.'
    ),
    tasksDoorLocked: await t(
     'checkOut.tasksDoorLocked',
     'Assurez-vous que les portes sont verrouillées.'
    ),
    tasksKeyInHouse: await t(
     'checkOut.tasksKeyInHouse',
     'Laissez la clé dans la maison.'
    ),
    tasksKeyInBox: await t(
     'checkOut.tasksKeyInBox',
     'Laissez la clé dans la boîte à clef.'
    ),
    additionalInfo: await t(
     'checkOut.additionalInfo',
     'Informations supplémentaires sur le départ :'
    ),
   });
  };
  loadTranslations();
 }, [t]);
 return translations;
};

export const useRulesTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    title: await t('rules.title', 'Règles de la maison'),
    noNoise: await t('rules.noNoise', 'Pas de bruit après 23h'),
    noFood: await t(
     'rules.noFood',
     'Pas de nourriture ni de boissons dans les chambres à coucher'
    ),
    noParties: await t('rules.noParties', "Pas de fêtes ni d'événements"),
    noSmoking: await t('rules.noSmoking', 'Défense de fumer'),
    noPets: await t('rules.noPets', "Pas d'animaux de compagnie"),
    noUnmarriedCouple: await t(
     'rules.noUnmarriedCouple',
     'Pas de couple non marié'
    ),
    additional: await t('rules.additional', 'Règles supplémentaires'),
    additionalRules: await t('rules.additionalRules', 'Règles supplémentaires'),
   });
  };

  loadTranslations();
 }, [t]);

 return translations;
};

export const useMessagesTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({});

 useEffect(() => {
  const loadTranslations = async () => {
   setTranslations({
    deleteConfirm: await t(
     'messages.deleteConfirm',
     'Etes-vous sûr de supprimer ?'
    ),
    updateSuccess: await t('messages.updateSuccess', 'Mis à jour avec succès!'),
    updateError: await t(
     'messages.updateError',
     'Erreur lors de la mise à jour'
    ),
    createSuccess: await t('messages.createSuccess', 'Créé avec succès!'),
    createError: await t('messages.createError', 'Erreur lors de la création'),
    photoRequired: await t(
     'messages.photoRequired',
     'Veuillez ajouter au moins une photo!'
    ),
   });
  };

  loadTranslations();
 }, [t]);

 return translations;
};
