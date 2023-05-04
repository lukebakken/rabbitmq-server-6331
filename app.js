const amqplib = require('amqplib');
const mqtt = require('mqtt');

const hostname = process.env.RABBITMQ_HOSTNAME || 'localhost';
console.log(hostname);

(async () => {
    const conn = await amqplib.connect({
        hostname: hostname,
        username: 'guest',
        password: 'guest',
    });

    // consume lifecycle events
    const channel = await conn.createChannel();
    const queue = await channel.assertQueue('vector.lifecycle');
    await channel.bindQueue(queue.queue, 'amq.rabbitmq.event', 'connection.*');
    channel.consume(queue.queue, async (msg) => {
        if (!msg) {
            console.log('[WARN] no message consumed!');
            return;
        }
        // ideally we would be able to get client_id
        const routingKey = msg.fields.routingKey;
        const user = msg.properties.headers.user;
        const client_properties = msg.properties.headers.client_properties;
        console.log();
        console.log(routingKey, user);
        console.log(client_properties);
    }, { noAck: true });

    // connect and disconnect from MQTT
    const client = mqtt.connect(`mqtt://${hostname}`, {
        username: 'guest',
        password: 'guest',
    });
    client.on('connect', () => {
        client.end();
    });
})();
