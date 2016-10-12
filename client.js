var https = require('https');
var fs = require('fs');
var options = {
	hostname:'127.0.0.1',
	port:3000,
	path:'/users',
	method:'GET',
	key:fs.readFileSync('./ssl/client-key.pem'),
	cert:fs.readFileSync('./ssl/client-cert.pem'),
	ca: [fs.readFileSync('./ssl/ca-cert.pem')],
	agent:false
};
options.agent = new https.Agent(options);
var req = https.request(options,function(res) {
	console.log("statusCode: ", res.statusCode);
	console.log("headers: ", res.headers);
 	res.setEncoding('utf-8');
 	res.on('data',function(d){
    	console.log(d);
 	})
});
req.end();
req.on('error',function(e){
 console.log(e);
})