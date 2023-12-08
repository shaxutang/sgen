# sgen

[English](https://github.com/shaxutang/sgen#readme) | [简体中文](https://github.com/shaxutang/sgen/blob/main/README-zh.md)

A simple cli tool to generate projects

This project is a tool that generates project templates. It is based on a set of predefined template directories that allow users to select and create new projects. The tool provides interactive prompts for users to select templates.

## Install

```bash
npm install -g @vcee/sgen
```

## Usage

```bash
$ sgen -h
Usage: sgen [options] [command]

Options:
   -V, --version output the version number
   -h, --help display help for command

Commands:
   create select a template to create a new project
   init init a .sgen dir
   config <action> [option] change ~/user/.sgenrc
```

## Initialization

```bash
sgen init
```

This command will create a `.sgen` folder in the current directory.

This file contains:

- creator: Customized project template storage directory, some commonly used templates are provided by default
- generator: The directory where customized code templates are stored. Some commonly used templates are provided by default.
- .sgenrc: Configuration file, the configuration in this request will overwrite the configuration of `~/user/.sgenrc`.

## Please pay special attention

> [!WARNING]
> If you use the default template, then you need to set the environment variables `username` and `password` in `~/user/.sgenrc` or `{cwd}/.sgen/.sgenrc` first
>
> ```txt
> username=your Gihub username
> email=your email
> ```
>
> Because these two variables are used in the template provided by default
>
> ```json
> {
>   ...
>   "homepage": "https://github.com/<%= sgenrc.username %>/<%= name %>#readme",
>   "repository": {
>   "type": "git",
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
> If not provided, a warning will be issued when creating
>
> You can execute
>
> ```bash
> sgen config init
> ```
>
> This will guide you through setting some necessary environment variables.
>
> You can also execute
>
> ```bash
> sgen config set username=your Github username
> sgen config set email=your email
> ```

## Create a project based on a template

You only need to execute the `sgen create` command in the terminal, and then select a template according to the prompts.

```bash
$ sgen create
? Please select a template. » - Use arrow-keys. Return to submit.
   > ✨ .sgen/tsup
     ✨ .sgen/tsup-react
     ✨ .sgen/vite-lib
     ✨ .sgen/vite-vue-ui
```

## Generate code based on template

You need to first write the template code in the `.sgen/generator` directory, then execute `sgen`, and then select the template according to the prompts.

```bash
$ sgen
? Please select a template to generate » - Use arrow-keys. Return to submit.
   > ✨ .sgen/tsup-react
     ✨ .sgen/vite-vue-ui
```

### Template writing rules

The template follows the writing method of [ejs](https://ejs.co/). You can go to the official website to learn more.

Preset variables are provided in the template

- s: Auxiliary function, including string camel case conversion `s.changeCase.pascalCase(name)`, reference: [change-case](https://github.com/blakeembrey/change-case)
- sgenrc: configuration content

### [name].append.t：

This file is in append mode, appending content to the existing file. If it does not exist, create a new specified file.
For example:

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

### [name].add.t

This file is in new mode and is added directly based on the template content.

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

### Support writing multiple templates in the same file

Just add the separator `<!-- sgen seperator -->` in the template file.

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


<!-- sgen seperator -->

---
to: background/components/<%= name %>/<%= name %>.tsx
---
other codes. . . .

```

### prompts.yml or prompts.yaml

This file specifies the fields that need to be filled in. When executing `sgen`, the user will be prompted to enter these fields and the entered values will be saved to the variables preset in the template.

Detailed configuration reference: https://github.com/terkelg/prompts#readme

```yml
name:
  type: "text"
  message: "What is the prefix of your component class name?"
  initial: "my-component"
classNamePrefix:
  type: "text"
  message: "What is the prefix of your component style class name?"
```

The terminal will display:

```bash
? What is the prefix of your component class name?
button
? What is the prefix of your component style class name?
sgen

# Eventually you will get {name:"button",classNamePrefix:"sgen"}
```

The entered value will eventually be rendered when parsing the template. You can get it by using `<%= name %>` when defining the template.

## .sgenrc

environment variables

```typescript
type SgenrcOptions = {
  // Avatar [optional]
  avatar?: string;
  // Gihub username [optional] will be used in the initialized template, if you create a default template it is [required]
  username?: string;
  // Email [optional] will be used in the initialized template, if you create a default template it is [required]
  email?: string;
  url?: string;
  // Local workspace [optional], when you specify the directory, `sgen` will look for the `creator`/`generator` directory in the directory
  workspace?: string;
  [prop: string]: any;
};
```

It can be obtained through `<%= sgenrc.usrname %>` in the template file.

## Environment variable related commands

```bash
# Show all environment variables
sgen config list
# Set environment variables
sgen config set <key>=<value>
# Delete environment variables
sgen config remove <key>
```
