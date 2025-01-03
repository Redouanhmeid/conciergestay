import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/TranslationContext';

const useAmenityTranslations = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({
  back: '',
  addCard: '',
  upload: '',
  save: '',
  mediaUrl: '',
  videoUrlLabel: '',
  videoUrlHint: '',
  guestMessage: '',
  wifiName: '',
  wifiPassword: '',
  photo: '',
  video: '',
  // Edit specific
  confirmDelete: '',
  confirmYes: '',
  confirmNo: '',
  deleteSuccess: '',
  deleteError: '',
  // Success/Error messages
  amenityCreateSuccess: '',
  amenityCreateError: '',
 });

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    back: await t('common.back', 'Retour'),
    addCard: await t('amenity.addCard', 'Ajouter une carte pour'),
    upload: await t('common.upload', 'Charger'),
    save: await t('common.save', 'Enregistrer'),
    mediaUrl: await t('amenity.mediaUrl', 'Media URL'),
    videoUrlLabel: await t('amenity.videoUrlLabel', 'Video URL:'),
    videoUrlHint: await t(
     'amenity.videoUrlHint',
     'Hébergez vos vidéos sur Vimeo ou Youtube avant'
    ),
    guestMessage: await t(
     'amenity.guestMessage',
     'Que souhaitez-vous dire à vos invités sur ce sujet ?'
    ),
    wifiName: await t('amenity.wifiName', 'Nom du Wi-Fi'),
    wifiPassword: await t('amenity.wifiPassword', 'Mot de passe Wi-Fi'),
    photo: await t('common.photo', 'Photo'),
    video: await t('common.video', 'Video'),
    // Edit specific
    confirmDelete: await t(
     'amenity.confirmDelete',
     'Etes-vous sûr de supprimer ?'
    ),
    confirmYes: await t('amenity.confirmYes', 'Oui'),
    confirmNo: await t('amenity.confirmNo', 'Non'),
    deleteSuccess: await t(
     'amenity.deleteSuccess',
     'Equipement supprimé avec succès.'
    ),
    deleteError: await t(
     'amenity.deleteError',
     "Erreur lors de la suppression de l'équipement:"
    ),
    // Success/Error messages
    amenityCreateSuccess: await t(
     'amenity.createSuccess',
     'Equipement créé avec succès'
    ),
    amenityCreateError: await t(
     'amenity.createError',
     "Échec de la création de l'équipement"
    ),
   });
  }
  loadTranslations();
 }, [t]);

 return translations;
};

export default useAmenityTranslations;
