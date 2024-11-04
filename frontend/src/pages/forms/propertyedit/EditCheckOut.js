import React, { useState, useEffect } from 'react';
import {
 Spin,
 Layout,
 Form,
 Input,
 Row,
 Col,
 TimePicker,
 Typography,
 Button,
 Checkbox,
 message,
} from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useGetProperty from '../../../hooks/useGetProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const format = 'HH:mm';

// Default check-out times that make more business sense
const DEFAULT_CHECK_OUT_TIME = dayjs().hour(12).minute(0); // 12:00 AM

const TimePickerWithDefault = ({ value, onChange, name, label }) => {
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
  onChange?.(DEFAULT_CHECK_OUT_TIME);
 };

 return (
  <Form.Item label={label} name={name}>
   <TimePicker
    format="HH:mm"
    showNow={false}
    size="large"
    onChange={handleTimeChange}
    onClear={handleClear}
    allowClear={false}
    value={value}
    placeholder="Sélectionnez l'heure de départ"
   />
  </Form.Item>
 );
};

const EditCheckOut = () => {
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyCheckOut, isLoading, success, error } =
  useUpdateProperty(id);
 const { property, loading } = useGetProperty(id);

 const [checkOutTime, setCheckOutTime] = useState(null);

 // Same time handling logic as in EditProperty
 useEffect(() => {
  if (!loading && property) {
   form.setFieldsValue({
    ...property,
    checkOutTime: dayjs(property.checkOutTime),
   });
  }
 }, [loading, property]);

 const handleSubmit = async (values) => {
  try {
   await updatePropertyCheckOut(values);
  } catch (err) {
   console.error('Form submission error:', err);
  }
 };

 useEffect(() => {
  if (success) {
   message.success(
    "Les informations d'arrivée ont été mises à jour avec succès"
   );
   navigate(-1);
  }
  if (error) {
   message.error(
    error ||
     "Une erreur s'est produite lors de la mise à jour des informations d'arrivée"
   );
  }
 }, [success, error, navigate]);

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
      onClick={() => navigate(-1)}
     >
      Retour
     </Button>
     <Title level={3}>Modifier les informations de départ</Title>
     <Form
      name="editCheckOut"
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
     >
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <TimePickerWithDefault
         value={checkOutTime}
         onChange={setCheckOutTime}
         name="checkOutTime"
         label="À quelle heure voulez-vous demander aux invités de quitter les lieux ?"
         isCheckIn={true}
        />
       </Col>

       <Col xs={24}>
        <Form.Item
         label="Sélectionnez les déclarations qui décrivent le mieux votre politique de départ tardif :"
         name="lateCheckOutPolicy"
        >
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="heureNonFlexible">
             Malheureusement l'heure de départ n'est pas flexible.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="heureDepartAlternative">
             Lorsque l'horaire le permet, il nous fait plaisir d'accommoder une
             heure de départ alternative. Contactez-nous à l'avance si vous
             souhaitez prendre un arrangement à cet effet.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="contactezNous">
             Communiquez avec nous si vous aimeriez quitter plus tard.
            </Checkbox>
           </Col>
           <Col xs={24}>
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
           <Col xs={24}>
            <Checkbox value="laissezBagages">
             Vous pouvez laissez vos bagages dans la propriété après l’heure du
             départ.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="signezLivreOr">
             S’il vous plait, signez notre livre d’or avant de partir.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="litsNonFaits">
             Laissez les lits que vous avez utilisés défaits.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laverVaisselle">
             Merci de laver et ranger vaisselle et plats utilisés.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="vaisselleLaveVaisselle">
             Mettez la vaisselle de dernière minute dans le lave-vaisselle.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="eteindreAppareilsElectriques">
             Merci de vous assurer que vous avez bien éteint la cuisinière,
             lumières et autres appareils électriques.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="replacezMeubles">
             Replacez les meubles à leur endroit original.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="deposePoubelles">
             Merci de déposer poubelles et déchets dans les containers
             appropriés.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="serviettesDansBaignoire">
             Mettez vos serviettes utilisées dans la baignoire.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="serviettesParTerre">
             Laissez les serviettes utilisées par terre.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="portesVerrouillees">
             Laissez la porte déverrouillée.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="porteNonVerrouillee">
             Assurez-vous que les portes sont verrouillées.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laissezCleMaison">
             Laissez la clé dans la maison.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laissezCleBoiteCle">
             Laissez la clé dans la boîte à clef.
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item
         label="Informations supplémentaires sur le départ :"
         name="additionalCheckOutInfo"
        >
         <TextArea showCount maxLength={500} />
        </Form.Item>
       </Col>
      </Row>

      <Button type="primary" htmlType="submit" loading={isLoading}>
       {success ? 'Mis à jour!' : 'Enregistrer les informations de départ'}
      </Button>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditCheckOut;
