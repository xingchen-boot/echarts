//服务器的入口文件
//1、创建koa实例
const Koa=require('koa');
const app=new Koa();
//2、加载中间件
const responseDuration=require('./middleware/koa_response_duration');
app.use(responseDuration);
const responseHeader=require('./middleware/koa_response_header');
app.use(responseHeader);
const responseData=require('./middleware/koa_response_data');
app.use(responseData);
//3、监听端口，启动服务
app.listen(8888);

const webSocketService=require('./service/web_socket_service');
//开启服务端的监听
webSocketService.listen();