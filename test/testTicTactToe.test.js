const TicTacToe = artifacts.require("./TicTacToe.sol");

contract.only("TicTacToe", ([player1, player2]) => {
  let ticTacToe;

  beforeEach(async () => {
    ticTacToe = await TicTacToe.new();
  });

describe("#newGame", () => {
    it("creates a new game with player1 set to msg sender", async () => {
      await ticTacToe.newGame(player2, { from: player1 })

      const gameId = await ticTacToe.gameCounter()
      const players = await ticTacToe.getPlayers(gameId.toNumber())

      assert.equal(players[0], player1, 'first player is the msg sender')
    });
  });
});