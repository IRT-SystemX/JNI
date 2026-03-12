interface state {
    registryPath: string,
    submodelRegistryPath: string,
    aasServerPath: string,
    primaryColor: string,
    keycloakRealm: string,
    keycloakUrl: string,
    keycloakClientId: string,
};

const state: state = {
    registryPath: import.meta.env.VITE_REGISTRY_PATH,
    submodelRegistryPath: import.meta.env.VITE_SUBMODEL_REGISTRY_PATH,
    aasServerPath: import.meta.env.VITE_AAS_SERVER_PATH,
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR,
    keycloakRealm: import.meta.env.VUE_APP_KEYCLOAK_REALM,
    keycloakUrl: import.meta.env.VUE_APP_KEYCLOAK_AUTH_SERVER,
    keycloakClientId: import.meta.env.VUE_APP_KEYCLOAK_CLIENT_ID
};

const getters = {
    getEnvRegistryPath(state: state) {
        return state.registryPath;
    },
    getEnvSubmodelRegistryPath(state: state) {
        return state.submodelRegistryPath;
    },
    getEnvAASServerPath(state: state) {
        return state.aasServerPath;
    },
    getEnvPrimaryColor(state: state) {
        return state.primaryColor;
    },
    getEnvKeycloakRealm(state: state) {
        return state.keycloakRealm;
    },
    getEnvKeycloakUrl(state: state) {
        return state.keycloakUrl;
    },
    getEnvKeycloakClientId(state: state) {
        return state.keycloakClientId;
    },
};

const actions = {
};

const mutations = {
};

export default {
    state,
    getters,
    actions,
    mutations,
};