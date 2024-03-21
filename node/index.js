require('dotenv').config()

const mqtt = require('mqtt')
const protocol = 'mqtt'
const host = 'localhost'
const port = '1883'
const clientId = process.env.DIV_CLIENT_ID
const password = process.env.DIV_PASSWORD

const connectUrl = `${protocol}://${host}:${port}`

const testTopic = `${clientId}/$SDK/node/test`

function init() {
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: clientId,
        password,
        reconnectPeriod: 1000,
    })

    client.on('connect', () => {
        console.log('Connected');

        let sentCount = 0;

        // Set interval to publish messages every 2 seconds
        const intervalId = setInterval(() => {
            // Publish a message
            client.publish(testTopic, JSON.stringify({
                sequence: sentCount + 1,
            }));
            sentCount++;

            // Stop publishing after 10 messages
            if (sentCount === 10) {
                clearInterval(intervalId);
                client.end()
            }
        }, 2000);
    });

}

init()