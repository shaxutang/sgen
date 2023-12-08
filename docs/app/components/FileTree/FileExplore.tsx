import File from "./File";
import Folder from "./Folder";
import { Explore as ExploreEntity, FileEntity, FolderEntity } from "./explore";
import { FileExploreProps } from "./type";

function Explore({ explore }: { explore: ExploreEntity }) {
  const type = explore.getType();

  const isFile = type === "file";

  return (
    <>
      {isFile ? (
        <div className="explore">
          <File file={explore as FileEntity} />
        </div>
      ) : (
        <Folder folder={explore as FolderEntity} />
      )}
    </>
  );
}

export default function FileExplore({ explores = [] }: FileExploreProps) {
  return explores.map((explore) => (
    <Explore explore={explore} key={explore.getPath()} />
  ));
}
