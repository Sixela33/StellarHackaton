import StellarExpertLink from "./StellarExpertLink";
import { shortenAddress } from "../utils/shorten-address";
import AddCampaign from "./AddCampaign";
import ActionButtons from "./ActionButtons";
import { useProvider } from "../providers/Provider";

function CampaignTable() {
  const { campaigns, hashId } = useProvider();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6">
      <AddCampaign />
      <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Creator
            </th>
            <th scope="col" className="px-6 py-3">
              Goal
            </th>
            <th scope="col" className="px-6 py-3">
              Minimum Donation
            </th>
            <th scope="col" className="px-6 py-3">
              Total Raised
            </th>
            <th scope="col" className="px-6 py-3">
              Supporters
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr
              key={index}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {shortenAddress(campaign.creator)}
              </th>
              <td className="px-6 py-4">{campaign.goal}</td>
              <td className="px-6 py-4">{campaign.min_donation}</td>
              <td className="px-6 py-4">{campaign.total_raised}</td>
              <td className="px-6 py-4">{campaign.supporters}</td>
              <td className="px-6 py-4 space-x-2">
                <ActionButtons campaignAddress={campaign.creator} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hashId && <StellarExpertLink url={hashId} />}
    </div>
  );
}

export default CampaignTable;
