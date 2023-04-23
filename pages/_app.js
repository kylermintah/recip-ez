import "@/styles/globals.css";
import { RouterDataProvider } from "./context/RouterDataContext";

export default function App({ Component, pageProps }) {
  return (
    <RouterDataProvider>
      <Component {...pageProps} />
    </RouterDataProvider>
  );
}
