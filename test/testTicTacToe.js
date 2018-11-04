const TicTacToe = artifacts.require("./TestableTicTacToe.sol");

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
			const board = await ticTacToe.getBoard(gameId.toNumber())

			assert.equal(players[0], player1, 'player1 is msg.sender')
			assert.equal(players[1], player2, 'player2 is the address from the newGame() call')
			for (var space = 0; space < 9; space++) {
				assert.equal(board[space].toNumber(), 0, 'New games are created with an empty board.')
			}
		

		});

		it("updates the gameCounter", async () => {
			//create game 1
			await ticTacToe.newGame(player2, { from: player1 })
			const gameId1 = await ticTacToe.gameCounter()
			
			//create game 2
			await ticTacToe.newGame(player2, { from: player1 })
			const gameId2 = await ticTacToe.gameCounter()

			assert.equal(gameId1, 1, "First gameId is 1")
			assert.equal(gameId2, 2, "Second gameId is 2")
		});
	});
	
	describe("#_checkForVictory", () => {
		it("correctly detects a winning board", async () => {
			const noWin = await ticTacToe.test_checkForVictory.call([0,0,0,0,0,0,0,0,0])
			assert.equal(noWin, 0, 'This is a board with no winner')
		});

		it("correctly identifies when player1 has won", async () => {
			const p1Wins = await ticTacToe.test_checkForVictory.call([0,2,1,2,1,0,1,0,0])
			assert.equal(p1Wins, 1, 'player1 has won this game')
		});
		
		it("correctly identifies when player2 has won", async () => {
			const p2Wins = await ticTacToe.test_checkForVictory.call([1,2,1,1,2,1,0,2,0])
			assert.equal(p2Wins, 2, 'player2 has won this game')
		});
	});

	describe("#_countSpaces", () => {
		it("counts the number of spaces of an empty board", async () => {
			const emptyBoard = await ticTacToe.test_countSpaces.call([0,0,0,0,0,0,0,0,0])
			assert.equal(emptyBoard, 0, 'Expected 0 filled spaces with board [0,0,0,0,0,0,0,0,0]')
		});

		it("counts the number of spaces of a partly filled board", async () => {
			const partialBoard = await ticTacToe.test_countSpaces.call([0,0,1,0,2,0,0,0,1])
			assert.equal(partialBoard, 3, 'Expected 3 filled spaces with board [0,0,1,0,2,0,0,0,1]')
		});

		it("counts the number of spaces of a full board", async () => {
			const fullBoard = await ticTacToe.test_countSpaces.call([1,2,1,1,2,2,2,1,1])
			assert.equal(fullBoard, 9, 'Expected 9 filled spaces with board [1,2,1,1,2,2,2,1,1]')
		});
	});

	describe("#_activePlayer", () => {
		it("returns 1 when the board has an even number of filled spaces", async () => {
			const player1ActiveBoard = await ticTacToe.test_activePlayer.call([0,0,1,2,0,0,0,0,0])
			assert.equal(player1ActiveBoard, 1, 'player1 to move')
		});

		it("returns 2 when the board has an odd number of filled spaces", async () => {
			const player2ActiveBoard = await ticTacToe.test_activePlayer.call([0,0,0,0,1,0,0,0,0])
			assert.equal(player2ActiveBoard, 2, 'player2 to move')
		});
	});

	describe("#move", () => { // Throwing error: Error: VM Exception while processing transaction: revert
		it("allows player 1 to move on odd turns", async () => {
			await ticTacToe.newGame(player2, { from: player1 })

			const gameId = await ticTacToe.gameCounter()

			await ticTacToe.move(gameId, 0, 0, { from: player1 })
			var board = await ticTacToe.getBoard(gameId.toNumber())
			assert.equal(board[0], 1)
		});

		it("prohibits player 2 from moving on odd turns", async () => {
			await ticTacToe.newGame(player2, { from: player1})

			const gameId = await ticTacToe.gameCounter()

			const err = await ticTacToe.move(gameId, 0, 1, { from: player2 })
			console.log("ERR")
			console.log(err)
			assert.equal(err, "It's not your turn!")
		});

		it("allows player 2 to move on even turn", async () => {
			await ticTacToe.newGame(player2, { from: player1 })

                        const gameId = await ticTacToe.gameCounter()

			await ticTacToe.move(gameId, 0, 0, { from: player1 })
                        await ticTacToe.move(gameId, 1, 0, { from: player2 })

			const board = await ticTacToe.getBoard(gameId.toNumber())
			assert.equal(board[1].toNumber(), 2)
		});

		it("prohibits player 1 from moving on even turns", async () => {
                        await ticTacToe.newGame(player2, { from: player1 })

                        const gameId = await ticTacToe.gameCounter()
			
                        await ticTacToe.move(gameId, 0, 0, { from: player1 })
                        const err = await ticTacToe.move(gameId, 0, 1, { from: player1 })

			assert.equal(err, "It's not your turn!")
		});
	});

	//TODO: Need a test to make sure that users can't modify the board in any way other than through the move() method. How to test this?

}); 
