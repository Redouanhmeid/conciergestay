import { useEffect, useState } from 'react';
import { useTranslation } from '../../context/TranslationContext';

export const useEquipementsTranslation = () => {
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({
  bathroom: '',
  bedroomLinen: '',
  entertainment: '',
  kitchen: '',
  heatingCooling: '',
  homeSecurity: '',
  internetOffice: '',
  parkingFacilities: '',
  amenities: {
   shower: '',
   jacuzzi: '',
   bathtub: '',
   washingMachine: '',
   dryerheat: '',
   vacuum: '',
   vault: '',
   babybed: '',
   television: '',
   speaker: '',
   gameconsole: '',
   oven: '',
   microwave: '',
   coffeemaker: '',
   fridge: '',
   fireburner: '',
   heating: '',
   airConditioning: '',
   fireplace: '',
   ceilingfan: '',
   tablefan: '',
   fingerprint: '',
   lockbox: '',
   parkingaccess: '',
   wifi: '',
   dedicatedworkspace: '',
   freeParking: '',
   paidParking: '',
   pool: '',
   garbageCan: '',
  },
 });

 useEffect(() => {
  async function loadTranslations() {
   const categoryTranslations = {
    bathroom: await t('amenity.categories.bathroom', 'Salle de bain'),
    bedroomLinen: await t(
     'amenity.categories.bedroomLinen',
     'Chambre et linge'
    ),
    entertainment: await t(
     'amenity.categories.entertainment',
     'Divertissement'
    ),
    kitchen: await t('amenity.categories.kitchen', 'Cuisine'),
    heatingCooling: await t(
     'amenity.categories.heatingCooling',
     'Chauffage et climatisation'
    ),
    homeSecurity: await t(
     'amenity.categories.homeSecurity',
     'Sécurité à la maison'
    ),
    internetOffice: await t(
     'amenity.categories.internetOffice',
     'Internet et bureau'
    ),
    parkingFacilities: await t(
     'amenity.categories.parkingFacilities',
     'Parking et installations'
    ),
   };

   const equipementTranslations = {
    shower: await t('amenity.shower', 'Douche'),
    jacuzzi: await t('amenity.jacuzzi', 'Jacuzzi'),
    bathtub: await t('amenity.bathtub', 'Baignoire'),
    washingMachine: await t('amenity.washingMachine', 'Machine à laver'),
    dryerheat: await t('amenity.dryerheat', 'Sèche-linge'),
    vacuum: await t('amenity.vacuum', 'Aspirateur'),
    vault: await t('amenity.vault', 'Coffre-fort'),
    babybed: await t('amenity.babybed', 'Lit bébé'),
    television: await t('amenity.television', 'Télévision'),
    speaker: await t('amenity.speaker', 'Système audio'),
    gameconsole: await t('amenity.gameconsole', 'Console de jeux'),
    oven: await t('amenity.oven', 'Four'),
    microwave: await t('amenity.microwave', 'Micro-ondes'),
    coffeemaker: await t('amenity.coffeemaker', 'Cafétière'),
    fridge: await t('amenity.fridge', 'Réfrigérateur'),
    fireburner: await t('amenity.fireburner', 'Cuisinière'),
    heating: await t('amenity.heating', 'Chauffage'),
    airConditioning: await t('amenity.airConditioning', 'Climatisation'),
    fireplace: await t('amenity.fireplace', 'Cheminée'),
    ceilingfan: await t('amenity.ceilingfan', 'Ventilateur de plafond'),
    tablefan: await t('amenity.tablefan', 'Ventilateur de table'),
    fingerprint: await t(
     'amenity.fingerprint',
     'Serrure biometrique à empreinte digitale'
    ),
    lockbox: await t('amenity.lockbox', 'Boite à serrure'),
    parkingaccess: await t('amenity.parkingaccess', 'Accès parking'),
    wifi: await t('amenity.wifi', 'Wifi'),
    dedicatedworkspace: await t(
     'amenity.dedicatedworkspace',
     'Espace dédié de travail'
    ),
    freeParking: await t('amenity.freeParking', 'Parking gratuit'),
    paidParking: await t('amenity.paidParking', 'Stationnement payant'),
    pool: await t('amenity.pool', 'Piscine'),
    garbageCan: await t('amenity.garbageCan', 'Benne à ordures'),
   };

   setTranslations({
    ...categoryTranslations,
    amenities: amenityTranslations,
   });
  }
  loadTranslations();
 }, [t]);

 return translations;
};
