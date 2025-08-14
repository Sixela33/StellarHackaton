export const shortenAddress = (address: string) => {
  if (!address) return "";
  const first = address.slice(0, 5);
  const last = address.slice(-5);
  return `${first}...${last}`;
};
