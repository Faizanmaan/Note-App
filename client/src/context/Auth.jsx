import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
} from "react";

const AuthContext = createContext();

const initialState = { isAuth: false, user: {} };
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { isAuth: true, user: action.payload };
    case "SET_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const readProfile = (token = null) => {
    const jwt = token || localStorage.getItem("jwt");

    if (!jwt) {
      setIsAppLoading(false);
      return;
    }

    axios
      .get(`${window.api}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          dispatch({ type: "LOGIN", payload: data.user });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsAppLoading(false);
      });
  };

  useEffect(() => {
    readProfile();
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        isAppLoading,
        setIsAppLoading,
        handleLogout,
        readProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
