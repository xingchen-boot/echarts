const path=require('path');
const fileUtils=require('../utils/file_utils');
const webSocket=require('ws')
//创建一个webSocket服务
const wss=new webSocket.Server({
    port:9998
})

module.exports.listen = ()=>{
    //监听连接事件
//client 客户端的连接socket对象
wss.on('connection', client=>{
    console.log('有客户端连接成功了');
    client.on('message',async msg => {
         if (Buffer.isBuffer(msg)) {
        msg = msg.toString('utf8');
    }
    console.log('客户端发送的消息是：', msg);  
    let payload = JSON.parse(msg);
        const action= payload.action
        if(action === 'getData') {
            let filePath='../data/'+payload.chartName+'.json';
            // payload.charName
            filePath=path.join(__dirname,filePath)
            const ret=await fileUtils.getFileJsonData(filePath)
            payload.data=ret;
            client.send(JSON.stringify(payload));
        }else {
            wss.clients.forEach(client=>{
                client.send(msg)
            })
        }
    })
})
}
