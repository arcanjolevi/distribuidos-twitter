import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Connector } from "mqtt-react-hooks";
import { MqttContextProvider } from "../contexts/MqttContext";
import { AuthContextProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <MqttContextProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </MqttContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
