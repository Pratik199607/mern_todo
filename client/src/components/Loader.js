import { RotatingLines } from "react-loader-spinner";
function Loader() {
	return (
		<div className="loader h-[60vh] flex justify-center items-center animate-pulse text-lg gap-3">
			<RotatingLines
				strokeColor="grey"
				strokeWidth="5"
				animationDuration="0.75"
				width="150"
				visible={true}
			/>
		</div>
	);
}

export default Loader;
