//处理业务逻辑的中间件，读取某个json文件的中间件
const path=require('path');
const fileUtils=require('../utils/file_utils');
module.exports=async(ctx,next)=>{
    const url=ctx.request.url;
    let firePath=url.replace('/api','')
    firePath='../data'+firePath+'.json';
    firePath=path.join(__dirname,firePath);
    try {
        const ret=await fileUtils.getFileJsonData(firePath);
        ctx.response.body=ret;
    } catch (error) {
        const errorMsg={
            message:'读取文件内容失败，文件资源不存在'
            ,
            status:404
        }
        ctx.response.body=JSON.stringify(errorMsg);
    }
   
    console.log(firePath);
    
    await next();
}