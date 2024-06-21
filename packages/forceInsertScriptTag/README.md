## `forceInsertScriptTag`

1.  html-webpack-plugin 的 inject: true， 直接 根据参数 isInsertBody 决定插入到 head 还是 body 里面
2.  在 head | body 里面根据参数 isShift 决定是 前置插入还是后置插入
3.  html-webpack-plugin 的 inject: false，只会插入在body 里面，但是可以根据参数 isShift 决定是 在body进行 前置插入还是 后置插入
4.  可以通过设置 jsDeferLoad | jsAsyncLoad 来决定 <script> 标签的 defer 和 async 属性
5.  url 和 innerHTML 不可以同时设置，也不可以同时不设置 (两者总要设置一个)

## Usage
### 使用参考 (https://juejin.cn/post/7382891667672121394)

```javascript
const Forceinsertscripttag = require('webpack-plugin-forceinsertscripttag');

module.exports = {
    ...
    plugins: [
        ...
        new Forceinsertscripttag({
            isShift: true, // default: true 前置插入 还是 后置插入
            isInsertBody: true, //default: true  插入的 head 里面 还是 body 里面 (html-webpack-plugin 的 inject: false，只会插入在body 里面)
            url: 'xxx.js', // 被加载的 js 地址
            jsDeferLoad: false, // default: false  插入的 js 需不需要 在<script> 设置 defer 属性
            jsAsyncLoad: false, // default: false  插入的 js 需不需要 在<script> 设置 async 属性
            innerHTML: 'xx',
        }),
    ]
}
```
