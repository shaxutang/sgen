export type Handler = Partial<{
  forceUpdate: () => void;
  onClick: (explore: Explore, e: React.MouseEvent) => void;
  onCreate: (explore: Explore) => void;
}>;

export abstract class CommonEntity {
  protected name: string;
  protected path: string;
  protected handler?: Handler;
  protected parent?: FolderEntity;

  constructor(name: string, handler?: Handler) {
    this.name = name;
    this.path = `/${this.name}`;
    this.handler = handler;
  }

  setParent(parent: FolderEntity) {
    this.parent = parent;
    this.path = `${parent.getPath()}/${this.name}`;
    this.handler = this.handler ?? parent.getHandler();
  }

  getParent() {
    return this.parent;
  }

  notify() {
    this.handler?.forceUpdate?.();
  }

  setHandler(handler?: Handler) {
    this.handler = handler;
    this.notify();
  }

  getHandler() {
    return this.handler;
  }

  getName(): string {
    return this.name;
  }

  setName(newName: string) {
    this.name = newName;
    this.path = `${this.path.replace(this.name, "")}/${newName}`;
    this.notify();
  }

  getPath(): string {
    return this.path;
  }

  setPath(newPath: string) {
    this.path = newPath;
    this.notify();
  }

  getType(): string {
    return "";
  }

  abstract onClick(e: React.MouseEvent): void;
}

export class FileEntity extends CommonEntity {
  private content: string;
  private extension: string = "";
  private type: string = "file";

  constructor(name: string, content: string = "", handler?: Handler) {
    super(name, handler);
    this.content = content;
    this.reGenerateExtension();
  }

  reGenerateExtension() {
    if (this.name.lastIndexOf(".") !== -1)
      this.extension = this.name.substring(this.name.lastIndexOf(".") + 1);
  }

  getContent(): string {
    return this.content;
  }

  setContent(newContent: string) {
    this.content = newContent;
    this.notify();
  }

  getExtension() {
    return this.extension;
  }

  getType() {
    return this.type;
  }

  onClick(e: React.MouseEvent) {
    this.handler?.onClick?.(this, e);
  }
}

export class FolderEntity extends CommonEntity {
  private explores: Explore[] = [];
  private type: string = "directory";

  constructor(name: string, explores: Explore[] = [], handler?: Handler) {
    super(name, handler);
    this.explores = explores.map((explore) => {
      explore.setParent(this);
      return explore;
    });
  }

  isRoot() {
    return this.path === "/";
  }

  createFolder(folder: FolderEntity) {
    folder.setHandler(this.handler);
    folder.setParent(this);
    this.checkSameName(folder);
    this.explores.push(folder);
    this.notify();
  }

  createFile(file: FileEntity) {
    file.setHandler(this.handler);
    file.setParent(this);
    this.checkSameName(file);
    this.explores.push(file);
    this.notify();
  }

  setExplores(newExplores: Explore[]) {
    this.explores = newExplores;
    this.notify();
  }

  getExplores() {
    return this.explores;
  }

  getType() {
    return this.type;
  }

  onClick(e: React.MouseEvent) {
    this.handler?.onClick?.(this, e);
  }

  onCreate(explore: Explore) {
    this.handler?.onCreate?.(explore);
  }

  private checkSameName(explore: Explore) {
    const index = this.explores.findIndex(
      (ex) => ex.getName() === explore.getName(),
    );
    if (index !== -1) {
      const currentName = explore.getName();
      if (explore instanceof FileEntity) {
        const entension = explore.getExtension();
        explore.setName(
          !!entension
            ? `${currentName.substring(
                0,
                currentName.lastIndexOf("."),
              )}-${new Date().getTime()}.${explore.getExtension()}`
            : `${currentName}-${new Date().getTime()}`,
        );
      }
      if (explore instanceof FolderEntity)
        explore.setName(`${currentName}-${new Date().getTime()}`);
      explore.setPath(`${this.path}/${explore.getName()}`);
    }
  }
}

export type Explore = FileEntity | FolderEntity;
