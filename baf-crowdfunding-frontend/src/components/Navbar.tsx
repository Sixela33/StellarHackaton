import { walletService } from "../service/wallet.service";
import Button from "./Button";
import { shortenAddress } from "../utils/shorten-address";
import { useProvider } from "../providers/Provider";

function Navbar() {
  const { currentAccount, setCurrentAccount } = useProvider();

  const handleConnectWallet = async () => {
    try {
      const address = await walletService.connect();
      console.log("Connected wallet address:", address);
      localStorage.setItem("wallet", address);
      setCurrentAccount(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Crowdfunding
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse ">
          <Button
            name={
              currentAccount ? shortenAddress(currentAccount) : "Connect Wallet"
            }
            color="blue"
            handleOnClick={handleConnectWallet}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
