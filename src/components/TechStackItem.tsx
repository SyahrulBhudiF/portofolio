import type React from "react";

interface Props {
	tech: string;
	size: "small" | "medium" | "large";
}

const TechStackItem: React.FC<Props> = ({ tech, size }) => {
	const sizeClasses = {
		small: "px-2 py-1 text-sm",
		medium: "px-4 py-2 text-base md:text-xl",
		large: "px-6 py-3 text-lg lg:text-2xl",
	};

	const iconSizeClasses = {
		small: "w-6 h-6",
		medium: "w-6 h-6 md:w-8 md:h-8",
		large: "w-6 h-6 lg:w-10 lg:h-10",
	};

	return (
		<div
			className={`retro-tech-block relative m-2 flex justify-center items-center gap-1 text-white border-2 border-purple-700/30 rounded-lg cursor-pointer overflow-hidden bg-purple-900/20 ${sizeClasses[size]}`}
		>
			<div className="retro-block-inner flex items-center justify-center gap-2">
				<div className="relative block mr-1">
					<img
						src={`/assets/icon/${tech.toLowerCase()}.svg`}
						alt={tech}
						loading="lazy"
						className={`${iconSizeClasses[size]} brightness-150`}
					/>
				</div>
				<p className="text-purple-200">{tech}</p>
			</div>
		</div>
	);
};

export default TechStackItem;
