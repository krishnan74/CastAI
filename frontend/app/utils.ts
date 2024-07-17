export const shortenAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const getConnectedAddressForUser = async (fid: number) => {
  const res = await fetch(
    `https://hub.pinata.cloud/v1/verificationsByFid?fid=${fid}`
  );
  const json = await res.json();
  const address = json.messages[0].data.verificationAddAddressBody.address;
  return address;
};

