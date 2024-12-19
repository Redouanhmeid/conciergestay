import React, { useState } from 'react';
import {
 Button,
 DatePicker,
 Form,
 Input,
 InputNumber,
 Select,
 Layout,
 Row,
 Col,
 Typography,
 Upload,
 message,
} from 'antd';
import {
 SyncOutlined,
 PlusOutlined,
 ArrowLeftOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import SignatureCanvas from 'react-signature-canvas';
import { Nationalities } from '../../utils/nationalities';
import { countries } from '../../utils/countries';
import useReservationContract from '../../hooks/useReservationContract';
import useUploadPhotos from '../../hooks/useUploadPhotos';

const { Title, Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

const filterOption = (input, option) =>
 (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const Guestform = () => {
 const location = useLocation();
 const { id: propertyId } = queryString.parse(location.search);
 const [form] = Form.useForm();
 const { loading, error, createContract, checkAvailability } =
  useReservationContract();
 const { uploadSignature, uploadIdentity } = useUploadPhotos();
 const [countryCode, setCountryCode] = useState(
  countries.find((country) => country.name === 'Maroc').dialCode
 ); // Default to first country
 const navigate = useNavigate();

 const [sign, setSign] = useState();
 const [filelist, setFileList] = useState([]);

 const handleClear = () => {
  sign.clear();
 };

 const handleCountryChange = (value) => {
  setCountryCode(value);
 };

 const handleSubmit = async (values) => {
  try {
   // Check availability first
   /* const isAvailable = await checkAvailability(
    propertyId,
    values.dateofarrival,
    values.dateofdeparture
   );

   if (!isAvailable.available) {
    message.error('Selected dates are not available');
    return;
   } */

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
     message.error('Failed to upload signature');
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
    propertyId,
    firstname: values.firstname,
    lastname: values.lastname,
    birthDate: values.birthDate,
    sex: values.sex,
    nationality: values.Nationality,
    email: values.email,
    phone: fullPhoneNumber,
    startDate: values.startDate,
    endDate: values.endDate,
    residenceCountry: values.residenceCountry,
    residenceCity: values.residenceCountry,
    residenceAddress: values.residenceAddress,
    residencePostalCode: values.residencePostalCode,
    signatureImageUrl: signatureUrl,
    identityDocumentUrl: identityUrl,
    totalPrice: 0,
    status: 'DRAFT',
   };
   await createContract(contractData);
   message.success('Contract created successfully');
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

 const uploadButton = (
  <div>
   <PlusOutlined />
   <div style={{ marginTop: 8 }}>Charger</div>
  </div>
 );

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container-fluid">
     <Button
      type="default"
      shape="round"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
     >
      Retour
     </Button>
     <Title level={2}>Formulaire de Contract de reservation</Title>
     <Row gutter={[16, 4]}>
      <Col xs={24}>
       <div className="container-fluid">
        <Form
         form={form}
         layout="vertical"
         size="large"
         onFinish={handleSubmit}
        >
         <Row gutter={[16, 4]}>
          <Col xs={24} md={24}>
           <Title level={4}>Données personnelles</Title>
          </Col>

          <Col xs={24} md={8}>
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

          <Col xs={24} md={8}>
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

          <Col xs={24} md={8}>
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

          <Col xs={24} md={6}>
           <Form.Item
            label="Sex"
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

          <Col xs={24} md={6}>
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
            />
           </Form.Item>
          </Col>

          <Col xs={24} md={6}>
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

          <Col xs={24} md={6}>
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

          <Col xs={24} md={16}>
           <Form.Item
            label="Adresse"
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

          <Col xs={24} md={8}>
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

         <Row gutter={[16, 4]}>
          <Col XS={24} md={24}>
           <Title level={4}>Données du document</Title>
          </Col>

          <Col xs={24} md={12}>
           <Form.Item
            label="Adresse de messagerie, E-mail "
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

         <Row gutter={[16, 4]}>
          <Col XS={24} md={24}>
           <Title level={4}>Dates</Title>
          </Col>

          <Col xs={24} md={12}>
           <Form.Item
            label="Date d'arrivée"
            name="startDate"
            rules={[
             {
              required: true,
              message: "Veuillez sélectionner votre date d'arrivée",
             },
            ]}
           >
            <DatePicker style={{ width: '100%' }} />
           </Form.Item>
          </Col>

          <Col xs={24} md={12}>
           <Form.Item
            label="Date de départ"
            name="endDate"
            rules={[
             {
              required: true,
              message: 'Veuillez sélectionner votre date de départ',
             },
            ]}
           >
            <DatePicker style={{ width: '100%' }} />
           </Form.Item>
          </Col>
         </Row>

         <Row gutter={[16, 4]}>
          <Col XS={24} md={24}>
           <Title level={4}>Données du document</Title>
          </Col>

          <Col xs={24} md={24}>
           <Text>Signature électronique</Text>
           <div
            style={{
             border: '1px solid #ebdecd',
             backgroundColor: '#fbfbfb',
             marginTop: 12,
             position: 'relative',
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

         <Row justify="end">
          <Col xs={24} md={6}>
           <Form.Item>
            <Button
             style={{ width: '100%' }}
             size="large"
             type="primary"
             htmlType="submit"
             loading={loading}
             disabled={loading}
            >
             Envoyer
            </Button>
           </Form.Item>
          </Col>
         </Row>
        </Form>
       </div>
      </Col>
     </Row>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default Guestform;
