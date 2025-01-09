#!/bin/bash
# This script may be used to create secrets to deploy the JNI1 POC

# Namespace
NS=jni1-dev

MONGODB_ROOT_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32 ; echo '')
SITE_COOKIE_SECRET=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 64 ; echo '')
SITE_SESSION_SECRET=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 64 ; echo '')
BASIC_AUTH_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 12 ; echo '')
MONGODB_PASSWORDS_ENV=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 12 ; echo '')
MONGODB_PASSWORDS_REGISTRY=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 12 ; echo '')
k create -n $NS secret generic \
  --from-literal="mongodb-root-password=$MONGODB_ROOT_PASSWORD" \
  --from-literal="mongodb-passwords=$MONGODB_PASSWORDS_REGISTRY,$MONGODB_PASSWORDS_ENV" \
  --from-literal="site-cookie-secret=$SITE_COOKIE_SECRET" \
  --from-literal="site-session-secret=$SITE_SESSION_SECRET" \
  --from-literal="basic-auth-password=$BASIC_AUTH_PASSWORD" \
    jni1-poc-mongodb

k create -n $NS secret generic \
  --from-literal="mongodb-password=$MONGODB_PASSWORDS_REGISTRY" \
  jni1-poc-registry-mongodb

k create -n $NS secret generic \
  --from-literal="mongodb-password=$MONGODB_PASSWORDS_ENV" \
  jni1-poc-environment-mongodb
