/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueApexCharts from "vue3-apexcharts";

// Composables
import { createApp } from "vue";
import { defineComponent } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

// Keycloak Enable Disable
const keycloakEnabled = import.meta.env.VITE_AUTH_KEYCLOAK_ENABLED;

//import keycloak from './keycloak';
import Keycloak from "keycloak-js";
const keycloakConfig = {
  realm: import.meta.env.VUE_APP_KEYCLOAK_REALM || "smite",
  url:
    import.meta.env.VUE_APP_KEYCLOAK_AUTH_SERVER ||
    "https://keycloak.irtsysx.fr/auth",
  clientId: import.meta.env.VUE_APP_KEYCLOAK_CLIENT_ID || "jni1",
};

let keycloak: any = null;

keycloak = new Keycloak(keycloakConfig);

//const keycloak = new Keycloak(keycloakConfig);

const app = createApp(App);

app.use(router);
app.use(store);

app.use(VueApexCharts);

registerPlugins(app);

async function loadUserPlugins() {
  if (keycloakEnabled === "Enable") {
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        if (authenticated) {
          // Load all components in the components folder
          const pluginFiles = import.meta.glob("./UserPlugins/*.vue");
          const files = Object.keys(pluginFiles);

          let plugins = [] as Array<object>;

          Promise.all(
            files.map(async (path) => {
              const componentName = path
                .replace("./UserPlugins/", "")
                .replace(".vue", "");
              const component: any = await pluginFiles[path]();
              app.component(
                componentName,
                (component.default || component) as ReturnType<
                  typeof defineComponent
                >
              );
              plugins.push({
                name: componentName as string,
                SemanticID: component.default.SemanticID as string,
              });
            })
          ).then(() => {
            store.dispatch("dispatchPlugins", plugins);

            // Set the user name in the Vue component's data or state
            app.config.globalProperties.$keycloak = keycloak;
            app.config.globalProperties.$userName =
              keycloak.tokenParsed.preferred_username;
            let payload = {
              idToken: keycloak.idToken,
              accessToken: keycloak.token,
            };
            app.config.globalProperties.$accessToken = payload;

            app.mount("#app");
          });
        }
      });
  } else if (keycloakEnabled === "Disable") {
    // Load all components in the components folder
    const pluginFiles = import.meta.glob("./UserPlugins/*.vue");
    const files = Object.keys(pluginFiles);
    let plugins = [] as Array<object>;
    Promise.all(
      files.map(async (path) => {
        const componentName = path
          .replace("./UserPlugins/", "")
          .replace(".vue", "");
        const component: any = await pluginFiles[path]();
        app.component(
          componentName,
          (component.default || component) as ReturnType<typeof defineComponent>
        );
        plugins.push({
          name: componentName as string,
          SemanticID: component.default.SemanticID as string,
        });
      })
    ).then(() => {
      store.dispatch("dispatchPlugins", plugins);
      app.mount("#app");
    });
  }
}
loadUserPlugins();

keycloak.onAuthSuccess = () => {
  console.log("Authentication successful");
};
