// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
 apiKey: 'AIzaSyBBkmi99VHIhALiZGI1K_Qnewg_TCUKYys',
 authDomain: 'conciergestay-71faf.firebaseapp.com',
 projectId: 'conciergestay-71faf',
 storageBucket: 'conciergestay-71faf.appspot.com',
 messagingSenderId: '594472270330',
 appId: '1:594472270330:web:e1ce2297b28505e0e1cc43',
 measurementId: 'G-YMD2JHK692',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
