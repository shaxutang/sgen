# sgen

[English](https://github.com/shaxutang/sgen#readme) | [简体中文](https://github.com/shaxutang/sgen/blob/main/README-zh.md)

一个简单的cli工具来生成项目

该项目是一个生成项目模板的工具。 它基于一组预定义的模板目录，允许用户选择和创建新项目。 该工具提供交互式提示，供用户选择模板。

## 安装

```bash
npm install -g @vcee/sgen
```

## 使用

```bash
$ sgen -h
Usage: sgen [options] [command]

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  create                    select a template to create a new project
  init                      init a .sgen dir
  config <action> [option]  change ~/user/.sgenrc
```

## 初始化

```bash
sgen init
```

该命令会在当前目录下创建一个`.sgen`文件夹。

该文件下包含:

- creator：自定义的项目模板存放目录，默认提供了一些常用的模板
- generator: 自定义的代码模板存放的目录，默认提供了一些常用的模板
- .sgenrc：配置文件，该问价中的配置会覆盖`~/user/.sgenrc`的配置。

## 请特别注意

> [!WARNING]
> 如果你使用默认的模板，那么你需要先在`~/user/.sgenrc`或者`{cwd}/.sgen/.sgenrc`设置环境变量`username`和`email`
>
> ```txt
> username=你的Gihub用户名
> email=你的邮箱
> ```
>
> 因为默认提供的模板中会使用到这两个变量
>
> ```json
> {
>   ...
>   "homepage": "https://github.com/<%= sgenrc.username %>/<%= name %>#readme",
>   "repository": {
>     "type": "git",
>     "url": "git+https://github.com/<%= sgenrc.username %>/<%= name %>.git"
>   },
>   "bugs": {
>     "url": "https://github.com/<%= sgenrc.username %>/<%= name %>/issues"
>   },
>   "author": "<%= sgenrc.username %> <<%= sgenrc.email%>>",
>   ...
> }
> ```
>
> 如果不提供会在创建时会发出警告
>
> 你可以执行
>
> ```bash
> sgen config init
> ```
>
> 这将会引导你设置一些必要的环境变量
>
> 也可以执行
>
> ```bash
> sgen config set username=你的Github用户名
> sgen config set email=你的邮箱
> ```

## 根据模板创建项目

你只需要在终端中执行`sgen create`指令，然后根据提示选择模板即可。

```bash
$ sgen create
? Please select a template. » - Use arrow-keys. Return to submit.
>   ✨ .sgen/tsup
    ✨ .sgen/tsup-react
    ✨ .sgen/vite-lib
    ✨ .sgen/vite-vue-ui
```

## 根据模板生成代码

你需要先在`.sgen/generator`目录下编写模板代码，然后执行`sgen`，然后根据提示选择模板即可。

```bash
$ sgen
? Please select a template to generate » - Use arrow-keys. Return to submit.
>   ✨ .sgen/tsup-react
    ✨ .sgen/vite-vue-ui
```

### 模板编写规则

模板遵从[ejs](https://ejs.co/)的写法，你可以去官网了解更多。

模板中会提供预置的变量

- s：辅助函数
  - changeCase：字符串驼峰转换 `s.changeCase.pascalCase(name)`，参考：[change-case](https://github.com/blakeembrey/change-case)
  - dayjs：日期库转换`s.dayjs().format('YYYY-MM-DD')`，参考：[dayjs](https://day.js.org/)
- sgenrc：配置内容

### [name].append.t：

该文件为追加模式，在已有文件基础上追加内容，若没有则新建指定文件
例如：

```txt
---
to: background/index.ts
pattern: // export component
---
export { default as <%= s.changeCase.pascalCase(name) %> } from "./components/<%= name %>";
```

`to`表示需要追加的文件名
`pattern`表示需要匹配的字符串，用于匹配文件内容，匹配成功则进行追加

你需要在`background/index.ts`下编写如下代码:

```typescript
// export component
```

在代码生成时会自动在该文本后面进行追加

### [name].add.t

该文件为新增模式，直接根据模板内容进行新增

```txt
---
to: background/components/<%= name %>/<%= name %>.tsx
---
import clsx from "clsx";
import { <%= s.changeCase.pascalCase(name) %>Props } from "./type";

export default function <%= s.changeCase.pascalCase(name) %>({ children, className, ...rest }: <%= s.changeCase.pascalCase(name) %>Props) {
  return (
    <div className={clsx("<%= classNamePrefix %>-<%= name %>", className)} {...rest}>
      {children}
    </div>
  );
}
```

### 支持统一个文件编写多个模板

只需要在模板文件中添加分隔符`<!-- truncate -->`即可。

```txt
---
to: background/components/<%= name %>/<%= name %>.tsx
---
import clsx from "clsx";
import { <%= s.changeCase.pascalCase(name) %>Props } from "./type";

export default function <%= s.changeCase.pascalCase(name) %>({ children, className, ...rest }: <%= s.changeCase.pascalCase(name) %>Props) {
  return (
    <div className={clsx("<%= classNamePrefix %>-<%= name %>", className)} {...rest}>
      {children}
    </div>
  );
}


<!-- truncate -->

---
to: background/components/<%= name %>/<%= name %>.tsx
---
其他代码。。。。

```

### prompts.yml 或 prompts.yaml

该文件指定需要填写的字段，在执行 `sgen` 时，会提示用户输入这些字段，并将输入的值保存到模板预置的变量中

详细配置参考：https://github.com/terkelg/prompts#readme

```yml
name:
  type: "text"
  message: "你的组件类名前缀是什么？"
  initial: "my-component"
classNamePrefix:
  type: "text"
  message: "你的组件样式类名前缀是什么？"
```

终端将会显示：

```bash
? 你的组件类名前缀是什么？
button
? 你的组件样式类名前缀是什么？
sgen

# 最终你会得到 {name:"button",classNamePrefix:"sgen"}
```

输入的值最终会在解析模板时进行渲染，你可以在定义模板时使用`<%= name %>` 来获取

## .sgenrc

环境变量

```typescript
type SgenrcOptions = {
  // 头像 [可选项]
  avatar?: string;
  // Gihub用户名 [可选] 在初始化的模板中会使用到，如果你创建预设的模板则为[必填]
  username?: string;
  // 邮箱 [可选] 在初始化的模板中会使用到，如果你创建预设的模板则为[必填]
  email?: string;
  url?: string;
  // 本地工作空间 [可选]，当你指定目录后，`sgen`会在目录下寻找`creator`/`generator`目录
  workspace?: string;
  [prop: string]: any;
};
```

在模板文件中可以通过`<%= sgenrc.usrname %>`来获取

## 环境变量相关命令

```bash
# 显示所有环境变量
sgen config list
# 设置环境变量
sgen config set <key>=<value>
# 删除环境变量
sgen config remove <key>
```
