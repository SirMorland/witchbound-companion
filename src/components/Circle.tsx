import "./Circle.css";

const SMUDGE = new URL("../assets/smudge.svg", import.meta.url).href;

interface CircleProps {
	/** Whether the circle represents an active toggle */
	checked?: boolean;
}

export function Circle(
	props: CircleProps & React.HTMLAttributes<HTMLSpanElement>,
) {
	const { checked, ...rest } = props;
	return (
		<span className="circle" {...rest}>
			{checked && <img src={SMUDGE} />}
		</span>
	);
}
