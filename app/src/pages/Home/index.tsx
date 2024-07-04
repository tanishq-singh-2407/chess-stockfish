import { useState } from "preact/hooks";
import "./style.css";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";

export function Home() {
	const [game, setGame] = useState(new Chess());

	function onDrop(from: Square, to: Square) {
		try {
			const gameCopy = new Chess(game.fen());
			const result = gameCopy.move({ from, to, promotion: "q" });
	
			setGame(gameCopy);

			if (result) {
				new Promise(async () => {
					const move = await fetch(
						"https://chess-stockfish-yokuioanna-el.a.run.app/gen_move",
						{
							method: "POST",
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ fen: gameCopy.fen()})
						}
					);

					const { fen } = await move.json() as { fen: string };

					setGame(new Chess(fen));
				});
			}

			return result ? true : false;
		} catch (error) {
			return false;
		}
	}

	return (
		<Chessboard
			position={game.fen()}
			boardWidth={324}
			onPieceDrop={onDrop}
		/>
	);
}
