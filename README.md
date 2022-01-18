# homebridge-docker-datadog


This repo is an attempt to build off of a dockerized image **FROM** 

 - oznu/[docker-homebridge](https://github.com/oznu/docker-homebridge/blob/master/Dockerfile) **FROM** homebridge/[homebridge](https://github.com/homebridge/homebridge)
 - And **ADD**: telemetry applied, specifically [Datadog APM](https://docs.datadoghq.com/tracing/) 

**WHY Overall**:  Complete a path (similar to [...make everything HomeKit-compatible](https://www.the-ambient.com/guides/homebridge-setup-homekit-ultimate-guide-1915) )to use Raspberry Pi to control via my Apple Watch
 - Wiz Lightbulbs: [homebridge-wiz-lan](https://github.com/kpsuperplane/homebridge-wiz-lan) closes the bridge between [cheap phillips wiz lightbuilbs](https://www.amazon.com/WiZ-Connected-Compatible-Assistant-Required/dp/B09LRJV3RC/ref=asc_df_B09LRJV3RC) tha are not currently compatible with Apple Homekit. 
 - Kaza Lightbulbs & plugs: [homebridge-tplink-smarthome](https://www.npmjs.com/package/homebridge-tplink-smarthome)
 - Multi Room Speaker groups via [airconnect](https://github.com/philippe44/AirConnect) which closes the gap between Google’s ChromeCast Audio + Apple Airplay 
 - Cameras
 - And monitor ( via Datadog) & with options for restarting via webhooks

 Easily done via:

 - Install Ubuntu64 on PI
 - Install a Docker (optional: docker-compose, git)
 - run 3 containers ( [Datadog Agent](https://docs.datadoghq.com/agent/docker/?tab=standard), Homebridge, Airconnect) 
 - connect Apple Home
 - monitor performance via [Datadog’s **correlated**](https://www.datadoghq.com/blog/request-log-correlation/): 

   - Application Performance Monitor ([APM](https://www.datadoghq.com/dg/apm/ts-benefits-os/)) of Traces
   - System and Application Logs
   - Pi Host [Infrastructure Metrics](https://www.datadoghq.com/dg/enterprise/it-infrastructure-monitoring/)
   - [Synthetics Emulated Browser and API user testing](https://docs.datadoghq.com/synthetics/)
   - Dashboards
   - Metric Monitor to Alert to [Webhook](https://docs.datadoghq.com/integrations/webhooks/) to auto remediation

**WHY Immediate scope**: Datadog Monitor
It adds APM instrumentation in a few places as in Datadog's [Tracing Node.js Applications](https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/?tab=containers)

```
const tracer = require('dd-trace').init({
    env:"dev"
    ,logInjection: true
    ,service:"homebridge"
    ,version:"00.00.001"
    ,tags: {
        tag1:"val1"
        ,docker_service:"yes"
    }
});
```


to be sent to a Datadog Agent, which in turn sends it to the Datadog SaaS along with correlated logs

[screenshot](https://a.cl.ly/nOu9D9JL)

**Homebridge with DD Docker Build**

```
mkdir homebridge-docker-datadog
cd homebridge-docker-datadog
git clone https://github.com/grsilver/homebridge-docker-datadog.git
docker build  \
 -t  \
 grsilver/homebridge-oznu-dd:v001  \
 .
```

**Hombreidge w DD Docker Run**

```
docker-compose up -d
```

**Agent Docker Run**

```
docker run -d --name datadog-agent \
           --restart=unless-stopped \
           -p 8126:8126/tcp \
           -e DD_API_KEY=<your Datadog app key> \
           -e DD_LOGS_ENABLED=true \
           -e DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true \
           -e DD_LOGS_CONFIG_DOCKER_CONTAINER_USE_FILE=true \
           -e DD_ENV=dev \
           -e DD_HOSTNAME=<YOUR HOST NAME> \
           -e DD_TRACE_ENABLED=true \
           -e DD_LOGS_INJECTION=true \
           -e DD_TRACE_STARTUP_LOGS=true \
           -e DD_PROFILING_ENABLED=true \
           -e DD_DOCKER_ENV_AS_TAGS=true \
           -e DD_PROCESS_AGENT_ENABLED=true \
           -e DD_APM_ENABLED=true \
           -e DD_APM_ENV=dev \
           -e DD_TAGS='key1:val3 host-tag-alt:pi-010-003' \
           -v /var/run/docker.sock:/var/run/docker.sock:ro \
           -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
           -v /proc/:/host/proc/:ro \
           -v /opt/datadog-agent/run:/opt/datadog-agent/run:rw \
           -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
           gcr.io/datadoghq/agent:latest

```
