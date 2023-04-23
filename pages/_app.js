import "@/styles/globals.css";
import { RouterDataProvider } from "./api/context/RouterDataContext";

export default function App({ Component, pageProps }) {
  return (
    <RouterDataProvider>
      <Component {...pageProps} />
    </RouterDataProvider>
  );
}
