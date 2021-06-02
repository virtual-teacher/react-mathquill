## React MathQuill

This repository is a rough library with React MathQuill component, use it as a black-box for React + MathQuill editor.
Dev setup exists only for local development.

You can use it as a module by specifying tag version:
```
"@virtual-teacher/react-mathquill": "https://github.com/virtual-teacher/react-mathquill#v1.0.0"
```

To create new version:
- run `npm run build` and commit `/lib` directory,
- run `npm version <major | minor | patch>`, it will create tag and update `package.json` version,
- in app, point to updated tag in your `package.json` and run `npm update @virtual-teacher/react-mathquill`


