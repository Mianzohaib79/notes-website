
import './App.scss'
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { ConfigProvider } from 'antd';

import Routes from "./pages/Routes"
import ScreenLoader from './components/Misc/ScreenLoader';
import { useAuth } from './context/Auth';

const App = () => {

  const { isAppLoading } = useAuth()

  // console.log(isAppLoading)

  return (
    <>
      <ConfigProvider theme={{ token: { colorPrimary: "#0969da", colorText: "#24292f", colorPrimaryHover: "#0353a4" }, components: { Button: { controlOutlineWidth: 0, borderRadius: 6 } } }}>

        {!isAppLoading
          ? <Routes />
          :
          <ScreenLoader />
        }
      </ConfigProvider>
    </>
  )
}

export default App
