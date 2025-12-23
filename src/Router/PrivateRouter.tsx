import { useAppSelector } from "../hooks/hooksStore";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/loading/Loading";

export const PrivateRouter = () => {
  const { isAuth, authCheck } = useAppSelector((state) => state.auth);

  if (!authCheck) {
    return <Loading />;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
