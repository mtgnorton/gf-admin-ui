var container = {
  url: ''
}

container.maxReConnectAmount = 5
container.currentReConnectAmount = 0

container.init = function() {

  container.lastHeartBeat = new Date().getTime()

  container.overtime = 6000 //超时时间

  container.send = function(d) { //发送消息

    d = JSON.stringify(d)

    if (!container.ws || container.ws.readyState != 1) {
      console.log('WebSocket Server 初始化失败,无法发送消息')
      return
    }
    container.ws.send(d)
  }

  container.reConnect = function() { //重连
    clearInterval(container.timer)
    console.log('socket 连接断开，第' + container.currentReConnectAmount + '次重试')
    container.init()
  }

  container.checkConnect = function() { //检查是否需要重连

    if (container.currentReConnectAmount > container.maxReConnectAmount) {
      clearInterval(container.timer)
      console.log('重试完成,无法连接,不再重试')
      return
    }

    container.send({ 'type': 'heart', data: { 'ping': parseInt(new Date().getTime() / 1000).toString() } }) //发送心跳
    if ((new Date().getTime() - container.lastHeartBeat) > container.overtime) {
      container.currentReConnectAmount++
      console.log('当前为第几次重试', container.currentReConnectAmount)
      container.reConnect()
    }
  }

  // container.receive = function(result) {
  //   console.log(result)
  //
  // }

  container.ws = new WebSocket(container.url)

  try {
    // ws连接成功
    container.ws.onopen = function() {
      console.log('WebSocket Server [' + container.url + '] 连接成功！')
      container.send({
        'type': 'debug', 'message': 'fasdfsaf', 'data': {
          'd1': 1111
        }
      })
    }

    // ws连接关闭
    container.ws.onclose = function() {
      if (container.ws) {
        container.ws.close()
        container.ws = null
      }
      console.log('WebSocket Server [' + container.url + '] 连接关闭！')
    }
    // ws连接错误
    container.ws.onerror = function() {
      if (container.ws) {
        container.ws.close()
        container.ws = null
      }
      console.log('WebSocket Server [' + container.url + '] 连接错误！')
    }
    // ws数据返回处理
    container.ws.onmessage = function(result) {
      container.lastHeartBeat = new Date().getTime()
      container.receive(JSON.parse(result.data))
    }

    if (container.ws) {
      container.timer = setInterval(container.checkConnect, 10000)
    }
  } catch (e) {
    alert(e.message)
  }
}

export default container


