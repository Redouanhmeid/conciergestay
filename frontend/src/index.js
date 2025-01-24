import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import { AuthContextProvider } from './context/AuthContext';
import { TranslationProvider } from './context/TranslationContext';
import themeConfig from './utils/themeConfig';
import trevioThemeConfig from './utils/trevioThemeConfig';
import frFR from 'antd/locale/fr_FR';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/notfoundpage';
import AdminPanel from './pages/admin/adminpanel';
import Managers from './pages/admin/managers';
import Properties from './pages/admin/properties';
import NearbyPlaces from './pages/admin/nearbyplaces';
import Manager from './pages/admin/manager';
import NearbyPlace from './pages/admin/nearbyplace';
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
import EditBasicInfo from './pages/forms/propertyedit/EditBasicInfo';
import EditEquipement from './pages/forms/propertyedit/EditEquipement';
import EditPhotos from './pages/forms/propertyedit/EditPhotos';
import EditHouseRules from './pages/forms/propertyedit/EditHouseRules';
import EditCheckIn from './pages/forms/propertyedit/EditCheckIn';
import AddAmenity from './pages/forms/amenity/AddAmenity';
import EditAmenity from './pages/forms/amenity/EditAmenity';
import DigitalGuidebook from './pages/components/DigitalGuidebook';
import ResetPasswordRequest from './pages/forms/sign/ResetPasswordRequest';
import VerifyResetCode from './pages/forms/sign/VerifyResetCode';
import NewPassword from './pages/forms/sign/NewPassword';
import EditCheckOut from './pages/forms/propertyedit/EditCheckOut';
import Pendingproperties from './pages/admin/pendingproperties';
import PendingNearbyPlaces from './pages/admin/pendingnearbyplaces';
import Profile from './pages/components/Profile';
import ContractsList from './pages/components/ContractsList';
import RevTasksDashboard from './pages/RevTasksDashboard';
import PropertyRevenueDashboard from './pages/admin/PropertyRevenueDashboard';
import PropertyTaskDashboard from './pages/admin/PropertyTaskDashboard';

const router = createBrowserRouter([
 { path: '/', element: <App />, errorElement: <NotFoundPage /> },
 { path: '/dashboard', element: <PropertyManagerHome /> },
 { path: '/revtaskdashboard', element: <RevTasksDashboard /> },
 { path: '/propertyrevenuedashboard', element: <PropertyRevenueDashboard /> },
 { path: '/propertytaskdashboard', element: <PropertyTaskDashboard /> },
 { path: '/adminpanel', element: <AdminPanel /> },
 { path: '/managers', element: <Managers /> },
 { path: '/manager', element: <Manager /> },
 { path: '/properties', element: <Properties /> },
 { path: '/nearbyplaces', element: <NearbyPlaces /> },
 { path: '/nearbyplace', element: <NearbyPlace /> },
 { path: '/pendingproperties', element: <Pendingproperties /> },
 { path: '/pendingnearbyplaces', element: <PendingNearbyPlaces /> },
 { path: '/login', element: <Login /> },
 { path: '/signup', element: <Signup /> },
 { path: '/account', element: <Account /> },
 { path: '/profile', element: <Profile /> },
 { path: '/reset-password-request', element: <ResetPasswordRequest /> },
 { path: '/verify-reset-code', element: <VerifyResetCode /> },
 { path: '/new-password', element: <NewPassword /> },
 { path: '/guestform', element: <Guestform /> },
 { path: '/addproperty', element: <AddProperty /> },
 { path: '/mappicker', element: <MapPicker /> },
 { path: '/propertydetails', element: <PropertyDetails /> },
 { path: '/createnearbyplace', element: <CreateNearbyPlace /> },
 { path: '/editproperty', element: <EditProperty /> },
 { path: '/editbasicinfo', element: <EditBasicInfo /> },
 { path: '/editequipements', element: <EditEquipement /> },
 { path: '/editphotos', element: <EditPhotos /> },
 { path: '/edithouserules', element: <EditHouseRules /> },
 { path: '/editcheckin', element: <EditCheckIn /> },
 { path: '/editcheckout', element: <EditCheckOut /> },
 { path: '/addamenity', element: <AddAmenity /> },
 { path: '/editamenity', element: <EditAmenity /> },
 { path: '/digitalguidebook', element: <DigitalGuidebook /> },
 { path: '/contractslist', element: <ContractsList /> },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <ConfigProvider locale={frFR} theme={themeConfig}>
  <AuthContextProvider>
   <TranslationProvider>
    <RouterProvider router={router} />
   </TranslationProvider>
  </AuthContextProvider>
 </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
