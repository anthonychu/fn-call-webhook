const { ServiceBusClient } = require("@azure/service-bus"); 

module.exports = function (context, req) {
    let model = (typeof req.body != 'undefined' && typeof req.body == 'object') ? req.body : null;
    let err = !model ? "no data; or invalid payload in body" : null;

    if (!err) {
        const timeNowUtc = new Date(Date.now());
        const scheduledEnqueueTimeUtc = new Date(Date.now() + 1000);

        var msg = {
            body: JSON.stringify(model),
            contentType: "application/json",
            userProperties: {
                id: model.id
            }
        }

        const sbClient = ServiceBusClient.createFromConnectionString(process.env.ServiceBus); 
        const topicClient = sbClient.createTopicClient(process.env.TopicName);
        const sender = topicClient.createSender();
        sender.send(msg);
    }
    
    context.res = {
        status: err ? 500 : 200,
        body: err
    };

    context.done(err);
};