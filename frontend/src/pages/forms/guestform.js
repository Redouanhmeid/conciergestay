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
 const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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
  { label: 'DRIVING_LICENSE', value: 'DRIVING_LICENSE' },
  { label: 'PASSPORT', value: 'PASSPORT' },
 ];

 const getForeignerDocumentTypes = () => [
  { label: 'PASSPORT', value: 'PASSPORT' },
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
     message.error('Échec de la création du contrat');
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
   message.error(error || 'Échec de la création du contrat');
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
       Veuillez saisir la date de délivrance{' '}
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
       Retour à l'accueil
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
            Saisissez vos données personnelles{' '}
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
              label="Adresse de messagerie"
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
             En cliquant sur (Formulaire de signature) vous acceptez de signer
             le formulaire avec votre nom et le nom de l'entreprise.{' '}
             <Link onClick={() => setIsPrivacyModalOpen(true)}>
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
     protection des données. Plus d'informations sur notre politique de
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
     title="Contrat envoyé avec succès"
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

   <Modal
    title="Politique de confidentialité"
    open={isPrivacyModalOpen}
    onCancel={() => setIsPrivacyModalOpen(false)}
    onOk={() => setIsPrivacyModalOpen(false)}
    cancelText={null}
    width={800}
   >
    <div className="privacy-policy" style={{ whiteSpace: 'pre-line' }}>
     <Title level={4}>1. Objet du Contrat</Title>
     <Paragraph>
      Ce contrat a pour objet la location d'un bien immobilier pour une durée
      déterminée. L'invité accepte de respecter le règlement intérieur du
      logement pendant toute la durée du séjour.
     </Paragraph>

     <Title level={4}>2. Arrivée et Départ</Title>
     <ul>
      <li>
       L'invité s'engage à informer l'hôte de son heure d'arrivée approximative
       au moins 24 heures à l'avance.
      </li>
      <li>Le départ doit être effectué dans les délais convenus.</li>
     </ul>

     <Title level={4}>3. Comportement et Respect des Lieux</Title>
     <ul>
      <li>
       L'invité s'engage à respecter la tranquillité du voisinage et à éviter
       tout bruit excessif, en particulier pendant les heures de calme.
      </li>
      <li>
       L'invité accepte de prendre soin du logement et de ses équipements. Toute
       dégradation ou perte sera facturée à l'invité.
      </li>
      <li>
       Il est formellement interdit de fumer à l'intérieur du logement. Des
       zones fumeurs peuvent être disponibles à l'extérieur (si applicable).
      </li>
      <li>
       Les animaux ne sont autorisés que sur demande préalable et avec l'accord
       écrit de l'hôte.
      </li>
     </ul>

     <Title level={4}>4. Utilisation des Installations</Title>
     <ul>
      <li>
       L'invité s'engage à utiliser les équipements du logement conformément aux
       instructions fournies par l'hôte. En cas de dysfonctionnement, l'invité
       doit informer l'hôte immédiatement.
      </li>
      <li>
       L'invité assume la responsabilité de toute mauvaise utilisation des
       équipements, qui pourrait entraîner des frais supplémentaires.
      </li>
     </ul>

     <Title level={4}>5. Propreté</Title>
     <ul>
      <li>
       L'invité s'engage à maintenir le logement propre et rangé pendant son
       séjour.
      </li>
      <li>
       Un service de ménage est inclus dans la location. Toutefois, des frais
       supplémentaires pourront être facturés si le logement est laissé dans un
       état excessivement sale.
      </li>
     </ul>

     <Title level={4}>6. Sécurité</Title>
     <ul>
      <li>
       L'invité s'engage à verrouiller toutes les portes et fenêtres du logement
       lorsqu'il quitte les lieux.
      </li>
      <li>
       En cas d'urgence (incendie, fuite d'eau, etc.), l'invité doit contacter
       immédiatement l'hôte et/ou les services d'urgence compétents.
      </li>
     </ul>

     <Title level={4}>7. Respect des Lois du Maroc</Title>
     <ul>
      <li>
       L'invité s'engage à respecter les lois du Maroc, notamment celles
       régissant la location touristique et le comportement dans les espaces
       publics.
      </li>
      <li>
       En cas de non-respect des lois du Maroc ou des règles énoncées dans ce
       contrat, l'hôte se réserve le droit de mettre fin à la location sans
       remboursement et de signaler l'incident aux autorités compétentes.
      </li>
     </ul>

     <Title level={4}>8. Utilisation de l'Internet</Title>
     <ul>
      <li>
       L'accès à Internet est fourni gratuitement. L'invité s'engage à
       l'utiliser de manière légale et respectueuse. Toute activité illégale en
       ligne est strictement interdite.
      </li>
     </ul>

     <Title level={4}>9. Règlement des Litiges</Title>
     <ul>
      <li>
       En cas de litige, l'hôte et l'invité s'engagent à tenter de résoudre la
       situation à l'amiable. Si cela n'est pas possible, le litige sera réglé
       conformément aux lois en vigueur au Maroc.
      </li>
     </ul>

     <Title level={4}>10. Annulation et Modifications</Title>
     <ul>
      <li>
       Les conditions d'annulation et de modification de la réservation sont
       précisées lors de la réservation et sont régies par les termes de ce
       contrat.
      </li>
     </ul>

     <Title level={4}>11. Interdiction des Invités Non Autorisés</Title>
     <ul>
      <li>
       L'invité s'engage à ne pas accueillir ou héberger des personnes non
       mentionnées dans la réservation initiale sans l'accord préalable et écrit
       de l'hôte. Toute personne supplémentaire non déclarée pourra entraîner
       des frais additionnels, l'annulation immédiate de la réservation sans
       remboursement, et/ou des mesures légales conformément aux lois en vigueur
       au Maroc.
      </li>
     </ul>

     <Title level={4}>Signature électronique</Title>
     <Paragraph>
      En signant ce contrat, l'invité reconnaît avoir pris connaissance des
      termes du présent règlement intérieur et s'engage à respecter toutes les
      conditions énoncées.
     </Paragraph>
    </div>
   </Modal>
  </Layout>
 );
};

export default Guestform;
