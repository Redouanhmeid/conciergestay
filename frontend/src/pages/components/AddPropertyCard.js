import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropertyImg from '../../assets/property.jpg';
import { useNavigate } from 'react-router-dom';

const AddPropertyCard = ({ userData }) => {
 const navigate = useNavigate();
 const handleClick = () => {
  navigate('/postproperty', { state: { userData } });
 };
 return (
  <Card
   style={{ textAlign: 'center' }}
   cover={<img alt="example" src={PropertyImg} />}
   actions={[
    <Button
     type="primary"
     icon={<PlusOutlined />}
     size="large"
     onClick={handleClick}
    >
     Ajoutez votre propriété
    </Button>,
   ]}
  >
   <Card.Meta
    title="Ajoutez votre propriété"
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat mi quis massa dictum, id ultrices justo malesuada."
   />
  </Card>
 );
};

export default AddPropertyCard;
