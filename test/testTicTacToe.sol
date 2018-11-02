pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TicTacToe.sol";

contract testTicTacToe {
	
	function testNewGame() public {
		// Create a new game between msg.sender and p2

		TicTacToe ttt = TicTacToe(DeployedAddresses.TicTacToe());

		address p1 = msg.sender;
		address p2 = address(bytes32("player 2"));		

		uint id = ttt.newGame(p2);

		//uint8[] board;
		address player1;
		address player2;

		(player1, player2) = ttt.getGame(id);

		//check that the board is empty
		//Assert.equal(board, uint8[9], "New games should be created with an empty board state");
		//check p1 is msg.sender
		Assert.equal(player1, p1, "Player 1 should be msg.sender");
		// check p2 is the specified address
		Assert.equal(player2, p2, "Player 2 should be the address from the arguments");
	}

	//function testVictory() public pure {
		// Test _checkForVictory returns the winner with a winning board
	//}
	
	//function testNoVictory() public pure {
		// Test _checkForVictory returns False with an ongoing board
	//}

	//function testPlayerOneActive() public pure {
		// Test _activePlayer returns 1 with an even number of spaces filled
	//}

	//function testPlayer2Active() public pure {
		// Test _activePlayer returns 2 with an odd number of spacer filled
	//}

	//function testInactivePlayerMoves() public pure {
		// Test incative player sends move returns an error
	//}

	//function testActivePlayerMoves() public pure {
		// Test active player sends move modifies the board
	//}

	//function testBoardIsInternal() public pure {
		// Test players cannot modify the board except via move()
	//}

	//function testViewBoard() public pure {
		// Test viewBoard returns the board
	//}

}
