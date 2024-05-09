import React, { useState } from 'react';
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
} from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Content } = Layout;
const { TextArea } = Input;
const format = 'HH:mm';

const Step2CheckInOut = ({ next, prev, values }) => {
 const [form] = Form.useForm();
 const [CheckInTime, setCheckInTime] = useState(
  form.getFieldValue('checkInTime')
 );
 const [CheckOutTime, setCheckOutTime] = useState(
  form.getFieldValue('checkOutTime')
 );
 const [EarlyCheckIn, setEarlyCheckIn] = useState([]);
 const [AccessToProperty, setAccessToProperty] = useState([]);
 const [LateCheckOutPolicy, setLateCheckOutPolicy] = useState([]);
 const [BeforeCheckOut, setBeforeCheckOut] = useState([]);
 const [GuestAccessInfo, setGuestAccessInfo] = useState([]);
 const [AdditionalCheckOutInfo, setAdditionalCheckOutInfo] = useState([]);

 const submitFormData = () => {
  values.checkInTime = CheckInTime || dayjs().hour(12).minute(0);
  values.earlyCheckIn = EarlyCheckIn;
  values.accessToProperty = AccessToProperty;
  values.checkOutTime = CheckOutTime || dayjs().hour(12).minute(0);
  values.lateCheckOutPolicy = LateCheckOutPolicy;
  values.beforeCheckOut = BeforeCheckOut;
  values.guestAccessInfo = GuestAccessInfo;
  values.additionalCheckOutInfo = AdditionalCheckOutInfo;
  next();
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Form
      name="step2"
      layout="vertical"
      onFinish={submitFormData}
      size="large"
      form={form}
      initialValues={{
       ['checkInTime']: dayjs().hour(12).minute(0),
       ['checkOutTime']: dayjs().hour(12).minute(0),
      }}
     >
      <CheckInForm
       form={form}
       setCheckInTime={setCheckInTime}
       setEarlyCheckIn={setEarlyCheckIn}
       setAccessToProperty={setAccessToProperty}
       setGuestAccessInfo={setGuestAccessInfo}
      />
      <CheckOutForm
       form={form}
       setCheckOutTime={setCheckOutTime}
       setBeforeCheckOut={setBeforeCheckOut}
       setLateCheckOutPolicy={setLateCheckOutPolicy}
       setAdditionalCheckOutInfo={setAdditionalCheckOutInfo}
      />
      <br />
      <Row justify="end">
       <Col xs={8} md={1}>
        <Form.Item>
         <Button
          htmlType="submit"
          shape="circle"
          onClick={prev}
          icon={<ArrowLeftOutlined />}
         />
        </Form.Item>
       </Col>
       <Col xs={16} md={3}>
        <Form.Item>
         <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Continue {<ArrowRightOutlined />}
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

export default Step2CheckInOut;

const CheckInForm = ({
 form,
 setCheckInTime,
 setEarlyCheckIn,
 setAccessToProperty,
 setGuestAccessInfo,
}) => {
 const onChangeCheckIn = (time) => {
  setCheckInTime(time);
 };
 const onChangeEarlyCheckIn = (checkedvalues) => {
  setEarlyCheckIn(checkedvalues);
 };
 const onChangeAccessToProperty = (checkedvalues) => {
  setAccessToProperty(checkedvalues);
 };
 return (
  <Row gutter={[24, 0]}>
   <Col xs={24} md={24}>
    <Divider orientation="left">
     <h2 style={{ margin: 0 }}>Arrivée</h2>
    </Divider>
    <Form.Item
     label="Quand est l'heure la plus tôt à laquelle les invités peuvent s'enregistrer ?"
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
     <TextArea onChange={(e) => setGuestAccessInfo(e.target.value)} />
    </Form.Item>
   </Col>
  </Row>
 );
};

const CheckOutForm = ({
 form,
 setCheckOutTime,
 setLateCheckOutPolicy,
 setBeforeCheckOut,
 setAdditionalCheckOutInfo,
}) => {
 const onChangeCheckOut = (time) => {
  setCheckOutTime(time);
 };
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
     <TextArea onChange={(e) => setAdditionalCheckOutInfo(e.target.value)} />
    </Form.Item>
   </Col>
  </Row>
 );
};
