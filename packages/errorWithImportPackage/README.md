## webpack-plugin-errorwithimportpackage

### Installation  
`npm i webpack-plugin-errorwithimportpackage`


## Usage

```javascript
const ErrorWithImportPackage = require('webpack-plugin-errorwithimportpackage');

module.exports = {
    ...
    plugins: [
        ...
        new ErrorWithImportPackage(['moment']),
    ]
}
```
