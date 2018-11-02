pragma solidity ^0.4.24;

contract TicTacToe {

	struct Game {
		uint8[9] board;
		address player1;
		address player2;
	}

	Game[] public games;

	function newGame(address player2) public returns(uint) {
		// Creates a new game with player1 set to msg.sender
		
		address player1 = msg.sender;
		uint8[9] memory newBoard;

		Game memory game = Game(newBoard, player1, player2);
		uint id = games.push(game) - 1;

		return(id);
	}

	function getGame(uint id) public view returns (address, address) {
		return (games[id].player1, games[id].player2);
	}

	function _freeSpace(uint id, uint8 space) internal view returns (bool) {
		// Check if the space is free
		return (games[id].board[space] != 0);
	}

	function _spacesFilled(uint id) internal view returns (uint8) {
		// Count the number of filled spaces on the board
		uint8 _n = 0;
		for (uint8 i = 0; i < 9; i++) {
			if (!_freeSpace(id, i)) {
				_n++;
			}
		}
	}

	function _activePlayer(uint id) internal view returns (uint8) {
		// Compute the active player by counting how many spaces on the board have been filled
		if (_spacesFilled(id) % 2 == 0) {
			return 1;
		}
		return 2;
	}

	function _allTheSame(uint id, uint8[3] _triple) internal view returns (bool) {
		return (games[id].board[_triple[0]] == games[id].board[_triple[1]] && games[id].board[_triple[1]] == games[id].board[_triple[2]]);
	}

	function _checkForVictory(uint id) internal view returns (address) {
		uint8[3][8] memory triples = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
			           	      [0, 3, 6], [1, 4, 7], [2, 5, 8],
			                      [0, 4, 8], [2, 4, 6]];
		for (uint8 i = 0; i < 8; i++) {
			if (_allTheSame(id, triples[i])) {
				uint8 _winner = games[id].board[triples[i][0]];
				if (_winner == 1) {
					return games[id].player1;
				}
				return games[id].player2;
			}
		}
	}

	function move(uint id, uint8 x, uint8 y) public {
		// takes values of x and y between 0 and 2
		require(_checkForVictory(id) != games[id].player1, "Player 1 has won the game.");  // Using two requires here because formating strings is a pain
		require(_checkForVictory(id) != games[id].player2, "Player 2 has won the game.");  // and I want a nice error message when someone wins.
		require(_spacesFilled(id) < 9, "There are no more moves. The game is a draw.");
		require(0 <= x && x <= 2, "x value must be between 0 and 2");
		require(0 <= y && y <= 2, "y value must be between 0 and 2");
		if (_activePlayer(id) == 1) {require(msg.sender == games[id].player1, "It's not your turn!");}
		if (_activePlayer(id) == 2) {require(msg.sender == games[id].player2, "It's not your turn!");}
		uint8 space = (3 * x) + y;
		require(_freeSpace(id, space), "That space is already taken!");
		games[id].board[space] = _activePlayer(id);
	}

	function viewBoard(uint id) public view returns (uint8[9]) {
		return games[id].board;
	}
}
