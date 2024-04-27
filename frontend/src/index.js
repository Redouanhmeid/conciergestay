import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import { AuthContextProvider } from './context/AuthContext';
import frFR from 'antd/locale/fr_FR';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/notfoundpage';
import Login from './pages/forms/login';
import Signup from './pages/forms/signup';
import Account from './pages/forms/account';
import { ConfigProvider } from 'antd';
import Guestform from './pages/forms/guestform';
import PropertyPost from './pages/forms/propertypost/propertypost';
import MapPicker from './pages/forms/propertypost/MapPicker';
import PropertyManagerHome from './pages/propertymanagerhome';
import PropertyDetails from './pages/components/PropertyDetails';
import CreateNearbyPlace from './pages/forms/createnearbyplace';
const router = createBrowserRouter([
 { path: '/', element: <App />, errorElement: <NotFoundPage /> },
 { path: '/pmhome', element: <PropertyManagerHome /> },
 { path: '/login', element: <Login /> },
 { path: '/signup', element: <Signup /> },
 { path: '/account', element: <Account /> },
 { path: '/guestform', element: <Guestform /> },
 { path: '/postproperty', element: <PropertyPost /> },
 { path: '/mappicker', element: <MapPicker /> },
 { path: '/propertydetails', element: <PropertyDetails /> },
 { path: '/createnearbyplace', element: <CreateNearbyPlace /> },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <ConfigProvider
  locale={frFR}
  theme={{
   token: {
    fontFamily: '"Jost", sans-serif',
    borderRadius: 0,
    colorPrimary: '#aa7e42',
    colorInfo: '#aa7e42',
    colorTextBase: '#2b2c32',
   },
   components: {
    Layout: {
     headerBg: 'rgb(241, 241, 241)',
     bodyBg: 'rgb(255, 255, 255)',
     footerBg: 'rgb(251, 251, 251)',
     lightSiderBg: 'rgb(251, 251, 251)',
     headerColor: 'rgb(43, 44, 50)',
     siderBg: 'rgb(251, 251, 251)',
     triggerBg: 'rgb(241, 241, 241)',
     triggerColor: 'rgb(43, 44, 50)',
    },
    Menu: {
     itemActiveBg: 'rgb(250, 246, 241)',
     itemBg: 'rgb(251, 251, 251, 0)',
     itemHoverBg: 'rgb(250, 246, 241)',
     itemColor: 'rgb(43, 44, 50)',
     itemHoverColor: 'rgb(43, 44, 50)',
     collapsedIconSize: 18,
     iconSize: 18,
     fontSize: 16,
     itemHeight: 45,
     itemSelectedColor: 'rgb(43, 44, 50)',
     itemSelectedBg: 'rgb(235, 222, 205)',
     iconMarginInlineEnd: 14,
     colorSplit: 'rgba(116, 62, 62, 0)',
    },
    Form: {
     labelColor: 'rgb(43, 44, 50)',
     verticalLabelPadding: '0',
     labelHeight: 20,
    },
   },
  }}
 >
  <AuthContextProvider>
   <RouterProvider router={router} />
  </AuthContextProvider>
 </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
