import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useGetProperty from '../../../hooks/useGetProperty';
import {
 Layout,
 Button,
 Spin,
 Row,
 Col,
 Form,
 Typography,
 Input,
 InputNumber,
 Checkbox,
 Divider,
 TimePicker,
 Upload,
 Image,
 Alert,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import MapMarker from '../../components/MapMarker';
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
const { Content } = Layout;
const { Title } = Typography;
const format = 'HH:mm';
const { TextArea } = Input;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const EditProperty = () => {
 const location = useLocation();
 const { id } = location.state;
 const { property, loading } = useGetProperty(id);
 const navigate = useNavigate();
 const { uploadPhotos, uploading } = useUploadPhotos();
 const { isLoading, updateProperty, Property, success, error } =
  useUpdateProperty();
 const [showAdditionalRules, setShowAdditionalRules] = useState(false);
 const [AdditionalRules, setAdditionalRules] = useState('');
 const [form] = Form.useForm();
 const [CheckInTime, setCheckInTime] = useState(
  form.getFieldValue('checkInTime')
 );
 const [CheckOutTime, setCheckOutTime] = useState(
  form.getFieldValue('checkOutTime')
 );
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);
 const [upload, setUpload] = useState(false);
 let formData;

 // Check if the photos property is a string
 if (typeof property.photos === 'string') {
  // Parse string representation of array to actual array
  property.photos = JSON.parse(property.photos);
 }
 // Check if property items are a string and parse them accordingly
 if (typeof property.basicAmenities === 'string') {
  property.basicAmenities = JSON.parse(property.basicAmenities);
 }
 if (typeof property.uncommonAmenities === 'string') {
  property.uncommonAmenities = JSON.parse(property.uncommonAmenities);
 }
 if (typeof property.safetyFeatures === 'string') {
  property.safetyFeatures = JSON.parse(property.safetyFeatures);
 }
 if (typeof property.elements === 'string') {
  property.elements = JSON.parse(property.elements);
 }
 if (typeof property.houseRules === 'string') {
  property.houseRules = JSON.parse(property.houseRules);
 }
 if (typeof property.earlyCheckIn === 'string') {
  property.earlyCheckIn = JSON.parse(property.earlyCheckIn);
 }
 if (typeof property.beforeCheckOut === 'string') {
  property.beforeCheckOut = JSON.parse(property.beforeCheckOut);
 }
 if (typeof property.accessToProperty === 'string') {
  property.accessToProperty = JSON.parse(property.accessToProperty);
 }
 if (typeof property.lateCheckOutPolicy === 'string') {
  property.lateCheckOutPolicy = JSON.parse(property.lateCheckOutPolicy);
 }

 useEffect(() => {
  if (!loading) {
   setFileList(
    property.photos.map((url, index) => ({
     uid: index,
     name: url.substring(url.lastIndexOf('/') + 1),
     status: 'done',
     url: url,
    }))
   );
  }
 }, [loading]);

 const goBack = () => {
  navigate(-1); // This will navigate back to the previous page
 };

 const onChangeCheckIn = (time) => {
  setCheckInTime(time);
 };
 const onChangeCheckOut = (time) => {
  setCheckOutTime(time);
 };
 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  file.error = false;
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
 };

 const handleChange = async ({ fileList: newFileList }) => {
  setFileList(newFileList);

  if (newFileList.length === 0) {
   setUpload(false);
  }

  // Upload files
  if (newFileList.length > fileList.length) {
   setUpload(true);
   // Simulate uploading
   setTimeout(() => {
    setUpload(false);
   }, 2000);
  }
 };

 const handleRemove = (file) => {
  const newFileList = fileList.filter((item) => item !== file);
  setFileList(newFileList);
 };
 const uploadButton = (
  <div>
   {upload ? (
    <div style={{ marginTop: 8 }}>Téléchargement en cours...</div>
   ) : (
    <button
     style={{
      border: 0,
      background: 'none',
     }}
     type="button"
    >
     <PlusOutlined />
     <div
      style={{
       marginTop: 8,
      }}
     >
      Ajouter des Photos
     </div>
    </button>
   )}
  </div>
 );

 const submitFormData = async () => {
  const formData = form.getFieldsValue();
  const {
   name,
   description,
   price,
   capacity,
   rooms,
   beds,
   basicAmenities,
   uncommonAmenities,
   safetyFeatures,
   elements,
   houseRules,
   earlyCheckIn,
   accessToProperty,
   guestAccessInfo,
   lateCheckOutPolicy,
   beforeCheckOut,
   additionalCheckOutInfo,
  } = formData;

  formData.latitude = property.latitude;
  formData.longitude = property.longitude;
  formData.placeName = property.placeName;

  formData.checkInTime = CheckInTime || property.checkInTime;
  formData.checkOutTime = CheckInTime || property.checkOutTime;
  formData.propertyManagerId = property.propertyManagerId;
  if (showAdditionalRules) {
   formData.houseRules.push(`additionalRules: ${AdditionalRules}`);
  }
  for (const key in formData) {
   if (formData.hasOwnProperty(key) && formData[key] === undefined) {
    formData[key] = null;
   }
  }
  const filesWithOriginFileObj = fileList.filter((file) => file.originFileObj);
  const newFileList = filesWithOriginFileObj.reduce((acc, file, index) => {
   acc[index] = file;
   return acc;
  }, []);

  const urlsArray = fileList
   .filter((file) => !file.originFileObj)
   .map((file) => file.url);
  try {
   const photoUrls = await uploadPhotos(newFileList);
   photoUrls.unshift(...urlsArray);
   formData.photos = photoUrls;

   await updateProperty(id, formData);
   /* console.log(Property, success, error, isLoading); */
  } catch (error) {
   console.error('Error updating property:', error);
  }
 };
 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container-fluid">
     <Button
      type="default"
      shape="round"
      icon={<ArrowLeftOutlined />}
      onClick={goBack}
     >
      Retour
     </Button>
     <Form
      name="editProperty"
      layout="vertical"
      onFinish={submitFormData}
      form={form}
      size="large"
      initialValues={{
       name: property.name,
       description: property.description,
       price: property.price,
       capacity: property.capacity,
       rooms: property.rooms,
       beds: property.beds,
       elements: property.elements,
       houseRules: property.houseRules,
       ['checkInTime']: dayjs()
        .hour(dayjs(property.checkInTime).hour())
        .minute(dayjs(property.checkInTime).minute()),
       earlyCheckIn: property.earlyCheckIn,
       accessToProperty: property.accessToProperty,
       guestAccessInfo: property.guestAccessInfo,
       ['checkOutTime']: dayjs()
        .hour(dayjs(property.checkOutTime).hour())
        .minute(dayjs(property.checkOutTime).minute()),
       beforeCheckOut: property.beforeCheckOut,
       additionalCheckOutInfo: property.additionalCheckOutInfo,
       basicAmenities: property.basicAmenities,
       uncommonAmenities: property.uncommonAmenities,
       safetyFeatures: property.safetyFeatures,
      }}
     >
      <Title level={3}>Modifier les informations de votre propriété</Title>
      <Row gutter={[32, 32]}>
       {/* Name Description & Map */}
       <Col xs={24} sm={12}>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Form.Item
           label="Nom"
           name="name"
           rules={[
            {
             required: true,
             message: 'Veuillez saisir votre nom!',
            },
           ]}
          >
           <Input />
          </Form.Item>
         </Col>

         <Col xs={24}>
          <Form.Item
           label="Description"
           name="description"
           rules={[
            {
             required: true,
             message: 'Veuillez saisir une description!',
            },
           ]}
          >
           <Input.TextArea />
          </Form.Item>
         </Col>

         <Col xs={24}>
          <MapMarker
           latitude={property.latitude}
           longitude={property.longitude}
          />
         </Col>
        </Row>
       </Col>
       {/* Manuel & Equipements */}
       <Col xs={24} sm={12}>
        <Row gutter={[24, 0]}>
         <Col xs={24} md={9}>
          <Form.Item label="Fixez votre prix" name="price">
           <InputNumber min={0} addonAfter="Dh" />
          </Form.Item>
         </Col>
         <Col xs={12} md={5}>
          <Form.Item label="Max Personnes" name="capacity">
           <InputNumber min={0} />
          </Form.Item>
         </Col>
         <Col xs={12} md={5}>
          <Form.Item label="Chambres" name="rooms">
           <InputNumber min={0} />
          </Form.Item>
         </Col>
         <Col xs={12} md={5}>
          <Form.Item label="Lits" name="beds">
           <InputNumber min={0} />
          </Form.Item>
         </Col>
         <Col xs={24} md={12}>
          <Col xs={24}>
           <Form.Item label="Commodités de base:" name="basicAmenities">
            <Checkbox.Group>
             <Row>
              <Col span={24}>
               <Checkbox value="wifi">Wifi</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="television">Télévision</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="kitchen">Cuisine</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="washingMachine">Lave-linge</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="freeParking">
                Parking gratuit sur place
               </Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="airConditioning">Climatisation</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="dedicatedWorkspace">
                Espace de travail dédié
               </Checkbox>
              </Col>
             </Row>
            </Checkbox.Group>
           </Form.Item>
          </Col>

          <Col xs={24}>
           <Form.Item
            label="Possédez-vous des équipements hors du commun?"
            name="uncommonAmenities"
           >
            <Checkbox.Group>
             <Row>
              <Col span={24}>
               <Checkbox value="pool">Piscine</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="outdoorDining">
                Espace repas en plein air
               </Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="fireplace">Cheminée</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="lakeAccess">Accès au lac</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="beachAccess">Accès à la plage</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="skiAccess">Accessible à skis</Checkbox>
              </Col>
             </Row>
            </Checkbox.Group>
           </Form.Item>
          </Col>

          <Col xs={24}>
           <Form.Item
            label="Possédez-vous ces équipements de sécurité?"
            name="safetyFeatures"
           >
            <Checkbox.Group>
             <Row>
              <Col span={24}>
               <Checkbox value="smokeDetector">Détecteur de fumée</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="firstAidKit">Kit de premiers secours</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="fireExtinguisher">Extincteur</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="carbonMonoxideDetector">
                Détecteur de monoxyde de carbone
               </Checkbox>
              </Col>
             </Row>
            </Checkbox.Group>
           </Form.Item>
          </Col>
         </Col>

         <Col xs={24} md={12}>
          <Col xs={24}>
           <Form.Item
            label="Votre logement possède-t-il ces éléments ?"
            name="elements"
           >
            <Checkbox.Group>
             <Row>
              <Col span={24}>
               <Checkbox value="cameras">
                Caméras de surveillance extérieures
               </Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="sonometers">Sonomètres</Checkbox>
              </Col>
             </Row>
            </Checkbox.Group>
           </Form.Item>
          </Col>

          <Col xs={24}>
           <Form.Item label="Règles de la maison:" name="houseRules">
            <Checkbox.Group>
             <Row>
              <Col span={24}>
               <Checkbox value="noNoise">Pas de bruit après 23h</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="noFoodDrinks">
                Pas de nourriture ni de boissons dans les chambres à coucher
               </Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="noParties">
                Pas de fêtes ni d'événements
               </Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="noSmoking">Défense de fumer</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="noPets">Pas d'animaux de compagnie</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox
                value="additionalRules"
                checked={showAdditionalRules}
                onChange={(e) => setShowAdditionalRules(e.target.checked)}
               >
                Règles supplémentaires
               </Checkbox>
              </Col>
             </Row>
            </Checkbox.Group>
           </Form.Item>
          </Col>
          {showAdditionalRules && (
           <Col xs={24} md={24}>
            <Form.Item label="Règles supplémentaires" value="AdditionalRules">
             <Input.TextArea
              rows={4}
              value={AdditionalRules}
              onChange={(e) => setAdditionalRules(e.target.value)}
             />
            </Form.Item>
           </Col>
          )}
         </Col>
        </Row>
       </Col>
       {/* Photos */}
       <Col xs={24}>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Divider orientation="left">
           <Title level={4}>Les photos de votre logement</Title>
          </Divider>
          <ImgCrop rotationSlider>
           <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
            disabled={upload}
           >
            {fileList.length >= 8 ? null : uploadButton}
           </Upload>
          </ImgCrop>
          {previewOpen && (
           <Image
            wrapperStyle={{
             display: 'none',
            }}
            preview={{
             visible: previewOpen,
             onVisibleChange: (visible) => setPreviewOpen(visible),
             afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
           />
          )}
         </Col>
         {fileList.length === 8 && (
          <Col xs={24}>
           <Alert
            message="Vous avez atteint le nombre maximum de photos."
            type="success"
           />
           <br />
          </Col>
         )}
        </Row>
       </Col>
       {/* Check In */}
       <Col xs={24} sm={12}>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Divider orientation="left">
           <h2 style={{ margin: 0 }}>Arrivée</h2>
          </Divider>
          <Form.Item
           label="Quand est l'heure la plus tôt à laquelle les invités peuvent s'enregistrer?"
           name="checkInTime"
          >
           <TimePicker
            format={format}
            showNow={false}
            size="large"
            onChange={onChangeCheckIn}
           />
          </Form.Item>
         </Col>

         <Col xs={24}>
          <Form.Item
           label="Sélectionnez les déclarations qui décrivent le mieux votre politique en matière de check-in anticipé."
           name="earlyCheckIn"
          >
           <Checkbox.Group>
            <Row>
             <Col span={24}>
              <Checkbox value="heureNonFlexible">
               Malheureusement l'heure d'arrivée n'est pas flexible.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="ajustementHeure">
               À l'occasion il est possible d'ajuster votre heure d'arrivée si
               vous nous contactez.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="autreHeureArrivee">
               Lorsque que cela est possible, nous pouvons vous arranger en vous
               proposant une autre heure d’arrivée qui vous conviendrait mieux.
               Contactez nous à l’avance si vous souhaitez modifier votre heure
               d’arrivée.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="laissezBagages">
               Vous pouvez laissez vos bagages pendant la journée.
              </Checkbox>
             </Col>
            </Row>
           </Checkbox.Group>
          </Form.Item>
         </Col>

         <Col xs={24}>
          <Form.Item
           label="Sélectionnez les déclarations qui décrivent le mieux la manière dont vos invités accéderont à la propriété."
           name="accessToProperty"
          >
           <Checkbox.Group>
            <Row>
             <Col span={24}>
              <Checkbox value="cleDansBoite">
               La clé de la maison se trouve dans la boîte à clé
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="acceuilContactezMoi">
               On sera là pour vous accueillir, sinon, contactez moi quand vous
               arrivez.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="codesAccesCourriel">
               Nous vous enverrons vos codes d’accès par courriel avant votre
               arrivée.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="verifiezCourriel">
               Vérifiez votre courriel pour les instructions relatives à votre
               arrivée.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="serrureNumero">
               Nous avons une serrure à numéro.
              </Checkbox>
             </Col>
            </Row>
           </Checkbox.Group>
          </Form.Item>
         </Col>

         <Col xs={24}>
          <Form.Item
           label="Quelles informations vos invités doivent-ils connaître pour accéder à la propriété ?"
           name="guestAccessInfo"
          >
           <TextArea />
          </Form.Item>
         </Col>
        </Row>
       </Col>
       {/* Check Out */}
       <Col xs={24} sm={12}>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Divider orientation="left">
           <h2 style={{ margin: 0 }}>Départ</h2>
          </Divider>
          <Form.Item
           label="À quelle heure voulez-vous demander aux invités de quitter les lieux ?"
           name="checkOutTime"
          >
           <TimePicker
            format={format}
            showNow={false}
            size="large"
            onChange={onChangeCheckOut}
           />
          </Form.Item>
         </Col>

         <Col xs={24}>
          <Form.Item
           label="Sélectionnez les déclarations qui décrivent le mieux votre politique de départ tardif :"
           name="lateCheckOutPolicy"
          >
           <Checkbox.Group>
            <Row>
             <Col span={24}>
              <Checkbox value="heureNonFlexible">
               Malheureusement l'heure de départ n'est pas flexible.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="heureDepartAlternative">
               Lorsque l'horaire le permet, il nous fait plaisir d'accommoder
               une heure de départ alternative. Contactez-nous à l'avance si
               vous souhaitez prendre un arrangement à cet effet.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="contactezNous">
               Communiquez avec nous si vous aimeriez quitter plus tard.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="optionDepartTardif">
               Montrer l’option du départ tardif (si ce n’est pas coché on ne va
               pas le mentionner)
              </Checkbox>
             </Col>
            </Row>
           </Checkbox.Group>
          </Form.Item>
         </Col>

         <Col xs={24}>
          <Form.Item
           label="Que doivent faire les invités avant de partir ?"
           name="beforeCheckOut"
          >
           <Checkbox.Group>
            <Row>
             <Col span={24}>
              <Checkbox value="laissezBagages">
               Vous pouvez laissez vos bagages dans la propriété après l’heure
               du départ.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="signezLivreOr">
               S’il vous plait, signez notre livre d’or avant de partir.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="litsNonFaits">
               Laissez les lits que vous avez utilisés défaits.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="laverVaisselle">
               Merci de laver et ranger vaisselle et plats utilisés.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="vaisselleLaveVaisselle">
               Mettez la vaisselle de dernière minute dans le lave-vaisselle.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="eteindreAppareilsElectriques">
               Merci de vous assurer que vous avez bien éteint la cuisinière,
               lumières et autres appareils électriques.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="replacezMeubles">
               Replacez les meubles à leur endroit original.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="deposePoubelles">
               Merci de déposer poubelles et déchets dans les containers
               appropriés.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="serviettesDansBaignoire">
               Mettez vos serviettes utilisées dans la baignoire.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="serviettesParTerre">
               Laissez les serviettes utilisées par terre.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="porteNonVerrouillee">
               Laissez la porte déverrouillée.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="portesVerrouillees">
               Assurez-vous que les portes sont verrouillées.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="laissezCleMaison">
               Laissez la clé dans la maison.
              </Checkbox>
             </Col>
             <Col span={24}>
              <Checkbox value="laissezCleBoiteCle">
               Laissez la clé dans la boîte à clef.
              </Checkbox>
             </Col>
            </Row>
           </Checkbox.Group>
          </Form.Item>
         </Col>

         <Col sm={24}>
          <Form.Item
           label="Informations supplémentaires sur le départ :"
           name="additionalCheckOutInfo"
          >
           <TextArea />
          </Form.Item>
         </Col>
        </Row>
       </Col>
      </Row>
      <Row>
       <Col xs={24} md={24}>
        <Form.Item>
         <Button
          type="primary"
          shape="square"
          htmlType="submit"
          style={{ width: '100%' }}
         >
          Enregistrer
         </Button>
        </Form.Item>
       </Col>
      </Row>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditProperty;
