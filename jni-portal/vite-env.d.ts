interface ImportMetaEnv {
    VITE_REGISTRY_PATH: string;
    VITE_SUBMODEL_REGISTRY_PATH: string;
    VITE_AAS_SERVER_PATH: string;
    VITE_PRIMARY_COLOR: string;
    KEYCLOAK_AUTH_SERVER: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_CLIENT_ID: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}