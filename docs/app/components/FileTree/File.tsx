import { FileProps } from "./type";

export default function File(props: FileProps) {
  const { file } = props;

  const [name, path] = [file.getName(), file.getPath()];

  function handleClick(e: React.MouseEvent) {
    file.onClick(e);
  }

  return (
    <div
      data-path={path}
      className="text-sm leading-loose"
      onClick={handleClick}
    >
      {name}
    </div>
  );
}
