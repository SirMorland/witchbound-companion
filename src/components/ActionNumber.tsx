import type { Action, Gift } from "../types/player";
import { Consumable } from "../components/Consumable";

import "./ActionNumber.css";

const ACTION_SCROLL = new URL("../assets/action.svg", import.meta.url).href;
const EYE_ICON = new URL("../assets/eye.svg", import.meta.url).href;
const HAND_ICON = new URL("../assets/hand.svg", import.meta.url).href;

function getIconUrl(icon?: string): string {
	if (icon === "eye.svg") return EYE_ICON;
	if (icon === "hand.svg") return HAND_ICON;
	return "";
}

function isGift(action: Action): action is Gift {
	return "quantity" in action;
}

interface ActionNumberProps {
	action: Action;
	onNumberChange?: (value: number | undefined) => void;
	onNameChange?: (value: string) => void;
	onQuantityChange?: (value: number) => void;
	/** Path to an icon to show instead of the name text input */
	icon?: "eye.svg" | "hand.svg";
}

export function ActionNumber({
	action,
	onNumberChange,
	onNameChange,
	onQuantityChange,
	icon,
}: ActionNumberProps) {
	return (
		<div className="action-number">
			<div className="action-number__scroll">
				<label>
					<img
						src={ACTION_SCROLL}
						alt=""
						className="action-number__scroll-img"
					/>
					<input
						type="number"
						value={action.number ?? ""}
						onChange={(e) => {
							if (!onNumberChange) return;

							const v = e.target.value;
							onNumberChange(v === "" ? undefined : Number(v));
						}}
						className="action-number__number"
						disabled={!onNumberChange}
					/>
				</label>
			</div>
			{icon ? (
				<img
					src={getIconUrl(icon)}
					alt={icon === "eye.svg" ? "Eye" : icon === "hand.svg" ? "Hand" : ""}
					className="action-number__icon"
				/>
			) : isGift(action) && onQuantityChange ? (
				<Consumable
					consumable={action}
					onNameChange={onNameChange}
					onQuantityChange={onQuantityChange}
				/>
			) : (
				<input
					type="text"
					value={action.name}
					onChange={(e) => {
						if (!onNameChange) return;
						onNameChange(e.target.value);
					}}
					disabled={!onNameChange}
				/>
			)}
		</div>
	);
}
