pragma solidity ^0.4.24;

import './TicTacToe.sol';

contract TestableTicTacToe is TicTacToe {
	function test_checkForVictory (uint8[9] board) returns (uint8) {
		return _checkForVictory(board);
	}

	function test_countSpaces (uint8[9] board) returns (uint8) {
		return _countSpaces(board);
	}

	function test_activePlayer(uint8[9] board) returns (uint8) {
		return _activePlayer(board);
	}
}
