# `forceInsertScriptTag`

1. html-webpack-plugin 的 inject: true， 直接 根据参数 isInsertBody 决定插入到 head 还是 body 里面
2. 在 head | body 里面根据参数 isShift 决定是 前置插入还是后置插入
3. html-webpack-plugin 的 inject: false，只会插入在body 里面，但是可以根据参数 isShift 决定是 在body进行 前置插入还是后置


## Usage

```javascript
const Forceinsertscripttag = require('webpack-plugin-forceinsertscripttag');

module.exports = {
    ...
    plugins: [
        ...
        new Forceinsertscripttag({
            isShift: true, // default 前置插入 还是 后置插入
            isInsertBody: true, //default 插入的 head 里面 还是 body 里面 (html-webpack-plugin 的 inject: false，只会插入在body 里面)
            url: 'xxx.js', // 被加载的 js 地址
            jsDeferLoad: false, // default  插入的 js 需不需要 在<script> 设置 defer 属性
            jsAsyncLoad: false, // default  插入的 js 需不需要 在<script> 设置 async 属性
        }),
    ]
}
```