const CustomerInformation = artifacts.require("CustomerInformation");

module.exports = function(deployer) {
  deployer.deploy(CustomerInformation);
};
