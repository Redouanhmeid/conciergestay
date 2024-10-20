import { useAuthContext } from './hooks/useAuthContext';
import { Spin } from 'antd';
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
