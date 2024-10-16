import React, { useMemo } from 'react';
import { Row, Col, Divider, Card, Typography, Image, Grid } from 'antd';
import ReactPlayer from 'react-player';

const { Text, Paragraph } = Typography;
const { Meta } = Card;
const { useBreakpoint } = Grid;

const amenityIcons = {
 shower: <i className="fa-light fa-shower fa-xl" />,
 jacuzzi: <i className="fa-light fa-hot-tub-person fa-xl" />,
 bathtub: <i className="fa-light fa-bath fa-xl" />,
 washingMachine: <i className="fa-light fa-washing-machine fa-xl" />,
 dryerheat: <i className="fa-light fa-dryer-heat fa-xl" />,
 vacuum: <i className="fa-light fa-vacuum fa-xl" />,
 vault: <i className="fa-light fa-vault fa-xl" />,
 babybed: <i className="fa-light fa-baby fa-xl" />,
 television: <i className="fa-light fa-tv fa-xl" />,
 speaker: <i className="fa-light fa-speaker fa-xl" />,
 gameconsole: <i className="fa-light fa-gamepad-modern fa-xl" />,
 oven: <i className="fa-light fa-oven fa-xl" />,
 microwave: <i className="fa-light fa-microwave fa-xl" />,
 coffeemaker: <i className="fa-light fa-coffee-pot fa-xl" />,
 fridge: <i className="fa-light fa-refrigerator fa-xl" />,
 fireburner: <i className="fa-light fa-fire-burner fa-xl" />,
 heating: <i className="fa-light fa-temperature-arrow-up fa-xl" />,
 airConditioning: <i className="fa-light fa-snowflake fa-xl" />,
 fireplace: <i className="fa-light fa-fireplace fa-xl" />,
 ceilingfan: <i className="fa-light fa-fan fa-xl" />,
 tablefan: <i className="fa-light fa-fan-table fa-xl" />,
 fingerprint: <i className="fa-light fa-fingerprint fa-xl" />,
 lockbox: <i className="fa-light fa-lock-hashtag fa-xl" />,
 parkingaccess: <i className="fa-light fa-square-parking fa-xl" />,
 wifi: <i className="fa-light fa-wifi fa-xl" />,
 dedicatedworkspace: <i className="fa-light fa-chair-office fa-xl" />,
 freeParking: <i className="fa-light fa-circle-parking fa-xl" />,
 paidParking: <i className="fa-light fa-square-parking fa-xl" />,
 pool: <i className="fa-light fa-water-ladder fa-xl" />,
 garbageCan: <i className="fa-light fa-trash-can fa-xl" />,
};

const amenityTitles = {
 shower: 'Douche',
 jacuzzi: 'Jacuzzi',
 bathtub: 'Baignoire',
 washingMachine: 'Machine à laver',
 dryerheat: 'Sèche-linge',
 vacuum: 'Aspirateur',
 vault: 'Coffre-fort',
 babybed: 'Lit bébé',
 television: 'Télévision',
 speaker: 'Système audio',
 gameconsole: 'Console de jeux',
 oven: 'Four',
 microwave: 'Micro-ondes',
 coffeemaker: 'Cafétière',
 fridge: 'Réfrigérateur',
 fireburner: 'Cuisinière',
 heating: 'Chauffage',
 airConditioning: 'Climatisation',
 fireplace: 'Cheminée',
 ceilingfan: 'Ventilateur de plafond',
 tablefan: 'Ventilateur de table',
 fingerprint: 'Serrure biometrique à empreinte digitale',
 lockbox: 'Boite à serrure',
 parkingaccess: 'Accès parking',
 wifi: 'Wifi',
 dedicatedworkspace: 'Espace dédié de travail',
 freeParking: 'Parking gratuit',
 paidParking: 'Stationnement payant',
 pool: 'Piscine',
 garbageCan: 'Benne à ordures',
};

const amenityCategories = {
 'Salle de bain': ['shower', 'jacuzzi', 'bathtub'],
 'Chambre et linge': [
  'washingMachine',
  'dryerheat',
  'vacuum',
  'vault',
  'babybed',
 ],
 Divertissement: ['television', 'speaker', 'gameconsole'],
 'Cuisine et salle à manger': [
  'oven',
  'microwave',
  'coffeemaker',
  'fridge',
  'fireburner',
 ],
 'Chauffage et climatisation': [
  'heating',
  'airConditioning',
  'fireplace',
  'ceilingfan',
  'tablefan',
 ],
 'Sécurité à la maison': ['fingerprint', 'lockbox', 'parkingaccess'],
 'Internet et bureau': ['wifi', 'dedicatedworkspace'],
 'Parking et installations': [
  'freeParking',
  'paidParking',
  'pool',
  'garbageCan',
 ],
};

const AmenityCard = React.memo(({ amenity, description, media }) => {
 const screens = useBreakpoint();
 return (
  <Card
   hoverable={false}
   style={{ width: '100%' }}
   cover={
    ReactPlayer.canPlay(media) ? (
     <ReactPlayer
      url={media}
      controls
      width="100%"
      height={screens.xs ? 160 : 220}
     />
    ) : (
     <Image
      src={media}
      height={screens.xs ? 160 : 220}
      style={{ objectFit: 'cover' }}
     />
    )
   }
  >
   <Meta
    title={
     <>
      {amenityIcons[amenity]}
      <Text strong> {amenityTitles[amenity]}</Text>
     </>
    }
    description={
     <Paragraph
      ellipsis={{
       rows: 4,
       expandable: true,
       symbol: 'lire plus',
      }}
     >
      {description}
     </Paragraph>
    }
   />
  </Card>
 );
});

const HouseManual = React.memo(({ amenities }) => {
 const availableAmenities = useMemo(() => {
  return Object.entries(amenityCategories).reduce(
   (acc, [category, categoryAmenities]) => {
    const available = categoryAmenities.filter((amenity) => amenities[amenity]);
    if (available.length > 0) {
     acc[category] = available;
    }
    return acc;
   },
   {}
  );
 }, [amenities]);
 return (
  <Row gutter={[16, 16]}>
   {Object.entries(availableAmenities).map(([category, categoryAmenities]) => (
    <Col key={category} xs={24} md={12}>
     <Divider orientation="left">
      <Text strong>{category}</Text>
     </Divider>
     <Row gutter={[16, 16]}>
      {categoryAmenities.map((amenity) => (
       <Col key={amenity} xs={12}>
        <AmenityCard
         amenity={amenity}
         description={amenities[amenity].description}
         media={amenities[amenity].media}
        />
       </Col>
      ))}
     </Row>
    </Col>
   ))}
  </Row>
 );
});

export default HouseManual;
