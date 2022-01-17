# homebridge-docker-datadog


this is an attempt to build a dockerized image of 
homebridge/[homebridge](https://github.com/homebridge/homebridge)

with telemetry applied, specifically [Datadog APM](https://docs.datadoghq.com/tracing/) 

this builds off of 
oznu/[docker-homebridge](https://github.com/oznu/docker-homebridge/blob/master/Dockerfile)

And adds APM instrumentation in a few places as in Datadog's [Tracing Node.js Applications](https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/?tab=containers)

```
const tracer = require('dd-trace').init({
    env:"dev"
    ,service:"homebridge-grsilver"
    ,version:"00.00.001"
    ,tags: {
        tag1:"val1"
        ,docker_service:"yes"
    }
});
```


to be sent to a Datadog Agent, which in turn sends it to the Datadog SaaS along with correlated logs

[screenshot](https://a.cl.ly/nOu9D9JL)
