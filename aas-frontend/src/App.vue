<template>
  <v-app>
    <!-- App Navigation and it's sub-Components (AASList, etc.) -->
    <AppNavigation />
    <v-main style="padding-top: 33px">
      <!-- App Content (eg. MainWindow, etc.) -->
      <router-view v-slot="{ Component }">
        <keep-alive :include="['AASList', 'AASTreeview', 'SubmodelElementView', 'ComponentVisualization']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import RequestHandling from './mixins/RequestHandling';
import SubmodelElementHandling from '@/mixins/SubmodelElementHandling';

import AppNavigation from './components/AppNavigation/AppNavigation.vue';

export default defineComponent({
  name: 'App',
  components: {
    RequestHandling, // Mixin to handle the requests to the AAS
    SubmodelElementHandling, // Mixin to handle the SubmodelElements

    AppNavigation,
  },
  mixins: [RequestHandling, SubmodelElementHandling],

  setup() {
    const store = useStore()

    return {
      store, // Store Object
    }
  },

  mounted() {
    // console.log(this.$vuetify.display.mobile)
    this.store.dispatch('dispatchIsMobile', this.$vuetify.display.mobile);
    this.store.dispatch('dispatchPlatform', this.$vuetify.display.platform);

    // check if the aas and path Queries are set in the URL and include them in the URL when switching to the mobile view
    const searchParams = new URL(window.location.href).searchParams;
    const aasEndpoint = searchParams.get('aas');
    const aasIdBase64 = searchParams.get('aasidbase64');
    const submodelElementBasePath = searchParams.get('basePath');
    const submodelElementPath = searchParams.get('path');
    if (aasEndpoint && aasIdBase64) {
      // console.log('AAS Query is set: ', aasEndpoint);
      let aas = {} as any;
      let endpoints = [];
      endpoints.push({ protocolInformation: { href: aasEndpoint } });
      aas.endpoints = endpoints;
      aas.aasIdBase64 = aasIdBase64;
      // dispatch the AAS set by the URL to the store
      this.store.dispatch('dispatchSelectedAAS', aas);
    }

    if (submodelElementBasePath && submodelElementPath) {
      // console.log('AAS and Path Queries are set: ', submodelElementBasePath + '/' + submodelElementPath);
      // Request the selected SubmodelElement
      let path = submodelElementBasePath + '/' + submodelElementPath;
      let context = 'retrieving SubmodelElement';
      let disableMessage = true;
      this.getRequest(path, context, disableMessage).then((response: any) => {
        if (response.success) { // execute if the Request was successful
          response.data.timestamp = this.formatDate(new Date()); // add timestamp to the SubmodelElement Data
          response.data.basePath = submodelElementBasePath; // add the base path to the SubmodelElement Data
          response.data.path = submodelElementPath; // add the path to the SubmodelElement Data         
          response.data.isActive = true; // add the isActive Property to the SubmodelElement Data
          // console.log('SubmodelElement Data: ', response.data)
          // dispatch the SubmodelElementPath set by the URL to the store
          this.store.dispatch('dispatchNode', response.data); // set the updatedNode in the Store
        } else { // execute if the Request failed
          if (response.data && Object.keys(response.data).length == 0) {
            // don't copy the static SubmodelElement Data if no Node is selected or Node is invalid
            this.store.dispatch('getSnackbar', { status: true, timeout: 60000, color: 'error', btnColor: 'buttonText', text: 'No valid SubmodelElement under the given Path' }); // Show Error Snackbar
            return;
          }
          this.store.dispatch('dispatchNode', {});
        }
      });
    }

    // check which platform is used and change the fitting view
    if (this.$vuetify.display.platform.android || this.$vuetify.display.platform.ios) { 
      // change to AASList when the platform is android or ios
      if(aasEndpoint && submodelElementPath) 
        this.$router.push({ path: '/aaslist', query: { aas: aasEndpoint, aasidbase64: aasIdBase64, basePath: submodelElementBasePath, path: submodelElementPath } });
      else if(aasEndpoint && !submodelElementPath) 
        this.$router.push({ path: '/aaslist', query: { aas: aasEndpoint, aasidbase64: aasIdBase64 } });
      else this.$router.push({ path: '/aaslist' });
    } else { 
      // change to MainWindow when the platform is not android or ios
      if(aasEndpoint && submodelElementPath) 
        this.$router.push({ name: 'MainWindow', query: { aas: aasEndpoint, aasidbase64: aasIdBase64, basePath: submodelElementBasePath, path: submodelElementPath } });
      else if(aasEndpoint && !submodelElementPath) 
        this.$router.push({ name: 'MainWindow', query: { aas: aasEndpoint, aasidbase64: aasIdBase64 } });
      else this.$router.push({ name: 'MainWindow' });
    }
  }
});
</script>

<style>
@import '../node_modules/@fontsource/roboto/index.css';
html { overflow-y: auto };
</style>
