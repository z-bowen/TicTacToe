const TicTacToe = artifacts.require("./contracts/TicTacToe");

// async function doDeploy(deployer) {
//   await deployer.deploy(Assert);
//   await deployer.deploy(DeployedAddresses);
//   await deployer.link(Assert, testTicTacToe);
//   await deployer.link(DeployedAddresses, testTicTacToe);
//   await deployer.deploy(testTicTacToe);
// }


module.exports = function (deployer) {
  deployer.deploy(TicTacToe);
};
