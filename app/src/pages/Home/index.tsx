import { useState } from "preact/hooks";
import "./style.css";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { ColorRing } from "react-loader-spinner";

export function Home() {
	const [game, setGame] = useState(new Chess());
	const [turn, setTurn] = useState<"human" | "ai">("human");

	function onDrop(from: Square, to: Square) {
		try {
			const gameCopy = new Chess(game.fen());
			const result = gameCopy.move({ from, to, promotion: "q" });
	
			setGame(gameCopy);

			if (result) {
				setTurn("ai");

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

					setTurn("human");
					setGame(new Chess(fen));
				});
			}

			return result ? true : false;
		} catch (error) {
			return false;
		}
	}

	return (
		<div>
			<div class="person">
				<span>AI</span>
				<div>
					<ColorRing
						visible={turn === "ai"}
						height="30"
						width="30"
						ariaLabel="color-ring-loading"
						wrapperStyle={{}}
						wrapperClass="color-ring-wrapper"
						colors={[
							"#e15b64",
							"#f47e60",
							"#f8b26a",
							"#abbd81",
							"#849b87",
						]}
					/>
				</div>
			</div>
			<Chessboard
				position={game.fen()}
				boardWidth={324}
				onPieceDrop={onDrop}
			/>
			<div class="person">
				<span>
					YOU {turn === "human" && (<i>(your turn)</i>)}
				</span>
			</div>
		</div>
	);
}
