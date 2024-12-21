import React, { useState, useEffect } from 'react';
import {
 Button,
 DatePicker,
 Form,
 Input,
 InputNumber,
 Select,
 Layout,
 Flex,
 Row,
 Col,
 Typography,
 Divider,
 Upload,
 Modal,
 Tooltip,
 Result,
 message,
} from 'antd';
import {
 SyncOutlined,
 PlusOutlined,
 ArrowLeftOutlined,
 QuestionCircleOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import SignatureCanvas from 'react-signature-canvas';
import { Nationalities } from '../../utils/nationalities';
import { countries } from '../../utils/countries';
import useReservationContract from '../../hooks/useReservationContract';
import { useUserData } from '../../hooks/useUserData';
import { useAuthContext } from '../../hooks/useAuthContext';
import useProperty from '../../hooks/useProperty';
import useUploadPhotos from '../../hooks/useUploadPhotos';
import ShareModal from '../../components/common/ShareModal';

const { Title, Text, Paragraph, Link } = Typography;
const { Option } = Select;
const { Content } = Layout;

const filterOption = (input, option) =>
 (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const Guestform = () => {
 const location = useLocation();
 const { id: propertyId } = queryString.parse(location.search);
 const { user } = useAuthContext();
 const storedUser = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserDataById, isLoading } = useUserData();
 const { property, fetchProperty } = useProperty();
 const [form] = Form.useForm();
 const { loading, error, createContract, checkAvailability } =
  useReservationContract();
 const { uploadSignature, uploadIdentity } = useUploadPhotos();
 const [countryCode, setCountryCode] = useState(
  countries.find((country) => country.name === 'Maroc').dialCode
 ); // Default to first country
 const navigate = useNavigate();

 const [isShareModalVisible, setIsShareModalVisible] = useState(false);
 const [pageUrl, setPageUrl] = useState();
 const [selectedNationality, setSelectedNationality] = useState('');
 const [sign, setSign] = useState();
 const [filelist, setFileList] = useState([]);
 const [isperDataModalOpen, setIsperDataModalOpen] = useState(false);
 const [isOwner, setIsOwner] = useState(false);
 const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

 const showShareModal = (id) => {
  setPageUrl();
  setPageUrl(`${window.location.origin}/guestform?id=${id}`);
  setIsShareModalVisible(true);
 };

 const hideShareModal = () => {
  setIsShareModalVisible(false);
 };

 const getMoroccanDocumentTypes = () => [
  { label: "Carte d'identité nationale", value: 'CIN' },
  { label: 'Permis de conduire', value: 'DRIVING_LICENSE' },
  { label: 'Passeport', value: 'PASSPORT' },
 ];

 const getForeignerDocumentTypes = () => [
  { label: 'Passeport', value: 'PASSPORT' },
  { label: 'Permis de séjour marocain', value: 'MOROCCAN_RESIDENCE' },
  { label: 'Permis de séjour pour étranger', value: 'FOREIGNER_RESIDENCE' },
 ];

 const handleNationalityChange = (value) => {
  setSelectedNationality(value);
  // Clear document-related fields when nationality changes
  form.setFieldsValue({
   documentType: undefined,
   documentNumber: undefined,
   documentIssueDate: undefined,
  });
 };

 const handleClear = () => {
  sign.clear();
 };

 const handleCountryChange = (value) => {
  setCountryCode(value);
 };

 const handleSubmit = async (values) => {
  try {
   const fullPhoneNumber = `${countryCode}${values.phone}`;

   if (!sign || sign.isEmpty()) {
    message.error('Veuillez signer le formulaire');
    return;
   }

   // Get signature data
   let signatureUrl = '';
   if (sign) {
    const signatureData = sign.toDataURL();
    try {
     signatureUrl = await uploadSignature(
      signatureData,
      values.firstname,
      values.lastname
     );
    } catch (uploadError) {
     message.error('Échec du téléchargement de la signature');
     return;
    }
   }

   let identityUrl = '';
   if (filelist.length > 0) {
    identityUrl = await uploadIdentity(
     filelist,
     values.firstname,
     values.lastname
    );
   }

   // Prepare contract data
   const contractData = {
    firstname: values.firstname,
    lastname: values.lastname,
    middlename: values.middlename,
    birthDate: values.birthDate,
    sex: values.sex,
    nationality: values.Nationality,
    email: values.email,
    phone: fullPhoneNumber,
    residenceCountry: values.residenceCountry,
    residenceCity: values.residenceCountry,
    residenceAddress: values.residenceAddress,
    residencePostalCode: values.residencePostalCode,
    documentType: values.documentType,
    documentNumber: values.documentNumber,
    documentIssueDate: values.documentIssueDate,
    status: 'DRAFT',
    signatureImageUrl: signatureUrl,
    identityDocumentUrl: identityUrl,
    propertyId,
   };
   await createContract(contractData);
   setIsSuccessModalOpen(true);
   form.resetFields();
   setFileList([]);
   sign?.clear();
  } catch (err) {
   message.error(error || 'Failed to create contract');
   console.error('Error submitting form:', err);
  }
 };

 const handleChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
 };

 const showperDataModal = () => {
  setIsperDataModalOpen(true);
 };
 const handleperDataCancel = () => {
  setIsperDataModalOpen(false);
 };

 useEffect(() => {
  if (storedUser && property) {
   if (storedUser.id === property.propertyManagerId) {
    setIsOwner(true);
   }
  }
 }, [storedUser, property]);

 useEffect(() => {
  fetchProperty(propertyId);
 }, [propertyId]);

 const uploadButton = (
  <div>
   <PlusOutlined />
   <div style={{ marginTop: 8 }}>Charger</div>
  </div>
 );

 const renderDocumentSection = () => (
  <>
   <Col xs={24} md={12}>
    <Form.Item
     label="Type de document"
     name="documentType"
     rules={[
      {
       required: true,
       message: 'Veuillez sélectionner le type de document',
      },
     ]}
    >
     <Select
      placeholder={
       selectedNationality
        ? 'Sélectionnez le type de document'
        : "Veuillez d'abord remplir le champ nationalité"
      }
      disabled={!selectedNationality}
      options={
       selectedNationality === 'Morocco'
        ? getMoroccanDocumentTypes()
        : selectedNationality
        ? getForeignerDocumentTypes()
        : []
      }
     />
    </Form.Item>
   </Col>

   <Col xs={24} md={12}>
    <Form.Item
     label="Numéro du document"
     name="documentNumber"
     rules={[
      {
       required: true,
       message: 'Veuillez saisir le numéro du document',
      },
     ]}
    >
     <Input />
    </Form.Item>
   </Col>

   <Col xs={24} md={12}>
    <Form.Item
     label={
      <Tooltip title="Date de création du document. (il ne s'agit pas de la date d'expiration)">
       Date de délivrance{' '}
       <QuestionCircleOutlined style={{ color: '#aa7e42' }} />
      </Tooltip>
     }
     name="documentIssueDate"
     rules={[
      {
       required: true,
       message: 'Veuillez saisir la date de délivrance',
      },
     ]}
    >
     <DatePicker style={{ width: '100%' }} />
    </Form.Item>
   </Col>
  </>
 );

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout className="container">
    <Content>
     <Flex gap="middle" align="start" justify="space-between">
      <Button
       type="default"
       shape="round"
       icon={<ArrowLeftOutlined />}
       onClick={() => navigate(-1)}
      >
       Retour
      </Button>
      {isOwner && (
       <Button
        icon={<i className="fa-light fa-share-nodes" />}
        onClick={() => showShareModal(propertyId)}
        type="text"
       >
        Partager
       </Button>
      )}
     </Flex>

     <Row>
      <Col xs={24} md={24}>
       <div className="container-fluid">
        <Title level={2}>Saisissez vos données personnelles</Title>
        <Form
         form={form}
         layout="vertical"
         size="large"
         className="hide-required-mark"
         onFinish={handleSubmit}
        >
         <Row gutter={[24, 24]}>
          <Col xs={24} md={14}>
           <Divider orientation="left">
            Données personnelles{' '}
            <i
             className="fa-light fa-square-question fa-lg"
             style={{ color: '#aa7e42', cursor: 'pointer' }}
             onClick={() => showperDataModal()}
            />
           </Divider>
           <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
             <Form.Item
              label="Prénom"
              name="firstname"
              rules={[
               {
                required: true,
                message: 'Veuillez saisir votre Prénom!',
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Nom"
              name="lastname"
              rules={[
               {
                required: true,
                message: 'Veuillez saisir votre Nom!',
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Deuxième nom de famille (facultatif)"
              name="middlename"
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Date de naissance"
              name="birthDate"
              rules={[
               {
                required: true,
                message: 'Veuillez saisir votre date de naissance',
               },
              ]}
             >
              <DatePicker style={{ width: '100%' }} />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Sexe"
              name="sex"
              rules={[
               {
                required: true,
                message: 'Veuillez sélectionner votre sexe',
               },
              ]}
             >
              <Select>
               <Select.Option value="MALE">Homme</Select.Option>
               <Select.Option value="FEMALE">Femme</Select.Option>
              </Select>
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Nationalité"
              name="Nationality"
              rules={[
               {
                required: true,
                message: 'Veuillez sélectionner votre nationalité',
               },
              ]}
             >
              <Select
               showSearch
               placeholder="Nationalité"
               optionFilterProp="children"
               filterOption={filterOption}
               options={Nationalities}
               onChange={handleNationalityChange}
              />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Pays de résidence"
              name="residenceCountry"
              rules={[
               {
                required: true,
                message: 'Veuillez entrer votre pays de résidence',
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Ville de résidence"
              name="residenceCity"
              rules={[
               {
                required: true,
                message: 'Veuillez entrer votre ville de résidence',
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Adresse de résidence"
              name="residenceAddress"
              rules={[
               {
                required: true,
                message: 'Veuillez entrer votre adresse',
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="Code postal"
              name="residencePostalCode"
              rules={[
               {
                required: true,
                message: 'Veuillez entrer votre code postal',
               },
              ]}
             >
              <InputNumber
               style={{ width: '100%' }}
               controls={false}
               maxLength={5}
               min={0}
               parser={(value) => {
                // Remove any non-digit characters and limit to 5 digits
                return value.replace(/\D/g, '').slice(0, 5);
               }}
               formatter={(value) => {
                // Format to ensure only numbers
                return value.replace(/\D/g, '');
               }}
              />
             </Form.Item>
            </Col>
           </Row>
           <br />
           <Divider orientation="left">
            Information du document d'identité
           </Divider>
           <Row gutter={[16, 4]}>
            {renderDocumentSection()}
            <Col xs={24} md={12}>
             <Form.Item
              label="Identité"
              name="Identity"
              rules={[
               {
                required: true,
                message: "Veuillez télécharger votre pièce d'identité",
               },
              ]}
             >
              <Upload
               listType="picture-card"
               fileList={filelist}
               onChange={handleChange}
              >
               {filelist.length >= 1 ? null : uploadButton}
              </Upload>
             </Form.Item>
            </Col>
           </Row>

           <Divider orientation="left">Coordonnées</Divider>
           <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
             <Form.Item
              label="Adresse de messagerie, Email "
              name="email"
              rules={[
               {
                type: 'email',
                required: true,
                message: 'Veuillez fournir une adresse e-mail.',
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label="N° Téléphone"
              name="phone"
              rules={[
               {
                required: true,
                message: 'Veuillez saisir votre numéro de téléphone',
               },
              ]}
             >
              <InputNumber
               type="number"
               addonBefore={
                <Select
                 value={countryCode}
                 style={{ width: 140 }}
                 onChange={handleCountryChange}
                >
                 {countries.map((country) => (
                  <Option key={country.code} value={country.dialCode}>
                   {`${country.name} ${country.dialCode}`}
                  </Option>
                 ))}
                </Select>
               }
               style={{ width: '100%' }}
               controls={false}
              />
             </Form.Item>
            </Col>
           </Row>
          </Col>

          <Col xs={24} md={10}>
           <Divider orientation="left">Signature électronique</Divider>
           <Col xs={24} md={24}>
            <div
             style={{
              border: '1px solid #ebdecd',
              backgroundColor: '#fbfbfb',
              marginTop: 12,
              marginBottom: 16,
              position: 'relative',
              minHeight: 160,
             }}
            >
             <Button
              type="link"
              shape="circle"
              icon={<SyncOutlined />}
              onClick={handleClear}
              style={{ position: 'absolute', top: 0, right: 0 }}
             />
             <SignatureCanvas
              canvasProps={{ className: 'sigCanvas' }}
              ref={(data) => setSign(data)}
             />
            </div>
           </Col>

           <Col xs={24} md={24}>
            <br />
            <br />
            <Paragraph>
             En cliquant sur <Text strong>'Signer le formulaire'</Text> vous
             acceptez de signer le formulaire avec votre nom et le nom de
             l'entreprise.{' '}
             <Link href="#" target="_blank">
              Politique de confidentialité
             </Link>
            </Paragraph>
            <br />
           </Col>
           <Col xs={24}>
            <Form.Item>
             <Button
              style={{ width: '100%' }}
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
             >
              Formulaire de signature
             </Button>
            </Form.Item>
           </Col>
          </Col>
         </Row>
        </Form>
       </div>
      </Col>
     </Row>
    </Content>
   </Layout>
   <Foot />
   <ShareModal
    isVisible={isShareModalVisible}
    onClose={hideShareModal}
    pageUrl={pageUrl}
   />
   <Modal
    title="Pourquoi toutes ces données sont-elles nécessaires ?"
    open={isperDataModalOpen}
    onCancel={handleperDataCancel}
    footer={null}
   >
    <Paragraph>
     Conformément à la législation locale, les autorités exigent des
     propriétaires/hôtes d'hébergement touristique qu'ils tiennent un registre
     de tous les hôtes qui visitent leurs propriétés. Les autorités attendent de
     vous un minimum de données personnelles obligatoires que vous devez leur
     fournir.
    </Paragraph>
    <Paragraph>
     Compléter le check-in en ligne avant votre arrivée vous permet de gagner du
     temps, car l'hôte devra saisir vos coordonnées à votre arrivée, ce qui
     pourrait prendre plus de temps.
    </Paragraph>
    <Paragraph>
     Toutes les données sont traitées conformément au règlement général sur la
     protection des données.Plus d'informations sur notre politique de
     confidentialité.
    </Paragraph>
    <Link href="#" target="_blank">
     Voir la politique de confidentialité
    </Link>
   </Modal>
   <Modal
    open={isSuccessModalOpen}
    footer={null}
    closable={false}
    width={500}
    centered
   >
    <Result
     status="success"
     title="Contrat envoyé avec succès!"
     subTitle={
      <div style={{ textAlign: 'center' }}>
       <p>Votre contrat de réservation a été créé et envoyé avec succès.</p>
       <p>Nous vous contacterons sous peu pour finaliser votre réservation.</p>
      </div>
     }
     extra={[
      <Button
       type="primary"
       key="home"
       onClick={() => navigate('/')}
       size="large"
      >
       Retour à l'accueil
      </Button>,
     ]}
    />
   </Modal>
  </Layout>
 );
};

export default Guestform;
