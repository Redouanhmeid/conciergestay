import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import useGetProperty from '../../../hooks/useGetProperty';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
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
import ReactPlayer from 'react-player';

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
 const { id } = queryString.parse(location.search);
 const { property, loading } = useGetProperty(id);
 const navigate = useNavigate();
 const { uploadPhotos, uploadFrontPhoto } = useUploadPhotos();
 const { updateProperty } = useUpdateProperty();
 const [showAdditionalRules, setShowAdditionalRules] = useState(false);
 const [additionalRules, setAdditionalRules] = useState('');
 const [form] = Form.useForm();
 const [checkInTime, setCheckInTime] = useState(dayjs());
 const [checkOutTime, setCheckOutTime] = useState(dayjs());
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);
 const [uploading, setUploading] = useState(false);
 const [successMessage, setSuccessMessage] = useState('');
 const [errorMessage, setErrorMessage] = useState('');
 const [videoURL, setVideoURL] = useState('');

 const [fileList2, setFileList2] = useState([]);
 const [previewImage2, setPreviewImage2] = useState('');
 const [previewOpen2, setPreviewOpen2] = useState(false);

 const parseJSONFields = (property) => {
  const fields = [
   'photos',
   'basicAmenities',
   'safetyFeatures',
   'elements',
   'houseRules',
   'earlyCheckIn',
   'beforeCheckOut',
   'accessToProperty',
   'lateCheckOutPolicy',
  ];
  fields.forEach((field) => {
   if (typeof property[field] === 'string') {
    property[field] = JSON.parse(property[field]);
   }
  });
 };

 useEffect(() => {
  if (!loading && property) {
   parseJSONFields(property);
   form.setFieldsValue({
    ...property,
    checkInTime: dayjs(property.checkInTime),
    checkOutTime: dayjs(property.checkOutTime),
   });
   setFileList(
    property.photos.map((url, index) => ({
     uid: index,
     name: url.substring(url.lastIndexOf('/') + 1),
     status: 'done',
     url: url,
    }))
   );
   setFileList2([
    {
     uid: 1,
     name: property.frontPhoto,
     status: 'done',
     url: property.frontPhoto,
    },
   ]);
   setVideoURL(property.videoCheckIn || ''); // Initialize video URL state
  }
 }, [loading, property]);

 const goBack = () => {
  navigate(-1); // This will navigate back to the previous page
 };

 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
 };

 const handleChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
  setUploading(newFileList.some((file) => file.status === 'uploading'));
 };

 const handleRemove = (file) => {
  setFileList(fileList.filter((item) => item.uid !== file.uid));
 };

 const handlePreview2 = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage2(file.url || file.preview);
  setPreviewOpen2(true);
 };
 const handleChange2 = ({ fileList }) => {
  setFileList2(fileList);
 };
 const uploadButton = (
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
    Charger
   </div>
  </button>
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

  formData.checkInTime =
   checkInTime.format('YYYY-MM-DD HH:mm:ss') || property.checkInTime;
  formData.checkOutTime =
   checkOutTime.format('YYYY-MM-DD HH:mm:ss') || property.checkOutTime;
  formData.propertyManagerId = property.propertyManagerId;
  if (showAdditionalRules) {
   formData.houseRules.push(`additionalRules: ${additionalRules}`);
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
  const filesWithOriginFileObj2 = fileList2.filter(
   (file) => file.originFileObj
  );
  const newFileList2 = filesWithOriginFileObj2.reduce((acc, file, index) => {
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
   const frontPhoto = await uploadFrontPhoto(newFileList2);
   formData.frontPhoto = frontPhoto;
   await updateProperty(id, formData);
   setSuccessMessage('Property updated successfully');
   setErrorMessage('');
   setTimeout(() => {
    navigate(`/propertydetails?id=${id}`);
   }, 2000);
  } catch (error) {
   console.error('Error updating property:', error);
   setErrorMessage('Failed to update property');
   setSuccessMessage('');
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
     >
      <Title level={3}>Modifier les informations de votre propriété</Title>
      <Row gutter={[32, 32]}>
       <Col xs={24} sm={12}>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Form.Item
           label="Nom"
           name="name"
           rules={[{ required: true, message: 'Veuillez saisir votre nom!' }]}
          >
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24}>
          <Form.Item
           label="Description"
           name="description"
           rules={[
            { required: true, message: 'Veuillez saisir une description!' },
           ]}
          >
           <TextArea />
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
               <Checkbox value="pool">Piscine</Checkbox>
              </Col>
              <Col span={24}>
               <Checkbox value="garbageCan">Benne à ordures</Checkbox>
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
               <Checkbox value="noUnmarriedCouple">
                Pas de couple non marié
               </Checkbox>
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
             <TextArea
              rows={4}
              value={additionalRules}
              onChange={(e) => setAdditionalRules(e.target.value)}
             />
            </Form.Item>
           </Col>
          )}
         </Col>
        </Row>
       </Col>
       <Col xs={24}>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Divider orientation="left">
           <Title level={4}>Les photos de votre logement</Title>
          </Divider>
          <ImgCrop aspect={640 / 426} rotationSlider>
           <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
            disabled={uploading}
           >
            {fileList.length >= 8 ? null : (
             <div>
              {uploading ? (
               <div style={{ marginTop: 8 }}>Téléchargement en cours...</div>
              ) : (
               <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Ajouter des Photos</div>
               </button>
              )}
             </div>
            )}
           </Upload>
          </ImgCrop>
          {previewOpen && (
           <Image
            wrapperStyle={{ display: 'none' }}
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
            onChange={setCheckInTime}
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

         {/* Fron image Input */}
         <Col xs={24} md={24}>
          <Form.Item
           label="Photo de la façade de la résidence ou de la maison."
           name="frontPhoto"
          >
           <div>
            <ImgCrop rotationSlider>
             <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList2}
              onPreview={handlePreview2}
              onChange={handleChange2}
             >
              {fileList2.length >= 1 ? null : uploadButton}
             </Upload>
            </ImgCrop>
            {previewImage2 && (
             <Image
              style={{
               width: '100%',
               height: '100%',
               objectFit: 'cover',
              }}
              wrapperStyle={{
               display: 'none',
              }}
              preview={{
               visible: previewOpen2,
               onVisibleChange: (visible) => setPreviewOpen2(visible),
               afterOpenChange: (visible) => !visible && setPreviewImage2(''),
              }}
              src={previewImage2}
             />
            )}
           </div>
          </Form.Item>
         </Col>

         {/* Video URL Input */}
         <Col xs={24}>
          <Form.Item label="Lien vidéo pour les instructions d'enregistrement">
           <Input
            placeholder={
             !property.videoCheckIn
              ? "Entrez l'URL de la vidéo (Hébergez vos vidéos sur Vimeo ou Youtube avant)"
              : ''
            }
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)} // Handle change
           />
          </Form.Item>

          {/* Show the video if videoURL exists */}
          {videoURL && (
           <div style={{ marginTop: '16px' }}>
            <ReactPlayer url={videoURL} controls={true} width="100%" />
           </div>
          )}
         </Col>
        </Row>
       </Col>
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
            onChange={setCheckOutTime}
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
        {successMessage && (
         <Alert message={successMessage} type="success" showIcon closable />
        )}
        {errorMessage && (
         <Alert message={errorMessage} type="error" showIcon closable />
        )}
       </Col>
      </Row>
      <br />
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
