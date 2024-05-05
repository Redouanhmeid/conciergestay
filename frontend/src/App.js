import { useAuthContext } from './hooks/useAuthContext';
import Login from './pages/forms/login';
import { Spin } from 'antd';
import PropertyManagerHome from './pages/propertymanagerhome';
import Home from './pages/home';
const App = () => {
 const { user, isLoading } = useAuthContext();

 if (!isLoading) {
  return <Home />;
 } else {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
};

export default App;
