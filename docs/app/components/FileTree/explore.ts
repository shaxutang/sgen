export type Handler = Partial<{
  forceUpdate: () => void;
  onClick: (explore: Explore, e: React.MouseEvent) => void;
  onCreate: (explore: Explore) => void;
}>;

export class Context {
  private _forceUpdate?: () => void;
  private _onClick?: (explore: Explore, e: React.MouseEvent) => void;
  private _onCreate?: (explore: Explore) => void;

  constructor({ forceUpdate, onClick, onCreate }: Handler) {
    this._forceUpdate = forceUpdate;
    this._onClick = onClick;
    this._onCreate = onCreate;
  }

  forceUpdate() {
    this._forceUpdate?.();
  }

  onClick(explore: Explore, e: React.MouseEvent) {
    this._onClick?.(explore, e);
  }

  onCreate(explore: Explore) {
    this._onCreate?.(explore);
  }
}

abstract class BaseEntity {
  protected name: string;
  protected active: boolean = false;
  private context?: Context;
  protected parent?: FolderEntity;

  constructor(name: string) {
    this.name = name;
  }

  setActive(active: boolean) {
    this.active = active;
    this.notify();
  }

  getActive() {
    return this.active;
  }

  setParent(parent: FolderEntity) {
    this.parent = parent;
  }

  getParent() {
    return this.parent;
  }

  notify() {
    this.context?.forceUpdate?.();
  }

  setContext(context: Context) {
    this.context = context;
  }

  getContext(): Context | undefined {
    return this.context ?? this.parent?.getContext();
  }

  getName(): string {
    return this.name;
  }

  setName(newName: string) {
    this.name = newName;
    this.checkSameName(this as unknown as Explore);
    this.notify();
  }

  getPath(): string {
    const parent = this.getParent();
    const isRoot = parent?.isRoot();
    const path = isRoot ? "" : parent?.getPath();
    return [path, this.name].filter((name) => name !== undefined).join("/");
  }

  abstract checkSameName(explore: Explore): void;

  abstract getType(): string;

  abstract onClick(e: React.MouseEvent): void;
}

export class FileEntity extends BaseEntity {
  private content: string;
  private extension: string = "";
  private type: string = "file";

  constructor(name: string, content: string = "") {
    super(name);
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
    this.getContext()?.onClick?.(this, e);
  }

  checkSameName(explore: Explore) {
    this.parent?.checkSameName(explore);
  }
}

export class FolderEntity extends BaseEntity {
  private explores: Explore[] = [];
  private type: string = "directory";

  constructor(name: string, explores: Explore[] = [], context?: Context) {
    super(name);
    this.explores = explores.map((explore) => {
      explore.setParent(this);
      return explore;
    });
    context && this.setContext(context);
  }

  isRoot() {
    return this.getPath() === "/";
  }

  createFolder(folder: FolderEntity) {
    folder.setParent(this);
    this.checkSameName(folder);
    this.explores.push(folder);
    this.notify();
  }

  createFile(file: FileEntity) {
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
    this.getContext()?.onClick?.(this, e);
  }

  onCreate(explore: Explore) {
    this.getContext()?.onCreate?.(explore);
  }

  private generateNewName(baseName: string, extension?: string): string {
    const timestamp = new Date().getTime();
    return !!extension
      ? `${baseName.substring(
          0,
          baseName.lastIndexOf("."),
        )}-${timestamp}.${extension}`
      : `${baseName}-${timestamp}`;
  }

  checkSameName(explore: Explore) {
    const index = this.explores.findIndex(
      (ex) => ex.getName() === explore.getName(),
    );
    const currentName = explore.getName();
    if (index !== -1) {
      if (explore instanceof FileEntity) {
        explore.setName(
          this.generateNewName(currentName, explore.getExtension()),
        );
      }
      if (explore instanceof FolderEntity) {
        explore.setName(this.generateNewName(currentName));
      }
    }
  }
}

export type Explore = FileEntity | FolderEntity;
