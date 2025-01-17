import React, { useState, useEffect, useRef } from 'react';
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
 Space,
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
import { useTranslation } from '../../context/TranslationContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PDFContractGenerator from '../../utils/PDFContractGenerator';

const { Title, Text, Paragraph, Link } = Typography;
const { Option } = Select;
const { Content } = Layout;

const filterOption = (input, option) =>
 (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const Guestform = () => {
 const { t } = useTranslation();
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
 const [formValues, setFormValues] = useState({});

 const formRef = useRef(null);

 const showShareModal = (id) => {
  setPageUrl();
  setPageUrl(`${window.location.origin}/guestform?id=${id}`);
  setIsShareModalVisible(true);
 };

 const hideShareModal = () => {
  setIsShareModalVisible(false);
 };

 const perDataPrivacyLink = () => {
  setIsperDataModalOpen(false);
  setIsPrivacyModalOpen(true);
 };

 const getMoroccanDocumentTypes = () => [
  { label: t('guestForm.identity.documentType.types.cin'), value: 'CIN' },
  {
   label: t('guestForm.identity.documentType.types.drivingLicense'),
   value: 'DRIVING_LICENSE',
  },
  {
   label: t('guestForm.identity.documentType.types.passport'),
   value: 'PASSPORT',
  },
 ];

 const getForeignerDocumentTypes = () => [
  {
   label: t('guestForm.identity.documentType.types.passport'),
   value: 'PASSPORT',
  },
  {
   label: t('guestForm.identity.documentType.types.moroccanResidence'),
   value: 'MOROCCAN_RESIDENCE',
  },
  {
   label: t('guestForm.identity.documentType.types.foreignerResidence'),
   value: 'FOREIGNER_RESIDENCE',
  },
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
    message.error(t('guestForm.validation.signature'));
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
     message.error(t('error.submit'));
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
   setFormValues(contractData);

   setIsSuccessModalOpen(true);
  } catch (err) {
   message.error(t('error.submit'));
   console.error('Error submitting form:', err);
  }
 };

 const handleChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
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
   <div style={{ marginTop: 8 }}>{t('common.upload')}</div>
  </div>
 );

 const renderDocumentSection = () => (
  <>
   <Col xs={24} md={12}>
    <Form.Item
     label={t('guestForm.identity.documentType.label')}
     name="documentType"
     rules={[
      {
       required: true,
       message: t('guestForm.validation.documentType'),
      },
     ]}
    >
     <Select
      placeholder={
       selectedNationality
        ? t('guestForm.identity.documentType.placeholder')
        : t('guestForm.identity.documentType.nationalityFirst')
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
     label={t('guestForm.identity.documentNumber')}
     name="documentNumber"
     rules={[
      {
       required: true,
       message: t('guestForm.validation.documentNumber'),
      },
     ]}
    >
     <Input />
    </Form.Item>
   </Col>

   <Col xs={24} md={12}>
    <Form.Item
     label={
      <Tooltip title={t('guestForm.identity.issueDate.tooltip')}>
       {t('guestForm.identity.issueDate.label')}{' '}
       <QuestionCircleOutlined style={{ color: '#aa7e42' }} />
      </Tooltip>
     }
     name="documentIssueDate"
     rules={[
      {
       required: true,
       message: t('guestForm.validation.issueDate'),
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
       {t('guestForm.backHome')}
      </Button>
      {isOwner && (
       <Button
        icon={<i className="fa-light fa-share-nodes" />}
        onClick={() => showShareModal(propertyId)}
        type="default"
       >
        {t('common.share')}
       </Button>
      )}
     </Flex>

     <Row>
      <Col xs={24} md={24}>
       <div className="container-fluid">
        <Title level={2}>{t('guestForm.title')}</Title>
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
            {t('guestForm.personalData.title')}{' '}
            <i
             className="fa-light fa-square-question fa-lg"
             style={{ color: '#aa7e42', cursor: 'pointer' }}
             onClick={() => setIsperDataModalOpen(true)}
            />
           </Divider>
           <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.firstName')}
              name="firstname"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.firstName'),
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.lastName')}
              name="lastname"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.lastName'),
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.middleName')}
              name="middlename"
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.birthDate')}
              name="birthDate"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.birthDate'),
               },
              ]}
             >
              <DatePicker style={{ width: '100%' }} />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.sex.label')}
              name="sex"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.sex'),
               },
              ]}
             >
              <Select>
               <Select.Option value="MALE">
                {t('guestForm.personalData.sex.male')}
               </Select.Option>
               <Select.Option value="FEMALE">
                {t('guestForm.personalData.sex.female')}
               </Select.Option>
              </Select>
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.nationality')}
              name="Nationality"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.nationality'),
               },
              ]}
             >
              <Select
               showSearch
               placeholder={t('guestForm.personalData.nationality')}
               optionFilterProp="children"
               filterOption={filterOption}
               options={Nationalities}
               onChange={handleNationalityChange}
              />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.residenceCountry')}
              name="residenceCountry"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.residenceCountry'),
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.residenceCity')}
              name="residenceCity"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.residenceCity'),
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.residenceAddress')}
              name="residenceAddress"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.residenceAddress'),
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.personalData.postalCode')}
              name="residencePostalCode"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.postalCode'),
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
           <Divider orientation="left">{t('guestForm.identity.title')}</Divider>
           <Row gutter={[16, 4]}>
            {renderDocumentSection()}
            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.identity.upload.label')}
              name="Identity"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.identity'),
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

           <Divider orientation="left">{t('guestForm.contact.title')}</Divider>
           <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.contact.email')}
              name="email"
              rules={[
               {
                type: 'email',
                required: true,
                message: t('guestForm.validation.email'),
               },
              ]}
             >
              <Input />
             </Form.Item>
            </Col>

            <Col xs={24} md={12}>
             <Form.Item
              label={t('guestForm.contact.phone')}
              name="phone"
              rules={[
               {
                required: true,
                message: t('guestForm.validation.phone'),
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
           <Divider orientation="left">
            {t('guestForm.signature.title')}
           </Divider>
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
             {t('guestForm.signature.policy')}{' '}
             <Link onClick={() => setIsPrivacyModalOpen(true)}>
              {t('guestForm.signature.privacyLink')}
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
              {t('guestForm.signature.button')}
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
    title={t('guestForm.infoModal.title')}
    open={isperDataModalOpen}
    onCancel={() => setIsperDataModalOpen(false)}
    footer={null}
   >
    <Paragraph>{t('guestForm.infoModal.content1')}</Paragraph>
    <Paragraph>{t('guestForm.infoModal.content2')}</Paragraph>
    <Paragraph>{t('guestForm.infoModal.content3')}</Paragraph>
    <Link onClick={() => perDataPrivacyLink()} target="_blank">
     {t('guestForm.signature.privacyLink')}
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
     title={t('guestForm.success.title')}
     subTitle={
      <div style={{ textAlign: 'center' }}>
       <p>{t('guestForm.success.subtitle1')}</p>
       <p>{t('guestForm.success.subtitle2')}</p>
      </div>
     }
     extra={[
      <Space align="center">
       <PDFContractGenerator
        formData={formValues}
        signature={sign}
        filelist={filelist}
        t={t}
       />
       <Button
        type="primary"
        key="home"
        onClick={() => navigate('/')}
        size="large"
       >
        {t('guestForm.backHome')}
       </Button>
      </Space>,
     ]}
    />
   </Modal>

   <Modal
    title={t('guestForm.privacyPolicy.title')}
    open={isPrivacyModalOpen}
    onCancel={() => setIsPrivacyModalOpen(false)}
    onOk={() => setIsPrivacyModalOpen(false)}
    cancelText={null}
    width={800}
   >
    <div className="privacy-policy" style={{ whiteSpace: 'pre-line' }}>
     <Title level={4}>{t('guestForm.privacyPolicy.contract.title')}</Title>
     <Paragraph>{t('guestForm.privacyPolicy.contract.content')}</Paragraph>

     <Title level={4}>{t('guestForm.privacyPolicy.arrival.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.arrival.guestNotify')}</li>
      <li>{t('guestForm.privacyPolicy.arrival.departure')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.behavior.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.behavior.noise')}</li>
      <li>{t('guestForm.privacyPolicy.behavior.care')}</li>
      <li>{t('guestForm.privacyPolicy.behavior.smoking')}</li>
      <li>{t('guestForm.privacyPolicy.behavior.pets')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.facilities.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.facilities.usage')}</li>
      <li>{t('guestForm.privacyPolicy.facilities.responsibility')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.cleanliness.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.cleanliness.maintain')}</li>
      <li>{t('guestForm.privacyPolicy.cleanliness.service')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.security.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.security.lock')}</li>
      <li>{t('guestForm.privacyPolicy.security.emergency')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.morocco.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.morocco.laws')}</li>
      <li>{t('guestForm.privacyPolicy.morocco.consequences')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.internet.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.internet.content')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.disputes.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.disputes.content')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.cancellation.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.cancellation.content')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.unauthorized.title')}</Title>
     <ul>
      <li>{t('guestForm.privacyPolicy.unauthorized.content')}</li>
     </ul>

     <Title level={4}>{t('guestForm.privacyPolicy.signature.title')}</Title>
     <Paragraph>{t('guestForm.privacyPolicy.signature.content')}</Paragraph>
    </div>
   </Modal>
  </Layout>
 );
};

export default Guestform;
