import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS

import { useState, useEffect } from 'react';
import { login } from '../../utils/auth';
import { Link } from 'react-router-dom';
import loginimg from '../../../public/assets/Josephine Tey.jpeg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError('');
      alert("Login successful!");
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Default duration for all animations
      easing: 'ease-out-cubic', // Default easing
    });
  }, []);

  return (
    <div className='bg-gradient-to-t from-red-800/80 to-black shadow-lg w-full h-screen overflow-hidden pt-24'>

      <div
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="1000"
        className="flex flex-row w-1/2 h-2/3 mx-auto bg-red-950/30 backdrop-blur-sm overflow-hidden rounded-3xl border border-red-200 text-white shadow-lg shadow-red-200"
      >
        <div className='flex bg-red-100/10 align-center justify-center w-full'>
          <img
            src={loginimg}
            alt="Legal Image"
            className="w-4/6 m-auto rounded-br-4xl rounded-tl-4xl shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
          />
        </div>
        <div className='mx-auto p-6 w-full m-auto'>
          <h2 className="text-2xl font-semibold text-center text-red-100 mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-3xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-3xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-3xl bg-red-800 text-white hover:bg-red-300 hover:text-black hover:font-bold hover:scale-105 transition-all ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-red-900"
            >
              Login
            </button>
          </form>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          <div className="mt-4 text-center">
            <p className="text-sm">Dont have an account?</p>
            <Link
              to="/signup"
              className="text-red-300 hover:text-red-800 font-semibold"
            >
              Sign Up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
