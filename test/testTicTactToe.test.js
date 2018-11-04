const TicTacToe = artifacts.require("./TicTacToe.sol");

contract("TicTacToe", ([player1, player2]) => {
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

      it("gives each game a new id", async () => {
        // game 1
        await ticTacToe.newGame(player2, { from: player1 })
        const gameId = await ticTacToe.gameCounter()
        let players = await ticTacToe.getPlayers(gameId.toNumber())

        assert.equal(gameId, 1, "first game");
        assert.equal(players[0], player1, "first player is the msg sender");

        // game 2
        await ticTacToe.newGame(player1, { from: player2 })
        const gameId2 = await ticTacToe.gameCounter()
        players = await ticTacToe.getPlayers(gameId2.toNumber());

        assert.equal(gameId2, 2, "first game");
        assert.equal(players[0], player2, "first player is the msg sender");
      });
  });
});