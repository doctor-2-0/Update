import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { RootState, AppDispatch } from "@/lib/store";
import { login, logout } from "@/features/authSlice";

export const useAuth = () => {
  console.log("useAuth called");
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.Auth);

  const handleLogin = async (credentials: {
    email?: string;
    username?: string;
    password?: string;
    token?: string;
  }) => {
    const result = await dispatch(login(credentials));
    if (login.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
    return result.payload;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await dispatch(login({ token }));
      console.log("checkAuth called", auth);
    }
  }, [dispatch]);

  return { auth, handleLogin, handleLogout, checkAuth };
};
