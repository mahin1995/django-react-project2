#### go to frontend app and run
```
npm init -y
```
#### then
```
npm i webpack webpack-cli --save-dev
```
#### then
```
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```
#### then
```
npm install @babel/plugin-proposal-class-properties
```
#### then go packge.json file add to script
`{
        "dev": "webpack --mode development --watch",
    "build": "webpack --mode production"
}`
***
#### then
```
npm i react react-dom --save-dev
```
#### then
```
npm install react-router-dom
```
#### then
```
npm install @material-ui/core
npm install @material-ui/icons
npm install @material-ui/lab
```
