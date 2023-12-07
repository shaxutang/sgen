# sgen

[English](https://github.com/shaxutang/sgen#readme) | [简体中文](https://github.com/shaxutang/sgen/blob/main/README-zh.md)

A simple cli tool to generate projects

This project is a tool that generates project generator. It is based on a set of predefined template directories that allow users to select and create new projects. The tool provides interactive prompts for users to enter information such as project name, target directory, and select a template.

## Install

```bash
npm install -g @vcee/sgen
```

## Usage

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

## Create a project based on a template

```bash
sgen create [template] [name]
```

### arguments:

- `name`: project name, optional, the current directory name is used by default

- `template`: Specify template, optional, preset directory name/directory name under `.sgen/creator`/or directory name under the specified local directory (.sgenrc)

## Generate code based on template

```bash
sgen [template]
```

### arguments:

- `template`: optional, the preset directory name/directory name under `.sgen/generator`/or the directory name under the specified local directory (.sgenrc)

### Template writing rules

The template follows the writing method of [ejs](https://ejs.co/). You can go to the official website to learn more.

Preset variables are provided in the template

- s: Auxiliary function, including string camel case conversion `s.changeCase.pascalCase(name)`, reference: [change-case](https://github.com/blakeembrey/change-case)
- sgenrc: configuration content

> [name].append.t: This file is in append mode, appending content to the existing file. If there is no existing file, create a new specified file.
> For example:

```txt
---
to: background/index.ts
pattern: // export component
---
export { default as <%= s.changeCase.pascalCase(name) %> } from "./components/<%= name %>";
```

`to` indicates the file name to be appended
`pattern` represents the string that needs to be matched. It is used to match the file content. If the match is successful, it will be appended.

You need to write the following code under `background/index.ts`:

```typescript
//export component
```

This text will be automatically appended when the code is generated.

> [name].add.t: This file is in new mode and is added directly based on the template content.

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

> prompts.yml：This file specifies the fields that need to be filled in. When executing `sgen`, the user will be prompted to enter these fields and the entered values will be saved to the variables preset in the template.

```yml
name:
  message: "What is your component name?"
classNamePrefix:
  message: "What is your component class name prefix?"
```

The terminal will display：

```bash
? What is your component name?
button
? What is your component class name prefix?
sgen
```

The entered value will eventually be rendered when parsing the template. You can get it by using `<%= name %>` when defining the template.

## Initialization

```bash
sgen init
```

This command will create a `.sgen` folder in the current directory.

This file contains:

- creator: Customized project template storage directory
- generator: directory where customized code generator are stored
- .sgenrc: Configuration file, the configuration in this request will overwrite the configuration of `~/user/.sgenrc`.

## .sgenrc

env variables

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

It can be obtained through `<%= sgenrc.usrname %>` in the template file.

## Env operation command

```bash
sgen config list
sgen config set <key>=<value>
sgen config remove <key>
```
