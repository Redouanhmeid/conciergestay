import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropertyImg from '../../assets/property.jpg';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';

const AddPropertyCard = ({ userData }) => {
 const { t } = useTranslation();
 const navigate = useNavigate();
 const handleClick = () => {
  // navigate('/postproperty', { state: { userData } });
  navigate('/addproperty');
 };
 return (
  <Card
   style={{ textAlign: 'center' }}
   bordered={false}
   cover={
    <i
     className="fa-duotone fa-light fa-house fa-6x"
     style={{ color: '#FDB022' }}
    ></i>
   }
  >
   <Button
    type="primary"
    icon={<PlusOutlined />}
    size="large"
    onClick={handleClick}
   >
    {t('property.addButton')}
   </Button>
  </Card>
 );
};

export default AddPropertyCard;
