pragma solidity ^0.4.24;

contract TicTacToe {

	struct Game {
		uint8[9] board;
		address player1;
		address player2;
	}

	uint public gameCounter;
	mapping (uint => Game) public games; 

	function newGame(address player2) public returns(uint) {
		// Creates a new game with player1 set to msg.sender	

		gameCounter++;

		uint8[9] memory newBoard;

		games[gameCounter].board = newBoard; 
		games[gameCounter].player1 = msg.sender; 
		games[gameCounter].player2 = player2;

		return gameCounter;
	}

	function getPlayers(uint game) public view returns (address, address) {
		return (games[game].player1, games[game].player2);
	}

	function getBoard(uint game) public view returns (uint8[9]) {
		return games[game].board;
	}

	function _freeSpace(uint8[9] board, uint8 space) internal view returns (bool) {
		// Check if the space is free
		return (board[space] == 0);
	}

	function _countSpaces(uint8[9] board) internal view returns (uint8) {
		// Count the number of filled spaces on the board
		uint8 _n = 0;
		for (uint8 i = 0; i < 9; i++) {
			if (!_freeSpace(board, i)) {
				_n++;
			}
		}
		return _n;
	}

	function _activePlayer(uint8[9] board) internal view returns (uint8) {
		// Compute the active player by counting how many spaces on the board have been filled
		if (_countSpaces(board) % 2 == 0) {
			return 1;
		}
		return 2;
	}

	function _allTheSame(uint8[9] board, uint8[3] _triple) internal view returns (bool) {
		return (board[_triple[0]] == board[_triple[1]] && board[_triple[1]] == board[_triple[2]]);
	}

	function _checkForVictory(uint8[9] board) internal view returns (uint8) {
		uint8[3][8] memory triples = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
			           	      [0, 3, 6], [1, 4, 7], [2, 5, 8],
			                      [0, 4, 8], [2, 4, 6]];
		for (uint8 i = 0; i < 8; i++) {
			if (_allTheSame(board, triples[i])) {
				uint8 _winner = board[triples[i][0]];
				return _winner;
			}
		}
	}

	function move(uint game, uint8 x, uint8 y) public {
		// takes values of x and y between 0 and 2
		uint8[9] memory board = getBoard(game);
		require(_checkForVictory(board) != 1, "Player 1 has won the game.");  // Using two requires here because formating strings is a pain
		require(_checkForVictory(board) != 2, "Player 2 has won the game.");  // and I want a nice error message when someone wins.
		require(_countSpaces(board) < 9, "There are no more moves. The game is a draw.");
		require(0 <= x && x <= 2, "x value must be between 0 and 2");
		require(0 <= y && y <= 2, "y value must be between 0 and 2");
		if (_activePlayer(board) == 1) {require(msg.sender == games[game].player1, "It's not your turn!");}
		if (_activePlayer(board) == 2) {require(msg.sender == games[game].player2, "It's not your turn!");}
		uint8 space = x + (3 * y);
		require(_freeSpace(board, space), "That space is already taken!");
		games[game].board[space] = _activePlayer(games[game].board);
	}
}
