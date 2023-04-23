import { createContext, useContext, useState } from "react";

const RouterDataContext = createContext();

export function useRouterData() {
  return useContext(RouterDataContext);
}

export function RouterDataProvider({ children }) {
  const [routerData, setRouterData] = useState({});

  return (
    <RouterDataContext.Provider value={{ routerData, setRouterData }}>
      {children}
    </RouterDataContext.Provider>
  );
}

export default RouterDataContext;