const TicTacToe = artifacts.require("./contracts/TicTacToe");

module.exports = function (deployer) {
  deployer.deploy(TicTacToe);
};
