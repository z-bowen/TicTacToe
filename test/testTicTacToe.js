const TicTacToe = artifacts.require("./TicTacToe.sol");

	contract.only("TicTacToe", ([player1, player2]) => {
		let ticTacToe;
 		beforeEach(async () => {
			ticTacToe = await TicTacToe.new();
 	});


	describe("#newGame", () => { //TODO: gameCounter still not updating...
		it("creates a new game with player1 set to msg sender", async () => {
			await ticTacToe.newGame(player2, { from: player1 })
			
			const gameId = await ticTacToe.gameCounter()
			const players = await ticTacToe.getPlayers(gameId.toNumber())
			const board = await ticTacToe.getBoard(gameId.toNumber())

			assert.equal(players[0], player1, 'player1 is msg.sender')
			assert.equal(players[1], player2, 'player2 is the address from the newGame() call')
			for (var space = 0; space < 9; space++) {
				assert.equal(board[space].toNumber(), 0, 'New games are created with an empty board.')
			}
		

		});
	});
	
	describe("#_checkForVictory", () => { //TODO: Test is failing because _checkForVictory is a private method. How to write unit tests for these?
		it("correctly detects a winning board", async () => {
			const noWin = await ticTacToe._checkForVictory([0,0,0,0,0,0,0,0,0])
			const p1Wins = await ticTacToe._checkForVictory([0,2,1,2,1,0,1,0,0])
			const p2Wins = await ticTacToe._checkForVictory([1,2,1,1,2,1,0,2,0])

			assert.equal(noWin, 0, 'This is a board with no winner')
			assert.equal(p1Wins, 1, 'player1 has won this game')
			assert.equal(p2Wins, 2, 'player2 has won this game')
		});
	});

	describe("#_countSpaces", () => { //TODO: Test is failing because _checkForVictory is a private method. How to write unit tests for these?
		it("counts the number of spaces filled", async () => {
			const emptyBoard = await ticTacToe._countSpaces([0,0,0,0,0,0,0,0,0])
			const partialBoard = await ticTacToe._countSpaces([0,0,1,0,2,0,0,0,1])
			const fullBoard = await ticTacToe._countSpaces([1,2,1,1,2,2,2,1,1])

			assert.equal(emptyBoard, 0, 'Expected 0 filled spaces with board [0,0,0,0,0,0,0,0,0]')
			assert.equal(partialBoard, 3, 'Expected 3 filled spaces with board [0,0,1,0,2,0,0,0,1]')
			assert.equal(fullBoard, 9, 'Expected 9 filled spaces with board [1,2,1,1,2,2,2,1,1]')
		})
	});

	describe("#_activePlayer", () => {//TODO: Test is failing because _checkForVictory is a private method. How to write unit tests for these?
		it("returns the active player from the board state", async () => {
			const player1ActiveBoard = await ticTacToe._activePlayer([0,0,1,2,0,0,0,0,0])
			const player2ActiveBoard = await ticTacToe._activePlayer([0,0,0,0,1,0,0,0,0])
		
			assert.equal(player1ActiveBoard, 1, 'player1 to move')
			assert.equal(player1ActiveBoard, 2, 'player2 to move')
		});
	});

	describe("#move", () => { // Throwing error: Error: VM Exception while processing transaction: revert
		it("only allows the active player to move", async () => {
			await ticTacToe.newGame(player2, { from: player1 })

			const gameId = await ticTacToe.gameCounter()

			await ticTacToe.move(gameId, 0, 0, { from: player1 })
			var board = await ticTacToe.getBoard(gameId.toNumber())
			assert.equal(board[0], 1)

			const err = await ticTacToe.move(gameId, 1, 1, {from: player1 })
			assert.equal(err, "It's not your turn!")

			await ticTacToe.move(gameId, 1, 1, { from: player2 })
			board = await ticTacToe.getBoard(gameId.toNumber())
			assert.equal(board[0], 2)
		});
	});

	//TODO: Need a test to make sure that users can't modify the board in any way other than through the move() method. How to test this?

}); 
