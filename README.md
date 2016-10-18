  # 1 安装依赖:
     npm install
     
  # 2 安装pm2:
     npm install -g pm2
     
  # 3 启动:
     pm2 start ./bin/www
     
     注意！：本地没有安装 mongdb 会提示错误，虽然本地不需要，但是最好安装下。
     
     1 下载  
     
     curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-amazon-3.2.10.tgz

     2 解压  
     
     tar -zxvf mongodb-linux-x86_64-amazon-3.2.10.tgz

     3 将解压包拷贝到指定目录  
     
     mv mongodb-linux-x86_64-amazon-3.2.10/ /usr/local/mongodb

     4 MongoDB 的可执行文件位于 bin 目录下，需将其添加到 PATH 路径中  
     
     export PATH=/usr/local/mongodb/bin:$PATH

     5 查看是否安装mongdb  
     
     which mongod

     6 指定数据存储路径  
     
     mkdir -p /data/db

     7 开启服务  
     
     A）mongdb目录下开启  
     
     mongod --dbpath=/data/db --port=27017
     
     B）以守护进程方式开发(推荐)  
     
     mongod --dbpath=/data/db --port=27017 --fork --logpath=/var/log/mongod.log

     8 数据库常用操作  
     
     mongo
     show dbs
     show collections
     use xxx

     9 关闭数据库服务（不用时一定记得关了，否则下次启动有概率💥）  
     
     A）
       mongod --shutdown  
       
     B）
       mongo
       use admin
       db.shutdownServer()  
       
  # 4 结束:
     pm2 stop ./bin/www
