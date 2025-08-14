import useModal from "../hooks/useModal";
import Modal from "./Modal";
import CreateCampaign from "./CreateCampaign";
import Button from "./Button";
import { stellarService } from "../service/stellar.service";
import type { ICrowdfundingContract } from "../interfaces/contract.interface";
import type { ICampaign } from "../interfaces/campaign.interface";
import { walletService } from "../service/wallet.service";
import { useProvider } from "../providers/Provider";
import type { CampaignForm } from "./CreateCampaign";

function AddCampaign() {
  const { currentAccount, setCampaigns, setHashId } = useProvider();
  const { showModal, openModal, closeModal } = useModal();

  const handleCreateCampaign = async (campaignData: CampaignForm) => {
    try {
      const contractClient =
        await stellarService.buildClient<ICrowdfundingContract>(currentAccount);

      // Convert the new campaign format to the contract format
      const xdr = (
        await contractClient.create_campaign({
          creator: currentAccount,
          goal: campaignData.goal,
          min_donation: campaignData.minDonation
        })
      ).toXDR();

      const signedTx = await walletService.signTransaction(xdr);
      const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);

      // Create campaign object for local state
      const newCampaign: ICampaign = {
        creator: currentAccount,
        goal: campaignData.goal,
        min_donation: campaignData.minDonation,
        total_raised: 0,
        supporters: 0,
      };

      setCampaigns((prevCampaigns) => [...prevCampaigns, newCampaign]);
      setHashId(hashId);
      closeModal();
    } catch (error) {
      console.error('Error creating campaign:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button name="Add Campaign" color="blue" handleOnClick={openModal} />
      </div>
      {showModal && (
        <Modal title="Create Campaign" closeModal={closeModal}>
          <CreateCampaign
            onClose={closeModal}
            onSubmit={handleCreateCampaign}
          />
        </Modal>
      )}
    </>
  );
}

export default AddCampaign;
