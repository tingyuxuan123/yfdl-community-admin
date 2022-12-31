let baseURL = ''
const TIME_OUT = 10000

if (import.meta.env.PROD) {
  //生产环境
  baseURL = 'http://127.0.0.1:5174/api'
} else {
  //开发环境
  baseURL = 'http://127.0.0.1:8989'
}

export { baseURL, TIME_OUT }
