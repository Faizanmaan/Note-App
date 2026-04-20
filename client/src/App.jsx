import "./App.scss";
import Routes from "@/pages/Routes";
import { useAuth } from "./context/Auth";
import { SocketProvider } from "./context/SocketContext";
import ScreenLoder from "./components/ScreenLoder";

function App() {
  const { isAppLoading } = useAuth();

  return (
    <>
      <SocketProvider>
        {!isAppLoading ? <Routes /> : <ScreenLoder />}
      </SocketProvider>
    </>
  );
}

export default App;
