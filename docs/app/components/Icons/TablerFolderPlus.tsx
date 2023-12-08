import { SVGProps } from "react";

export function TablerFolderPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19H5a2 2 0 01-2-2V6a2 2 0 012-2h4l3 3h7a2 2 0 012 2v3.5M16 19h6m-3-3v6"
      />
    </svg>
  );
}
export default TablerFolderPlus;
