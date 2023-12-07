# sgen

[English](https://github.com/shaxutang/sgen#readme) | [简体中文](https://github.com/shaxutang/sgen/blob/main/README-zh.md)

一个简单的cli工具来生成项目

该项目是一个生成项目模板的工具。 它基于一组预定义的模板目录，允许用户选择和创建新项目。 该工具提供交互式提示，供用户输入项目名称、目标目录等信息并选择模板。

## 安装

```bash
npm install -g @vcee/sgen
```

## 使用

```bash
$ sgen -h
Usage: sgen [options] [command] [template]

Arguments:
  template                  directory name under the .sgen directory

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  create [template] [name]  select a template to create a new project
  init                      init a .sgen dir
  config <action> [option]  change ~/user/.sgenrc
```

## 根据模板创建项目

```bash
sgen create [模板名称] [项目名
```

### options:

- `name`：项目名称，可选，默认使用当前目录名

- `template`：指定模板，可选，预置的目录名称/`.sgen/creator`下的目录名称/或指定的本地目录下的目录名称(.sgenrc)

## 根据模板生成代码

```bash
sgen [模板名称]
```

### arguments:

- 模板名称：可选，预置的目录名称/`.sgen/generator`下的目录名称/或指定的本地目录下的目录名称(.sgenrc)

### 模板编写规则

模板遵从[ejs](https://ejs.co/)的写法，你可以去官网了解更多。

模板中会提供预置的变量

- s：辅助函数，包括字符串驼峰转换 `s.changeCase.pascalCase(name)`，参考：[change-case](https://github.com/blakeembrey/change-case)
- sgenrc：配置内容

> [name].append.t：该文件为追加模式，在已有文件基础上追加内容，若没有则新建指定文件
> 例如：

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

> [name].add.t：该文件为新增模式，直接根据模板内容进行新增

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

> prompts.yml：该文件指定需要填写的字段，在执行 `sgen` 时，会提示用户输入这些字段，并将输入的值保存到模板预置的变量中

```yml
name:
  message: "你的组件名称是什么？"
classNamePrefix:
  message: "你的组件样式类名前缀是什么？"
```

终端将会显示：

```bash
? 你的组件类名前缀是什么？
button
? 你的组件样式类名前缀是什么？
sgen
```

输入的值最终会在解析模板时进行渲染，你可以在定义模板时使用`<%= name %>` 来获取

## 初始化

```bash
sgen init
```

该命令会在当前目录下创建一个`.sgen`文件夹。

该文件下包含:

- creator：自定义的项目模板存放目录
- generator: 自定义的代码模板存放的目录
- .sgenrc：配置文件，该问价中的配置会覆盖`~/user/.sgenrc`的配置。

## .sgenrc

环境变量

```typescript
type SgenrcOptions = {
  avatar: string;
  username: string;
  email: string;
  url: string;
  workspace: string;
  [prop: string]: any;
};
```

在模板文件中可以通过`<%= sgenrc.usrname %>`来获取

## 环境变量相关命令

```bash
sgen config list
sgen config set <key>=<value>
sgen config remove <key>
```
