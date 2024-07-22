import axios from 'axios';
import { create } from 'zustand';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const useAuthStore = create((set) => ({
  loggedIn: false,
  useremail: localStorage.getItem('useremail') || null,  // Load from localStorage

  Loginform: {
    email: '',
    password: '',
  },
  Signupform: {
    email: '',
    password: '',
  },
  
  updateloginform: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      Loginform: {
        ...state.Loginform,
        [name]: value,
      },
    }));
  },
  updatesignupform: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      Signupform: {
        ...state.Signupform,
        [name]: value,
      },
    }));
  },

  login: async () => {
    try {
      const { Loginform } = useAuthStore.getState();
      const res = await axios.post(`${baseURL}/api/v1/login`, Loginform, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      set({
        loggedIn: true,
        useremail: Loginform.email,
        Loginform: {
          email: '',
          password: '',
        },
      });
      localStorage.setItem('useremail', Loginform.email);  // Save to localStorage
      console.log('Login successful:', res.data);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      console.error('Login failed:', errorMessage);
      alert(`Login failed: ${errorMessage}`);
    }
  },

  checkAuth: async () => {
    try {
      await axios.get(`${baseURL}/api/v1/check-auth`);
      set({ loggedIn: true });
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      console.error('Auth check failed:', errorMessage);
      set({ loggedIn: false });
    }
  },

  signup: async () => {
    try {
      const { Signupform } = useAuthStore.getState();
      const res = await axios.post(`${baseURL}/api/v1/signup`, Signupform, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      set({
        Signupform: {
          email: '',
          password: '',
        },
      });
      console.log('Signup successful:', res.data);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      console.error('Signup failed:', errorMessage);
      alert(`Signup failed: ${errorMessage}`);
    }
  },

  logout: async () => {
    try {
      await axios.get(`${baseURL}/api/v1/logout`);
      set({
        loggedIn: false,
        useremail: null,
      });
      localStorage.removeItem('useremail');  // Remove from localStorage
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      console.error('Logout failed:', errorMessage);
      alert(`Logout failed: ${errorMessage}`);
    }
  }
}));

export default useAuthStore;