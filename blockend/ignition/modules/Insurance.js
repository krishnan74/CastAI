const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const priceFeedAddress = "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e";

module.exports = buildModule("Insurance", (m) => {
  const _priceFeed = m.getParameter("priceFeedAddress", priceFeedAddress);

  const insurance = m.contract("Insurance", [_priceFeed]);

  return { insurance }; // Corrected to return the insurance contract instance
});
