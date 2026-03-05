
FROM golang:1.22-alpine as builder

WORKDIR /home/dagu

COPY . /home/dagu/
COPY .env /home/dagu/ui/

RUN apk update && apk add make
RUN apk add nodejs yarn

RUN make build-ui

RUN go build

FROM alpine:latest as service

ARG USER="dagu"
ARG USER_UID=1000
ARG USER_GID=$USER_UID

EXPOSE 8085

RUN apk update \
  && apk add --no-cache sudo tzdata \
  && addgroup -g ${USER_GID} ${USER} \
  && adduser ${USER} -h /home/${USER} -u ${USER_UID} -G ${USER} -D -s /bin/ash \
  && echo ${USER} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USER} \
  && chmod 0440 /etc/sudoers.d/${USER}

USER dagu
WORKDIR /home/dagu

COPY --from=builder /home/dagu/dagu /usr/local/bin/
 
RUN mkdir .dagu

ENV DAGU_HOST=192.168.209.129
ENV DAGU_PORT=8085

CMD dagu start-all
