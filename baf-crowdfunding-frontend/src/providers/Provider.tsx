import React, { createContext, useContext, useState, useEffect } from "react";
import type { ICampaign } from "../interfaces/campaign.interface";

interface AppContextProps {
  currentAccount: string;
  setCurrentAccount: React.Dispatch<React.SetStateAction<string>>;
  hashId: string;
  setHashId: React.Dispatch<React.SetStateAction<string>>;
  campaigns: ICampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<ICampaign[]>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useProvider must be used within a Provider");
  }
  return context;
};

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [hashId, setHashId] = useState<string>("");
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("wallet");
    const savedCampaigns = localStorage.getItem("campaigns");

    if (savedAddress) {
      setCurrentAccount(savedAddress);
    }

    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  return (
    <AppContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
        hashId,
        setHashId,
        campaigns,
        setCampaigns,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
