FROM alpine:latest

# Copy code
COPY . /data/mainline/

WORKDIR /data/mainline

# Install nginx & node
# Install Bower
# Install node & bower depends
# Set bower root allow

#sed -i s#dl-cdn.alpinelinux.org#mirrors.aliyun.com/alpine#g /etc/apk/repositories && \
#ed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories && \
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --update nginx nodejs git && \
    npm install -g bower && \
    echo '{ "allow_root": true }' > /root/.bowerrc && \
    git config --global url."https://".insteadOf git:// && \
    npm install && \
    bower install && \
    npm uninstall -g bower && \
    apk del nodejs git --purge && \
    rm -rf bower_components node_modules app /var/cache/apk/* /tmp/*

EXPOSE 80

#ENTRYPOINT ["nginx", "-g", "daemon off;"]
CMD ["gulp serve"]


