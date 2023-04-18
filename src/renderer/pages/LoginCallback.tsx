import { useSearchParams } from "react-router-dom";
export default function LoginCallback() {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	return <div>{code}</div>;
}
