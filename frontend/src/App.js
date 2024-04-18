import { useAuthContext } from './hooks/useAuthContext ';
import Login from './pages/forms/login';
import { Spin } from 'antd';
import PropertyManagerHome from './pages/propertymanagerhome';
const App = () => {
 const { user, isLoading } = useAuthContext();

 if (!isLoading) {
  return <>{user === null ? <Login /> : <PropertyManagerHome />}</>;
 } else {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
};

export default App;
