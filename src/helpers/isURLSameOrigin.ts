//通过创建一个a标签的 DOM，然后设置该a标签的href属性为我们请求的的url，然后这样就可以获取到该DOM的protocol、host、port。
//再把当前页面的url也都通过这种方式获取，然后对比它们的protocol、host以及port是否都相同，进而判断出请求是否是跨域

interface URLOrigin {
    protocol: string;
    host: string;
    port: string;
}

export default function isURLSameOrigin(requestURL:string):boolean {
    let urlParsingNode = document.createElement("a")

    //1.获取当前页面地址的协议、域名、端口号
    const currentOrigin = resolveURL(window.location.href)
    //获取请求的url的协议、域名、端口号
    const parsedOrigin = resolveURL(requestURL)

    //比较是否相同，即判断是否是同源还是跨域
    return (
        parsedOrigin.protocol === currentOrigin.protocol &&
        parsedOrigin.host === currentOrigin.host &&
        parsedOrigin.port === currentOrigin.port
    )
    
    //创建一个可以通过URL获取协议、域名、端口号的函数
    function resolveURL(url:string):URLOrigin{
        urlParsingNode.setAttribute("href",url)
        return {
            protocol:urlParsingNode.protocol?urlParsingNode.protocol.replace(/:$/,""):"",
            host:urlParsingNode.host,
            port:urlParsingNode.port
        }
    }

}