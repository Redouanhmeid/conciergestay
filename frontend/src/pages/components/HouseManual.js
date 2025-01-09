import React, { useMemo } from 'react';
import { Row, Col, Divider, Card, Typography, Image, Grid } from 'antd';
import ReactPlayer from 'react-player';
import { useTranslation } from '../../context/TranslationContext';

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

const AmenityCard = React.memo(
 ({ amenity, description, media, wifiName, wifiPassword, shouldBeFullRow }) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const amenityTitles = {
   shower: t('amenity.shower'),
   jacuzzi: t('amenity.jacuzzi'),
   bathtub: t('amenity.bathtub'),
   washingMachine: t('amenity.washingMachine'),
   dryerheat: t('amenity.dryerheat'),
   vacuum: t('amenity.vacuum'),
   vault: t('amenity.vault'),
   babybed: t('amenity.babybed'),
   television: t('amenity.television'),
   speaker: t('amenity.speaker'),
   gameconsole: t('amenity.gameconsole'),
   oven: t('amenity.oven'),
   microwave: t('amenity.microwave'),
   coffeemaker: t('amenity.coffeemaker'),
   fridge: t('amenity.fridge'),
   fireburner: t('amenity.fireburner'),
   heating: t('amenity.heating'),
   airConditioning: t('amenity.airConditioning'),
   fireplace: t('amenity.fireplace'),
   ceilingfan: t('amenity.ceilingfan'),
   tablefan: t('amenity.tablefan'),
   fingerprint: t('amenity.fingerprint'),
   lockbox: t('amenity.lockbox'),
   parkingaccess: t('amenity.parkingaccess'),
   wifi: t('amenity.wifi'),
   dedicatedworkspace: t('amenity.dedicatedworkspace'),
   freeParking: t('amenity.freeParking'),
   paidParking: t('amenity.paidParking'),
   pool: t('amenity.pool'),
   garbageCan: t('amenity.garbageCan'),
  };

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
       height={screens.xs ? 240 : 220}
      />
     ) : (
      <Image
       src={media}
       height={screens.xs ? 240 : 220}
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
      <>
       {amenity === 'wifi' && (
        <>
         <br />
         <Paragraph>
          <Text strong>{t('amenity.wifiName')}: </Text>
          {wifiName}
         </Paragraph>
         <Paragraph>
          <Text strong>{t('amenity.wifiPassword')}: </Text>
          <Text copyable>{wifiPassword}</Text>
         </Paragraph>
        </>
       )}
       <Paragraph
        ellipsis={{
         rows: 4,
         expandable: true,
         symbol: t('button.readMore'),
        }}
       >
        {description}
       </Paragraph>
      </>
     }
    />
   </Card>
  );
 }
);

const HouseManual = React.memo(({ amenities }) => {
 const { t } = useTranslation();
 const amenityCategories = {
  [t('amenity.categories.bathroom')]: ['shower', 'jacuzzi', 'bathtub'],
  [t('amenity.categories.bedroomLinen')]: [
   'washingMachine',
   'dryerheat',
   'vacuum',
   'vault',
   'babybed',
  ],
  [t('amenity.categories.entertainment')]: [
   'television',
   'speaker',
   'gameconsole',
  ],
  [t('amenity.categories.kitchenDiningRoom')]: [
   'oven',
   'microwave',
   'coffeemaker',
   'fridge',
   'fireburner',
  ],
  [t('amenity.categories.heatingCooling')]: [
   'heating',
   'airConditioning',
   'fireplace',
   'ceilingfan',
   'tablefan',
  ],
  [t('amenity.categories.homeSecurity')]: [
   'fingerprint',
   'lockbox',
   'parkingaccess',
  ],
  [t('amenity.categories.internetOffice')]: ['wifi', 'dedicatedworkspace'],
  [t('amenity.categories.parkingFacilities')]: [
   'freeParking',
   'paidParking',
   'pool',
   'garbageCan',
  ],
 };

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
      {categoryAmenities.map((amenity, index) => {
       return (
        <Col key={amenity} xs={24} md={12}>
         <AmenityCard
          amenity={amenity}
          description={amenities[amenity].description}
          media={amenities[amenity].media}
          wifiName={amenities[amenity].wifiName}
          wifiPassword={amenities[amenity].wifiPassword}
         />
        </Col>
       );
      })}
     </Row>
    </Col>
   ))}
  </Row>
 );
});

export default HouseManual;
