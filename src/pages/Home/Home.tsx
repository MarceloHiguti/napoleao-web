import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/config/firebaseConfiguration';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log('uid', uid);
        return navigate('/online-game');
      } else {
        console.log('user is logged out');
        return navigate('/login');
      }
    });
  }, []);

  return <></>;
};

export default Home;
