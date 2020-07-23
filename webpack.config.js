var webpack = require('webpack'); //需要引入 不引入有时候有报错 webpack is no defined
var path = require('path'); //引入node path
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html再引入文件的时候添加hash
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //将css单独提出一个文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')  //js压缩代码
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//添加了hash之后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多 清除之前包内容
module.exports = {
    mode:'production',  //设置环境 不设置环境会打成生产环境压缩代码
    entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
      path: path.resolve(__dirname, './dist'),//打包后的文件存放的地方
      filename: "index-[hash].js"//打包后输出文件的文件名  加上hash值
    },
    devtool:'source-map', //sourcemap映射
    devServer:{
        inline:true,//实时刷新
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
    },
    module: {
        rules: [  //匹配请求的规则数组 规则能够对模块(module)应用 loader，或者修改解析器
            {
                test: /\.js$/,  //匹配所有js结尾
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',  //将es6转为浏览器兼容的js
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            {
                test: /\.(css|scss)$/,//匹配所有css或者scss结尾
                use: ExtractTextPlugin.extract({   //使用plugin将所有的css与js分离出来
                    fallback:['style-loader'] , //转化失败的使用style-loader 将所有的js生成的样式添加js对应的class和属性
                    use: ["css-loader",'sass-loader'] //先将scss文件转为css，使用css将import/require的css合并，url地址进行转为打包后的地址
                  })
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),   //在打包的js中添加版权所有，翻版必究
        new HtmlWebpackPlugin({hash: true}),    //HtmlWebpackPlugin简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的
        new ExtractTextPlugin('styles.[md5:contentHash:hex:8].css'), //将css跟js分割 -[hash]是生成css的时候后缀添加hash
        // new UglifyJsPlugin(),  //将js代码压缩  生产环境会自动压缩代码
        new CleanWebpackPlugin() //去除之前的文件
    ]
  }