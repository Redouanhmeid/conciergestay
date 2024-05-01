import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotFoundPage = () => {
 return (
  <div className="loading">
   <Result
    status="404"
    title="404"
    subTitle="Désolé, la page que vous avez visitée n'existe pas."
    extra={
     <Link to="/">
      <Button type="primary">Accueil</Button>
     </Link>
    }
   />
  </div>
 );
};

export default NotFoundPage;
