FROM registry.dataos.io/datafoundry/ocdp-web-base:latest

COPY . /data/mainline/

WORKDIR /data/mainline

# Install nginx & node

RUN bower install && gulp build

ENV ADAPTER_API_SERVER=localhost SVCAMOUNT_API_SERVER=localhost RELEASE_EDITION='prod'

EXPOSE 9000

#ENTRYPOINT ["nginx", "-g", "daemon off;"]
CMD ["gulp", "start:server"]



