import Keycloak from 'keycloak-js';

//Import env variables from .env file in root
import dotenv from 'dotenv';
dotenv.config();


const keycloakConfig = {
    realm: import.meta.env.VUE_APP_KEYCLOAK_REALM || "smite",
    url: import.meta.env.VUE_APP_KEYCLOAK_AUTH_SERVER || "https://keycloak.irtsysx.fr/auth",
    clientId: import.meta.env.VUE_APP_KEYCLOAK_CLIENT_ID || "jni1",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;