
FROM oznu/homebridge:ubuntu


RUN npm install -g dd-trace --save

COPY dd-trace-patch/homebridge /usr/local/lib/node_modules/homebridge/bin/
COPY dd-trace-patch/standalone.js /usr/local/lib/node_modules/homebridge-config-ui-x/dist/bin/standalone.js
#COPY dd-trace-patch/hb-service.js /usr/local/lib/node_modules/homebridge-config-ui-x/dist/bin/hb-service.js
#COPY dd-trace-patch/index.js /homebridge/node_modules/homebridge-wiz-lan/dist/index.js