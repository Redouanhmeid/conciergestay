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
import Login from './pages/forms/sign/login';
import Signup from './pages/forms/sign/signup';
import Account from './pages/forms/account';
import { ConfigProvider } from 'antd';
import Guestform from './pages/forms/guestform';
import MapPicker from './pages/forms/propertypost/MapPicker';
import PropertyManagerHome from './pages/propertymanagerhome';
import PropertyDetails from './pages/components/PropertyDetails';
import CreateNearbyPlace from './pages/forms/createnearbyplace';
import AddProperty from './pages/forms/propertypost/AddProperty';
import EditProperty from './pages/forms/propertyedit/EditProperty';
import AddAmenity from './pages/forms/amenity/AddAmenity';
import EditAmenity from './pages/forms/amenity/EditAmenity';
import DigitalGuidebook from './pages/components/DigitalGuidebook';
import ResetPasswordRequest from './pages/forms/sign/ResetPasswordRequest';
import VerifyResetCode from './pages/forms/sign/VerifyResetCode';
import NewPassword from './pages/forms/sign/NewPassword';

const router = createBrowserRouter([
 { path: '/', element: <App />, errorElement: <NotFoundPage /> },
 { path: '/dashboard', element: <PropertyManagerHome /> },
 { path: '/login', element: <Login /> },
 { path: '/signup', element: <Signup /> },
 { path: '/account', element: <Account /> },
 { path: '/reset-password-request', element: <ResetPasswordRequest /> },
 { path: '/verify-reset-code', element: <VerifyResetCode /> },
 { path: '/new-password', element: <NewPassword /> },
 { path: '/guestform', element: <Guestform /> },
 { path: '/addproperty', element: <AddProperty /> },
 { path: '/mappicker', element: <MapPicker /> },
 { path: '/propertydetails', element: <PropertyDetails /> },
 { path: '/createnearbyplace', element: <CreateNearbyPlace /> },
 { path: '/editproperty', element: <EditProperty /> },
 { path: '/addamenity', element: <AddAmenity /> },
 { path: '/editamenity', element: <EditAmenity /> },
 { path: '/digitalguidebook', element: <DigitalGuidebook /> },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <ConfigProvider
  locale={frFR}
  theme={{
   token: {
    fontFamily: '"Jost", sans-serif',
    borderRadius: 12,
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
     headerHeight: 80,
     footerPadding: '24px 60px',
     headerPadding: '0 40px',
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
    Anchor: {
     fontSize: 16,
     linkPaddingBlock: 6,
    },
    Card: {
     colorTextHeading: 'rgb(43, 44, 50)',
     colorBorderSecondary: 'rgb(235, 222, 205)',
     boxShadowCard: '0',
     boxShadowTertiary: '0',
     fontWeightStrong: 500,
     headerFontSize: 16,
     headerFontSizeSM: 11,
    },
    Upload: {
     controlHeightLG: 60,
     colorError: 'rgb(235, 222, 205)',
     colorBorder: 'rgb(235, 222, 205)',
     colorFillAlter: 'rgb(250, 246, 241)',
     borderRadiusLG: 4,
     padding: 12,
     paddingSM: 10,
     paddingXS: 6,
    },
    Checkbox: {
     controlInteractiveSize: 24,
     borderRadiusSM: 8,
     lineWidthBold: 4,
     paddingXS: 8,
     lineHeight: 2.2,
    },
    Tag: {
     defaultColor: 'rgb(43, 44, 50)',
     defaultBg: 'rgba(255, 255, 255, 0)',
     fontSize: 16,
     fontSizeIcon: 16,
     fontSizeSM: 16,
    },
    Radio: {
     buttonPaddingInline: 60,
     fontSize: 16,
    },
    Switch: {
     algorithm: true,
     handleSize: 0,
     handleSizeSM: 0,
     fontSize: 16,
     fontSizeSM: 16,
     fontSizeIcon: 0,
     marginXXS: 6,
     trackHeight: 36,
     trackHeightSM: 30,
    },
    Slider: {
     handleSizeHover: 18,
     handleSize: 16,
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
