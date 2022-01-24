//cookie读取，利用了正则表达式可以解析到 name 对应的值。
const cookie = {
    read(name: string): string | null {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
      return match ? decodeURIComponent(match[3]) : null
    }
  }
  
export default cookie