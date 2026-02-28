import { type IconProps } from "@/types/icon";
import Spinner from "./Spinner";

export default function Icon({ spinner, className = "h-5 w-5" }: IconProps) {
  if (spinner) {
    return <Spinner className={className} />;
  }

  return null;
}

export { Spinner };
