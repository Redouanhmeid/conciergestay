import React, { useState, useCallback } from 'react';
import {
 Layout,
 Form,
 Divider,
 Row,
 Col,
 Checkbox,
 Input,
 Button,
 TimePicker,
 Upload,
 Image,
 Spin,
 message,
} from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import {
 ArrowLeftOutlined,
 ArrowRightOutlined,
 PlusOutlined,
} from '@ant-design/icons';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import useUpdatePropertyCheckIn from '../../../hooks/useUpdateProperty';
import useUpdatePropertyCheckOut from '../../../hooks/useUpdateProperty';
import useUploadPhotos from '../../../hooks/useUploadPhotos';

const { Content } = Layout;
const { TextArea } = Input;
const format = 'HH:mm';

// Default check-in/out times that make more business sense
const DEFAULT_CHECK_IN_TIME = dayjs().hour(11).minute(0); // 11:00 AM
const DEFAULT_CHECK_OUT_TIME = dayjs().hour(12).minute(0); // 12:00 AM

const TimePickerWithDefault = ({
 value,
 onChange,
 name,
 label,
 isCheckIn = true,
}) => {
 // Internal state to track if user has made a selection
 const [hasUserSelected, setHasUserSelected] = useState(
  value && value.format('HH:mm') !== '00:00'
 );

 const handleTimeChange = (time) => {
  setHasUserSelected(true);
  onChange?.(time);
 };

 const handleClear = () => {
  setHasUserSelected(false);
  // When cleared, reset to the appropriate default time
  onChange?.(isCheckIn ? DEFAULT_CHECK_IN_TIME : DEFAULT_CHECK_OUT_TIME);
 };

 return (
  <Form.Item
   label={label}
   name={name}
   help={
    !hasUserSelected
     ? `Heure par défaut: ${isCheckIn ? '11:00' : '12:00'}`
     : undefined
   }
  >
   <TimePicker
    format="HH:mm"
    showNow={false}
    size="large"
    onChange={handleTimeChange}
    onClear={handleClear}
    allowClear={false}
    value={value}
    placeholder={
     isCheckIn
      ? "Sélectionnez l'heure d'arrivée"
      : "Sélectionnez l'heure de départ"
    }
   />
  </Form.Item>
 );
};

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const Step2CheckInOut = ({ next, values }) => {
 const {
  updatePropertyCheckIn,
  isLoading: checkInLoading,
  success: checkInSuccess,
  error: checkInError,
 } = useUpdatePropertyCheckIn(values.propertyId);
 const {
  updatePropertyCheckOut,
  isLoading: checkOutLoading,
  success: checkOutSuccess,
  error: checkOutError,
 } = useUpdatePropertyCheckOut(values.propertyId);

 const [form] = Form.useForm();
 const { uploadFrontPhoto } = useUploadPhotos();
 const [loading, setLoading] = useState(false);

 const [CheckInTime, setCheckInTime] = useState(
  values.checkInTime || DEFAULT_CHECK_IN_TIME
 );
 const [CheckOutTime, setCheckOutTime] = useState(
  values.checkOutTime || DEFAULT_CHECK_OUT_TIME
 );
 const [EarlyCheckIn, setEarlyCheckIn] = useState(values.earlyCheckIn || []);
 const [AccessToProperty, setAccessToProperty] = useState(
  values.accessToProperty || []
 );

 const [LateCheckOutPolicy, setLateCheckOutPolicy] = useState(
  values.lateCheckOutPolicy || []
 );
 const [BeforeCheckOut, setBeforeCheckOut] = useState(
  values.beforeCheckOut || []
 );

 const [GuestAccessInfo, setGuestAccessInfo] = useState(
  values.guestAccessInfo || ''
 );
 const [VideoCheckIn, setVideoCheckIn] = useState(values.videoCheckIn || '');
 const [AdditionalCheckOutInfo, setAdditionalCheckOutInfo] = useState(
  values.additionalCheckOutInfo || ''
 );
 const [frontPhoto, setFrontPhoto] = useState(values.frontPhoto || '');

 const submitFormData = async () => {
  try {
   setLoading(true); // Start loading
   // Prepare check-in data
   const checkInData = {
    checkInTime: CheckInTime || dayjs().hour(12).minute(0),
    earlyCheckIn: EarlyCheckIn,
    accessToProperty: AccessToProperty,
    guestAccessInfo: GuestAccessInfo,
    videoCheckIn: VideoCheckIn,
    frontPhoto: '',
   };
   // Handle front photo upload if it exists
   if (
    typeof frontPhoto === 'string' &&
    frontPhoto.startsWith('/frontphotos')
   ) {
    checkInData.frontPhoto = frontPhoto; // Keep the existing URL if already uploaded
   } else if (frontPhoto.length > 0) {
    const photoUrl = await uploadFrontPhoto(frontPhoto);
    checkInData.frontPhoto = photoUrl;
   }
   // Prepare check-out data
   const checkOutData = {
    checkOutTime: CheckOutTime || dayjs().hour(12).minute(0),
    lateCheckOutPolicy: LateCheckOutPolicy,
    beforeCheckOut: BeforeCheckOut,
    additionalCheckOutInfo: AdditionalCheckOutInfo,
   };

   let hasErrors = false;
   try {
    await updatePropertyCheckIn(checkInData);
    await updatePropertyCheckOut(checkOutData);
   } catch (error) {
    hasErrors = true;
    message.error('Une erreur est survenue');
   }

   if (!hasErrors) {
    next();
    // Update values object with all the new data
    Object.assign(values, { ...checkInData, ...checkOutData });
   }
  } catch (error) {
   console.error('Error submitting form:', error);
   message.error(error.message || 'Impossible de mettre');
  } finally {
   setLoading(false); // End loading
  }
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Spin
      spinning={loading || checkInLoading || checkOutLoading}
      tip="Soumission en cours..."
     >
      <Form
       name="step2"
       layout="vertical"
       onFinish={submitFormData}
       size="large"
       form={form}
       initialValues={{
        checkInTime: values.checkInTime || dayjs().hour(0).minute(0),
        checkOutTime: values.checkOutTime || dayjs().hour(0).minute(0),
        earlyCheckIn: values.earlyCheckIn || [],
        lateCheckOutPolicy: values.lateCheckOutPolicy || [],
        accessToProperty: values.accessToProperty || [],
        beforeCheckOut: values.beforeCheckOut || [],
        guestAccessInfo: values.guestAccessInfo || '',
        videoCheckIn: values.videoCheckIn || '',
        additionalCheckOutInfo: values.additionalCheckOutInfo || '',
       }}
      >
       <CheckInForm
        form={form}
        CheckInTime={CheckInTime}
        setCheckInTime={setCheckInTime}
        setEarlyCheckIn={setEarlyCheckIn}
        setAccessToProperty={setAccessToProperty}
        setGuestAccessInfo={setGuestAccessInfo}
        setVideoCheckIn={setVideoCheckIn}
        setFrontPhoto={setFrontPhoto}
        values={values}
       />
       <CheckOutForm
        form={form}
        CheckOutTime={CheckOutTime}
        setCheckOutTime={setCheckOutTime}
        setBeforeCheckOut={setBeforeCheckOut}
        setLateCheckOutPolicy={setLateCheckOutPolicy}
        setAdditionalCheckOutInfo={setAdditionalCheckOutInfo}
       />
       <br />
       <Row justify="end">
        <Col xs={16} md={3}>
         <Form.Item>
          <Button
           type="primary"
           htmlType="submit"
           style={{ width: '100%' }}
           loading={checkInLoading || checkOutLoading}
          >
           Continue {<ArrowRightOutlined />}
          </Button>
         </Form.Item>
        </Col>
       </Row>
      </Form>
     </Spin>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default Step2CheckInOut;

const CheckInForm = ({
 form,
 CheckInTime,
 setCheckInTime,
 setEarlyCheckIn,
 setAccessToProperty,
 setGuestAccessInfo,
 setVideoCheckIn,
 setFrontPhoto,
 values,
}) => {
 const [videoURL, setVideoURL] = useState('');
 const [fileList, setFileList] = useState(() => {
  // Initialize fileList with existing frontPhoto if it exists
  if (values?.frontPhoto) {
   return [
    {
     uid: '-1',
     name: 'front-photo',
     status: 'done',
     url: values.frontPhoto,
    },
   ];
  }
  return [];
 });
 const [previewImage, setPreviewImage] = useState('');
 const [previewOpen, setPreviewOpen] = useState(false);

 const handlePreview = useCallback(async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
 }, []);
 const handleChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
  setFrontPhoto(newFileList);
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

 const onChangeEarlyCheckIn = (checkedvalues) => {
  setEarlyCheckIn(checkedvalues);
 };
 const onChangeAccessToProperty = (checkedvalues) => {
  setAccessToProperty(checkedvalues);
 };
 const handleVideoURLChange = (e) => {
  setVideoURL(e.target.value);
  setVideoCheckIn(e.target.value);
 };

 return (
  <Row gutter={[24, 0]}>
   <Col xs={24} md={24}>
    <Divider orientation="left">
     <h2 style={{ margin: 0 }}>Arrivée</h2>
    </Divider>
    <TimePickerWithDefault
     value={CheckInTime}
     onChange={setCheckInTime}
     name="checkInTime"
     label="Quand est l'heure la plus tôt à laquelle les invités peuvent s'enregistrer ?"
     isCheckIn={true}
    />
   </Col>
   <Col xs={24} md={24}>
    <Form.Item
     label="Sélectionnez les déclarations qui décrivent le mieux votre politique en matière de check-in anticipé."
     name="earlyCheckIn"
    >
     <Checkbox.Group onChange={onChangeEarlyCheckIn}>
      <Row>
       <Col span={24}>
        <Checkbox value="heureNonFlexible">
         Malheureusement l'heure d'arrivée n'est pas flexible.
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="ajustementHeure">
         À l'occasion il est possible d'ajuster votre heure d'arrivée si vous
         nous contactez.
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
   <Col xs={24} md={24}>
    <Form.Item
     label="Sélectionnez les déclarations qui décrivent le mieux la manière dont vos invités accéderont à la propriété."
     name="accessToProperty"
    >
     <Checkbox.Group onChange={onChangeAccessToProperty}>
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
         Nous vous enverrons vos codes d’accès par courriel avant votre arrivée.
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
   <Col xs={24} md={24}>
    <Form.Item
     label="Quelles informations vos invités doivent-ils connaître pour accéder à la propriété ?"
     name="guestAccessInfo"
    >
     <TextArea
      onChange={(e) => setGuestAccessInfo(e.target.value)}
      showCount
      maxLength={500}
     />
    </Form.Item>
   </Col>

   <Col xs={24} md={24}>
    <Form.Item
     label="Photo de la façade de la résidence ou de la maison."
     name="frontPhoto"
    >
     <div>
      <ImgCrop rotationSlider>
       <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
       >
        {fileList.length >= 1 ? null : uploadButton}
       </Upload>
      </ImgCrop>
      {previewImage && (
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
         visible: previewOpen,
         onVisibleChange: (visible) => setPreviewOpen(visible),
         afterOpenChange: (visible) => !visible && setPreviewImage(''),
        }}
        src={previewImage}
       />
      )}
     </div>
    </Form.Item>
   </Col>

   {/* Video URL Input */}
   <Col xs={24} md={24}>
    <Form.Item label="Lien vidéo pour les instructions d'enregistrement">
     <Input
      placeholder="Entrez l'URL de la vidéo (Hébergez vos vidéos sur Vimeo ou Youtube avant)"
      value={videoURL}
      onChange={handleVideoURLChange}
     />
    </Form.Item>
   </Col>

   {/* Video Embed */}
   {videoURL && (
    <Col xs={24} md={24}>
     <ReactPlayer url={videoURL} controls={true} width="100%" />
     <br />
    </Col>
   )}
  </Row>
 );
};

const CheckOutForm = ({
 form,
 CheckOutTime = { CheckOutTime },
 setCheckOutTime,
 setLateCheckOutPolicy,
 setBeforeCheckOut,
 setAdditionalCheckOutInfo,
}) => {
 const onChangeLateCheckOutPolicy = (checkedvalues) => {
  setLateCheckOutPolicy(checkedvalues);
 };
 const onChangeBeforeCheckOut = (checkedvalues) => {
  setBeforeCheckOut(checkedvalues);
 };
 return (
  <Row gutter={[24, 0]}>
   <Col xs={24} md={24}>
    <Divider orientation="left">
     <h2 style={{ margin: 0 }}>Départ</h2>
    </Divider>
    <TimePickerWithDefault
     value={CheckOutTime}
     onChange={setCheckOutTime}
     name="checkOutTime"
     label="À quelle heure voulez-vous demander aux invités de quitter les lieux ?"
     isCheckIn={false}
    />
   </Col>
   <Col xs={24} md={24}>
    <Form.Item
     label="Sélectionnez les déclarations qui décrivent le mieux votre politique de départ tardif :"
     name="lateCheckOutPolicy"
    >
     <Checkbox.Group onChange={onChangeLateCheckOutPolicy}>
      <Row>
       <Col span={24}>
        <Checkbox value="heureNonFlexible">
         Malheureusement l'heure de départ n'est pas flexible.
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="heureDepartAlternative">
         Lorsque l'horaire le permet, il nous fait plaisir d'accommoder une
         heure de départ alternative. Contactez-nous à l'avance si vous
         souhaitez prendre un arrangement à cet effet.
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="contactezNous">
         Communiquez avec nous si vous aimeriez quitter plus tard.
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="optionDepartTardif">
         Montrer l’option du départ tardif (si ce n’est pas coché on ne va pas
         le mentionner)
        </Checkbox>
       </Col>
      </Row>
     </Checkbox.Group>
    </Form.Item>
   </Col>
   <Col xs={24} md={24}>
    <Form.Item
     label="Que doivent faire les invités avant de partir ?"
     name="beforeCheckOut"
    >
     <Checkbox.Group onChange={onChangeBeforeCheckOut}>
      <Row>
       <Col span={24}>
        <Checkbox value="laissezBagages">
         Vous pouvez laissez vos bagages dans la propriété après l’heure du
         départ.
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
         Merci de vous assurer que vous avez bien éteint la cuisinière, lumières
         et autres appareils électriques.
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="replacezMeubles">
         Replacez les meubles à leur endroit original.
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="deposePoubelles">
         Merci de déposer poubelles et déchets dans les containers appropriés.
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
   <Col xs={24} md={24}>
    <Form.Item
     label="Informations supplémentaires sur le départ :"
     name="additionalCheckOutInfo"
    >
     <TextArea
      onChange={(e) => setAdditionalCheckOutInfo(e.target.value)}
      showCount
      maxLength={500}
     />
    </Form.Item>
   </Col>
  </Row>
 );
};
