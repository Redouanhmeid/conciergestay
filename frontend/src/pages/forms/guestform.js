import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select, Layout, Row, Col, Typography, Upload, message } from 'antd'
import { SyncOutlined, LoadingOutlined, PlusOutlined  } from '@ant-design/icons';
import Head from '../../components/common/header'
import Foot from '../../components/common/footer'
import SignatureCanvas from 'react-signature-canvas'
const {Text} = Typography

const onChange = (value: string) => {console.log(`selected ${value}`);};
const onSearch = (value: string) => {console.log('search:', value);};
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
const Nationalities = [
    {label: 'Afghanistan', value: 'Afghanistan'}, 
    {label: 'Åland Islands', value: 'Åland Islands'}, 
    {label: 'Albania', value: 'Albania'}, 
    {label: 'Algeria', value: 'Algeria'}, 
    {label: 'American Samoa', value: 'American Samoa'}, 
    {label: 'AndorrA', value: 'AndorrA'}, 
    {label: 'Angola', value: 'Angola'}, 
    {label: 'Anguilla', value: 'Anguilla'}, 
    {label: 'Antarctica', value: 'Antarctica'}, 
    {label: 'Antigua and Barbuda', value: 'Antigua and Barbuda'}, 
    {label: 'Argentina', value: 'Argentina'}, 
    {label: 'Armenia', value: 'Armenia'}, 
    {label: 'Aruba', value: 'Aruba'}, 
    {label: 'Australia', value: 'Australia'}, 
    {label: 'Austria', value: 'Austria'}, 
    {label: 'Azerbaijan', value: 'Azerbaijan'}, 
    {label: 'Bahamas', value: 'Bahamas'}, 
    {label: 'Bahrain', value: 'Bahrain'}, 
    {label: 'Bangladesh', value: 'Bangladesh'}, 
    {label: 'Barbados', value: 'Barbados'}, 
    {label: 'Belarus', value: 'Belarus'}, 
    {label: 'Belgium', value: 'Belgium'}, 
    {label: 'Belize', value: 'Belize'}, 
    {label: 'Benin', value: 'Benin'}, 
    {label: 'Bermuda', value: 'Bermuda'}, 
    {label: 'Bhutan', value: 'Bhutan'}, 
    {label: 'Bolivia', value: 'Bolivia'}, 
    {label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina'}, 
    {label: 'Botswana', value: 'Botswana'}, 
    {label: 'Bouvet Island', value: 'Bouvet Island'}, 
    {label: 'Brazil', value: 'Brazil'}, 
    {label: 'British Indian Ocean Territory', value: 'British Indian Ocean Territory'}, 
    {label: 'Brunei Darussalam', value: 'Brunei Darussalam'}, 
    {label: 'Bulgaria', value: 'Bulgaria'}, 
    {label: 'Burkina Faso', value: 'Burkina Faso'}, 
    {label: 'Burundi', value: 'Burundi'}, 
    {label: 'Cambodia', value: 'Cambodia'}, 
    {label: 'Cameroon', value: 'Cameroon'}, 
    {label: 'Canada', value: 'Canada'}, 
    {label: 'Cape Verde', value: 'Cape Verde'}, 
    {label: 'Cayman Islands', value: 'Cayman Islands'}, 
    {label: 'Central African Republic', value: 'Central African Republic'}, 
    {label: 'Chad', value: 'Chad'}, 
    {label: 'Chile', value: 'Chile'}, 
    {label: 'China', value: 'China'}, 
    {label: 'Christmas Island', value: 'Christmas Island'}, 
    {label: 'Cocos (Keeling) Islands', value: 'Cocos (Keeling) Islands'}, 
    {label: 'Colombia', value: 'Colombia'}, 
    {label: 'Comoros', value: 'Comoros'}, 
    {label: 'Congo', value: 'Congo'}, 
    {label: 'Congo, The Democratic Republic of the', value: 'Congo, The Democratic Republic of the'}, 
    {label: 'Cook Islands', value: 'Cook Islands'}, 
    {label: 'Costa Rica', value: 'Costa Rica'}, 
    {label: 'Cote D\'Ivoire', value: 'Cote D\'Ivoire'}, 
    {label: 'Croatia', value: 'Croatia'}, 
    {label: 'Cuba', value: 'Cuba'}, 
    {label: 'Cyprus', value: 'Cyprus'}, 
    {label: 'Czech Republic', value: 'Czech Republic'}, 
    {label: 'Denmark', value: 'Denmark'}, 
    {label: 'Djibouti', value: 'Djibouti'}, 
    {label: 'Dominica', value: 'Dominica'}, 
    {label: 'Dominican Republic', value: 'Dominican Republic'}, 
    {label: 'Ecuador', value: 'Ecuador'}, 
    {label: 'Egypt', value: 'Egypt'}, 
    {label: 'El Salvador', value: 'El Salvador'}, 
    {label: 'Equatorial Guinea', value: 'Equatorial Guinea'}, 
    {label: 'Eritrea', value: 'Eritrea'}, 
    {label: 'Estonia', value: 'Estonia'}, 
    {label: 'Ethiopia', value: 'Ethiopia'}, 
    {label: 'Falkland Islands (Malvinas)', value: 'Falkland Islands (Malvinas)'}, 
    {label: 'Faroe Islands', value: 'Faroe Islands'}, 
    {label: 'Fiji', value: 'Fiji'}, 
    {label: 'Finland', value: 'Finland'}, 
    {label: 'France', value: 'France'}, 
    {label: 'French Guiana', value: 'French Guiana'}, 
    {label: 'French Polynesia', value: 'French Polynesia'}, 
    {label: 'French Southern Territories', value: 'French Southern Territories'}, 
    {label: 'Gabon', value: 'Gabon'}, 
    {label: 'Gambia', value: 'Gambia'}, 
    {label: 'Georgia', value: 'Georgia'}, 
    {label: 'Germany', value: 'Germany'}, 
    {label: 'Ghana', value: 'Ghana'}, 
    {label: 'Gibraltar', value: 'Gibraltar'}, 
    {label: 'Greece', value: 'Greece'}, 
    {label: 'Greenland', value: 'Greenland'}, 
    {label: 'Grenada', value: 'Grenada'}, 
    {label: 'Guadeloupe', value: 'Guadeloupe'}, 
    {label: 'Guam', value: 'Guam'}, 
    {label: 'Guatemala', value: 'Guatemala'}, 
    {label: 'Guernsey', value: 'Guernsey'}, 
    {label: 'Guinea', value: 'Guinea'}, 
    {label: 'Guinea-Bissau', value: 'Guinea-Bissau'}, 
    {label: 'Guyana', value: 'Guyana'}, 
    {label: 'Haiti', value: 'Haiti'}, 
    {label: 'Heard Island and Mcdonald Islands', value: 'Heard Island and Mcdonald Islands'}, 
    {label: 'Holy See (Vatican City State)', value: 'Holy See (Vatican City State)'}, 
    {label: 'Honduras', value: 'Honduras'}, 
    {label: 'Hong Kong', value: 'Hong Kong'}, 
    {label: 'Hungary', value: 'HUHungary'}, 
    {label: 'Iceland', value: 'Iceland'}, 
    {label: 'India', value: 'India'}, 
    {label: 'Indonesia', value: 'Indonesia'}, 
    {label: 'Iran, Islamic Republic Of', value: 'Iran, Islamic Republic Of'}, 
    {label: 'Iraq', value: 'Iraq'}, 
    {label: 'Ireland', value: 'IIrelandE'}, 
    {label: 'Isle of Man', value: 'Isle of Man'}, 
    {label: 'Israel', value: 'Israel'}, 
    {label: 'Italy', value: 'Italy'}, 
    {label: 'Jamaica', value: 'Jamaica'}, 
    {label: 'Japan', value: 'Japan'}, 
    {label: 'Jersey', value: 'Jersey'}, 
    {label: 'Jordan', value: 'Jordan'}, 
    {label: 'Kazakhstan', value: 'Kazakhstan'}, 
    {label: 'Kenya', value: 'Kenya'}, 
    {label: 'Kiribati', value: 'Kiribati'}, 
    {label: 'Korea, Democratic People\'S Republic of', value: 'Korea, Democratic People\'S Republic of'}, 
    {label: 'Korea, Republic of', value: 'Korea, Republic of'}, 
    {label: 'Kuwait', value: 'Kuwait'}, 
    {label: 'Kyrgyzstan', value: 'Kyrgyzstan'}, 
    {label: 'Lao People\'S Democratic Republic', value: 'Lao People\'S Democratic Republic'}, 
    {label: 'Latvia', value: 'Latvia'}, 
    {label: 'Lebanon', value: 'Lebanon'}, 
    {label: 'Lesotho', value: 'Lesotho'}, 
    {label: 'Liberia', value: 'Liberia'}, 
    {label: 'Libyan Arab Jamahiriya', value: 'Libyan Arab Jamahiriya'}, 
    {label: 'Liechtenstein', value: 'Liechtenstein'}, 
    {label: 'Lithuania', value: 'Lithuania'}, 
    {label: 'Luxembourg', value: 'Luxembourg'}, 
    {label: 'Macao', value: 'Macao'}, 
    {label: 'Macedonia, The Former Yugoslav Republic of', value: 'Macedonia, The Former Yugoslav Republic of'}, 
    {label: 'Madagascar', value: 'Madagascar'}, 
    {label: 'Malawi', value: 'Malawi'}, 
    {label: 'Malaysia', value: 'Malaysia'}, 
    {label: 'Maldives', value: 'Maldives'}, 
    {label: 'Mali', value: 'Mali'}, 
    {label: 'Malta', value: 'Malta'}, 
    {label: 'Marshall Islands', value: 'Marshall Islands'}, 
    {label: 'Martinique', value: 'Martinique'}, 
    {label: 'Mauritania', value: 'Mauritania'}, 
    {label: 'Mauritius', value: 'Mauritius'}, 
    {label: 'Mayotte', value: 'Mayotte'}, 
    {label: 'Mexico', value: 'Mexico'}, 
    {label: 'Micronesia, Federated States of', value: 'Micronesia, Federated States of'}, 
    {label: 'Moldova, Republic of', value: 'Moldova, Republic of'}, 
    {label: 'Monaco', value: 'Monaco'}, 
    {label: 'Mongolia', value: 'Mongolia'}, 
    {label: 'Montserrat', value: 'Montserrat'}, 
    {label: 'Morocco', value: 'Morocco'}, 
    {label: 'Mozambique', value: 'Mozambique'}, 
    {label: 'Myanmar', value: 'Myanmar'}, 
    {label: 'Namibia', value: 'Namibia'}, 
    {label: 'Nauru', value: 'Nauru'}, 
    {label: 'Nepal', value: 'Nepal'}, 
    {label: 'Netherlands', value: 'Netherlands'}, 
    {label: 'Netherlands Antilles', value: 'Netherlands Antilles'}, 
    {label: 'New Caledonia', value: 'New Caledonia'}, 
    {label: 'New Zealand', value: 'New Zealand'}, 
    {label: 'Nicaragua', value: 'Nicaragua'}, 
    {label: 'Niger', value: 'Niger'}, 
    {label: 'Nigeria', value: 'Nigeria'}, 
    {label: 'Niue', value: 'Niue'}, 
    {label: 'Norfolk Island', value: 'Norfolk Island'}, 
    {label: 'Northern Mariana Islands', value: 'Northern Mariana Islands'}, 
    {label: 'Norway', value: 'Norway'}, 
    {label: 'Oman', value: 'Oman'}, 
    {label: 'Pakistan', value: 'Pakistan'}, 
    {label: 'Palau', value: 'Palau'}, 
    {label: 'Palestinian Territory, Occupied', value: 'Palestinian Territory, Occupied'}, 
    {label: 'Panama', value: 'Panama'}, 
    {label: 'Papua New Guinea', value: 'Papua New Guinea'}, 
    {label: 'Paraguay', value: 'Paraguay'}, 
    {label: 'Peru', value: 'Peru'}, 
    {label: 'Philippines', value: 'Philippines'}, 
    {label: 'Pitcairn', value: 'Pitcairn'}, 
    {label: 'Poland', value: 'Poland'}, 
    {label: 'Portugal', value: 'Portugal'}, 
    {label: 'Puerto Rico', value: 'Puerto Rico'}, 
    {label: 'Qatar', value: 'Qatar'}, 
    {label: 'Reunion', value: 'Reunion'}, 
    {label: 'Romania', value: 'Romania'}, 
    {label: 'Russian Federation', value: 'Russian Federation'}, 
    {label: 'RWANDA', value: 'RWANDA'}, 
    {label: 'Saint Helena', value: 'Saint Helena'}, 
    {label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis'}, 
    {label: 'Saint Lucia', value: 'Saint Lucia'}, 
    {label: 'Saint Pierre and Miquelon', value: 'Saint Pierre and Miquelon'}, 
    {label: 'Saint Vincent and the Grenadines', value: 'Saint Vincent and the Grenadines'}, 
    {label: 'Samoa', value: 'Samoa'}, 
    {label: 'San Marino', value: 'San Marino'}, 
    {label: 'Sao Tome and Principe', value: 'Sao Tome and Principe'}, 
    {label: 'Saudi Arabia', value: 'Saudi Arabia'}, 
    {label: 'Senegal', value: 'Senegal'}, 
    {label: 'Serbia and Montenegro', value: 'Serbia and Montenegro'}, 
    {label: 'Seychelles', value: 'Seychelles'}, 
    {label: 'Sierra Leone', value: 'Sierra Leone'}, 
    {label: 'Singapore', value: 'Singapore'}, 
    {label: 'Slovakia', value: 'Slovakia'}, 
    {label: 'Slovenia', value: 'Slovenia'}, 
    {label: 'Solomon Islands', value: 'Solomon Islands'}, 
    {label: 'Somalia', value: 'Somalia'}, 
    {label: 'South Africa', value: 'South Africa'}, 
    {label: 'South Georgia and the South Sandwich Islands', value: 'South Georgia and the South Sandwich Islands'}, 
    {label: 'Spain', value: 'Spain'}, 
    {label: 'Sri Lanka', value: 'Sri Lanka'}, 
    {label: 'Sudan', value: 'Sudan'}, 
    {label: 'Surilabel', value: 'Surilabel'}, 
    {label: 'Svalbard and Jan Mayen', value: 'Svalbard and Jan Mayen'}, 
    {label: 'Swaziland', value: 'Swaziland'}, 
    {label: 'Sweden', value: 'Sweden'}, 
    {label: 'Switzerland', value: 'Switzerland'}, 
    {label: 'Syrian Arab Republic', value: 'Syrian Arab Republic'}, 
    {label: 'Taiwan, Province of China', value: 'Taiwan, Province of China'}, 
    {label: 'Tajikistan', value: 'TTajikistanJ'}, 
    {label: 'Tanzania, United Republic of', value: 'TZ'}, 
    {label: 'Thailand', value: 'TThailandH'}, 
    {label: 'Timor-Leste', value: 'Timor-Leste'}, 
    {label: 'Togo', value: 'Togo'}, 
    {label: 'Tokelau', value: 'Tokelau'}, 
    {label: 'Tonga', value: 'Tonga'}, 
    {label: 'Trinidad and Tobago', value: 'Trinidad and Tobago'}, 
    {label: 'Tunisia', value: 'Tunisia'}, 
    {label: 'Turkey', value: 'Turkey'}, 
    {label: 'Turkmenistan', value: 'Turkmenistan'}, 
    {label: 'Turks and Caicos Islands', value: 'Turks and Caicos Islands'}, 
    {label: 'Tuvalu', value: 'Tuvalu'}, 
    {label: 'Uganda', value: 'Uganda'}, 
    {label: 'Ukraine', value: 'Ukraine'}, 
    {label: 'United Arab Emirates', value: 'United Arab Emirates'}, 
    {label: 'United Kingdom', value: 'United Kingdom'}, 
    {label: 'United States', value: 'United States'}, 
    {label: 'United States Minor Outlying Islands', value: 'United States Minor Outlying Islands'}, 
    {label: 'Uruguay', value: 'Uruguay'}, 
    {label: 'Uzbekistan', value: 'Uzbekistan'}, 
    {label: 'Vanuatu', value: 'Vanuatu'}, 
    {label: 'Venezuela', value: 'Venezuela'}, 
    {label: 'Viet Nam', value: 'Viet Nam'}, 
    {label: 'Virgin Islands, British', value: 'Virgin Islands, British'},
    {label: 'Virgin Islands, U.S.', value: 'Virgin Islands, U.S.'},
    {label: 'Wallis and Futuna', value: 'Wallis and Futuna'},
    {label: 'Yemen', value: 'YemenYE'},
    {label: 'Zambia', value: 'Zambia'},
    {label: 'Zimbabwe', value: 'Zimbabwe'} 
]

const Guestform = () => {
    const [sign, setSign] = useState()
    const handleClear = () => {sign.clear()}
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
      }
    };
    
  return (
    <Layout className='contentStyle'>
    <Head />
    <Row>
      <Col xs={24} md={{span: 16, offset: 4}}>
      <div className='container-fluid'>
        <Form
          layout="vertical"
          size='large'
        >
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nom, Last Name, الإسم العائلي"
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: 'Veuillez saisir votre Nom!'
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Prénom, First name, الإسم الشخصي"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: 'Veuillez saisir votre Prénom!'
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                    label="Date de naissance, Date of birth, تاريخ الإزدياد"
                    name="dateofbirth"
                    
                >
                  <DatePicker style={{width: '100%',}} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Qualification, Profession, المهنة"
                  name="Profession"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                    label="Nationalité, Nationality, الجنسية"
                    name="Nationality"
                >
                <Select
                    showSearch
                    placeholder="Nationalité, Nationality, الجنسية"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={Nationalities}
                />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Numéro d'identité, Identity Number, رقم الهوية"
                  name="Identity"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                    label="Date de délivrance, Date of issue, تاريخ التسليم"
                    name="dateofissue"
                >
                  <DatePicker style={{width: '100%',}} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                    label="Date d'arrivée, Arrival Date, تاريخ الوصول"
                    name="dateofarrival"
                >
                  <DatePicker style={{width: '100%',}} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                    label="Date de départ, Departure date, تاريخ المغادرة"
                    name="dateofdeparture"
                >
                  <DatePicker style={{width: '100%',}} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                    label="Nombre de mineurs, Number of minors, عدد الأطفال"
                    name="minors"
                >
                  <InputNumber min={1} max={10} style={{width: '100%',}} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Destination, Destination, ذاهب إلى"
                  name="destination"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Lieu de provenance; Place of provenance, قادم من"
                  name="provenance"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Adresse domiciliaire actuelle, Current address, العنوان الحالي"
                  name="address"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="N° Téléphone, Phone, رقم الهاتف"
                  name="phone"
                >
                  <InputNumber style={{width: '100%',}} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Adresse de messagerie, E-mail, البريد الإلكتروني"
                  name="email"
                  rules={[{
                    type: "email",
                    required: true,
                    message: 'Veuillez fournir une adresse e-mail.',
                }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={24}>
                <Text>Signature électronique, Electronic signature, إمضاء إلكتروني</Text>
                <Form.Item
                  name="electronicsign"
                  style={{border: "1px solid #ebdecd", backgroundColor: "#fbfbfb", marginTop: 12}}
                >
                  <Button type="link" shape="circle" icon={<SyncOutlined />} onClick={handleClear} style={{position:'absolute', top:0, right:0}}/>
                  <SignatureCanvas
                    canvasProps={{className: 'sigCanvas'}}
                    ref={data=>setSign(data)}
                  />
                  
                </Form.Item>
              </Col>

              <Col xs={24} md={24}>
                <Form.Item
                  label="Identité, Identity , الهوية"
                  name="Identity"
                >
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{width: '100%'}}
                      />
                    ) : (
                      <button
                        style={{border: 0, background: 'none'}}
                        type="button"
                      >
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }} >
                          Upload
                        </div>
                      </button>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
            <Col xs={24} md={6}>
                <Form.Item >
                    <Button style={{width:"100%"}} size='large' type="primary" htmlType="submit">
                        Envoyer
                    </Button>
                </Form.Item>
            </Col>
            </Row>
        </Form>
    </div>
    </Col>
    </Row>
    <Foot />
    </Layout>
  )
}

export default Guestform