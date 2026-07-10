import { Circle } from "./Circle";
import "./CircleSelector.css";

interface CircleSelectorProps {
	value: number;
	max: number;
	onChange: (value: number) => void;
}

export function CircleSelector({ value, max, onChange }: CircleSelectorProps) {
	const handleClick = (i: number) => {
		if (i < value) {
			onChange(i);
		} else {
			onChange(i + 1);
		}
	};

	return (
		<div className="circle-selector">
			<div className="circle-selector__circles">
				{Array.from({ length: max }, (_, i) => (
					<Circle
						key={i}
						checked={i < value}
						onClick={() => handleClick(i)}
						style={{ cursor: "pointer" }}
					/>
				))}
			</div>
		</div>
	);
}
