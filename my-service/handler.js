'use strict';
var aws = require('aws-sdk');

module.exports.hello = (event, context, callback) => {
  var innerEvent = {};
  innerEvent.item_no = 0;

  var lambda = new aws.Lambda();
  var params = {
    FunctionName: "myServiceTaniguchi-dev-hello_multiple_called",
    InvocationType: "Event", // 非同期呼び出し
    //InvocationType: "RequestResponse",   //同期呼出
    Payload: JSON.stringify(innerEvent)
  };    
    
  var lambdaCall = function(params){ 
    lambda.invoke(params, function(err, data){
      if(err) {
        console.log("invoke error!!!");
				context.done(err, err);
      } else {
        console.log("invoke done.");
        context.done(null, '');
      }
    });
  };

  for (var loopcount = 0; loopcount < 10; loopcount++) {
    var payloadArguments = {};
    payloadArguments.item_no = loopcount;
    params.Payload = JSON.stringify(payloadArguments);
    lambdaCall(params);
	}

};

module.exports.hello_multiple_called = (event, context, callback) => {
  const response = {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Hello-Multiple-Called was called!!!',
      input: event,
    }),
  };
  console.log("multiple_called_was_called at " + event.item_no);

  callback(null, response);
};

