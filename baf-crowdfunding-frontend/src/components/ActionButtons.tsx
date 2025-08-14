import useModal from "../hooks/useModal";
import type { ICrowdfundingContract } from "../interfaces/contract.interface";
import { useProvider } from "../providers/Provider";
import { stellarService } from "../service/stellar.service";
import { walletService } from "../service/wallet.service";
import { creators } from "../utils/constants";
import AddContribute from "./AddContribute";
import Button from "./Button";
import Modal from "./Modal";

interface IAddCampaignProps {
  campaignAddress: string;
}

function ActionButtons({ campaignAddress }: IAddCampaignProps) {
  const { showModal, openModal, closeModal } = useModal();
  const { currentAccount, setCampaigns, setHashId } = useProvider();

  const handleAddContribute = async (amount: number) => {
    const contractClient =
      await stellarService.buildClient<ICrowdfundingContract>(currentAccount);

    const xdr = (
      await contractClient.contribute({
        contributor: currentAccount,
        campaign_address: campaignAddress,
        amount,
      })
    ).toXDR();

    const signedTx = await walletService.signTransaction(xdr);

    const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);

    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((camp) =>
        camp.creator === campaignAddress
          ? {
              ...camp,
              supporters: camp.supporters + 1,
              total_raised: camp.total_raised + amount,
            }
          : camp
      )
    );
    setHashId(hashId);
    closeModal();
  };

  const handleRefund = async () => {
    const contractClient =
      await stellarService.buildClient<ICrowdfundingContract>(currentAccount);

    const xdr = (
      await contractClient.refund({
        contributor: currentAccount,
        campaign_address: campaignAddress,
      })
    ).toXDR();

    const signedTx = await walletService.signTransaction(xdr);

    const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);

    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.creator === campaignAddress
          ? {
              ...campaign,
              supporters: Math.max(campaign.supporters - 1, 0),
              total_raised: 0,
            }
          : campaign
      )
    );
    setHashId(hashId);
  };

  const handleWithdraw = async () => {
    const contractClient =
      await stellarService.buildClient<ICrowdfundingContract>(campaignAddress);

    const secretKey = creators.find(
      (creator) => creator.publicKey === campaignAddress
    )?.secretKey;

    if (!secretKey) {
      alert("Secret key not found");
      return;
    }

    const xdr = (
      await contractClient.withdraw({
        creator: campaignAddress,
      })
    ).toXDR();

    const signedTx = await stellarService.signTransaction(xdr, secretKey);
    const hashId = await stellarService.submitTransaction(signedTx);

    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((camp) => camp.creator !== campaignAddress)
    );
    setHashId(hashId);
  };

  return (
    <>
      <Button name="Contribute" color="green" handleOnClick={openModal} />
      <Button name="Withdraw" color="yellow" handleOnClick={handleWithdraw} />
      <Button name="Refund" color="orange" handleOnClick={handleRefund} />
      {showModal && (
        <Modal title="Create Campaign" closeModal={closeModal}>
          <AddContribute
            onContribute={handleAddContribute}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </>
  );
}

export default ActionButtons;
