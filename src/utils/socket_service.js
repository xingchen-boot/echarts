export default class SocketService {
  // 单例
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 定义websocket对象
  ws = null
  callBackMapping = {}
  connected = false

  connectRetryCount = 0
  // 定义连接服务器的方法
  connect () {
    if (!window.WebSocket) {
      return console.log('当前浏览器不支持websocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 连接成功
    this.ws.onopen = () => {
      console.log('连接成功')
      this.connected = true
      // 连接成功时，重置重连尝试次数
      this.connectRetryCount = 0
    }
    // 连接失败
    this.ws.onerror = () => {
      this.connected = false
      console.log('连接失败')
    }
    // 连接关闭
    this.ws.onclose = () => {
      this.connected = false
      // 连接关闭时，增加重连尝试次数
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
      console.log('连接关闭')
    }
    // 接收服务器发送的消息
    this.ws.onmessage = (msg) => {
      console.log('接收服务器发送的消息', msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType](realData)
        } else if (action === 'fullscreen') {
          this.callBackMapping[socketType](recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType](recvData)
        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callback) {
    this.callBackMapping[socketType] = callback
  }

  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  send (data) {
    // 只在连接成功时发送，否则延迟重试
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
    // 延迟100ms后重试，最多重试10次
      let retryCount = 0
      const trySend = () => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data))
        } else if (retryCount < 10) {
          retryCount++
          setTimeout(trySend, 100)
        } else {
          console.warn('WebSocket连接未成功，消息发送失败')
        }
      }
      setTimeout(trySend, 100)
    }
  }
}
