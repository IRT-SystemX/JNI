<template>
    <v-btn variant="plain">
        <v-icon size="x-large">mdi-plus</v-icon>
        <v-tooltip activator="parent" open-delay="600" location="bottom">Add existing AAS to Registry</v-tooltip>
        <v-dialog activator="parent" v-model="RegisterAASDialog" width="600">
            <v-card>
                <v-card-title>
                    <span class="text-subtile-1">Add existing AAS to Registry</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-text-field variant="outlined" density="compact" label="AAS Endpoint" hint="E.g. http://localhost:8081" clearable v-model="aasEndpoint"></v-text-field>
                </v-card-text>
                <v-card-text>
                    <v-text-field variant="outlined" density="compact" label="AAS ID" hint="E.g https://acplt.test/Test_AssetAdministrationShell" clearable v-model="aasId"></v-text-field>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn size="small" variant="outlined" color="primary" @click="RegisterAASDialog = false">Cancel</v-btn>
                    <v-btn size="small" class="text-buttonText" variant="elevated" color="primary" @click="addAAS()" :loading="registrationLoading">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import RequestHandling from '../../mixins/RequestHandling';

export default defineComponent({
    name: 'RegisterAAS',
    mixins: [RequestHandling],

    setup() {
        const store = useStore()

        return {
            store, // Store Object
        }
    },

    data() {
        return {
            RegisterAASDialog: false, // Dialog State Handler
            registrationLoading: false, // Loading State Handler
            aasEndpoint: '', // AAS Endpoint
            aasId: '', // AAS ID
        }
    },

    computed: {
        // get Registry URL from Store
        registryURL() {
            return this.store.getters.getRegistryURL;
        },
    },

    methods: {
        // Function to add a new AAS to the Registry
        addAAS() {
            this.registrationLoading = true;
            let aasId = this.aasId;
            let aasIdBase64 = btoa(this.aasId); //create Base64 ID for request /shells/{aasIdBase64}
            let path = this.aasEndpoint + '/shells/' + aasIdBase64;
            let context = 'retrieving to be registered AAS';
            let disableMessage = false;
            this.getRequest(path, context, disableMessage).then((response: any) => {
                if (response.success) { // execute if the AAS exists
                    let aas = response.data;
                    let endpoints = {
                        endpoints: 
                        [{
                            protocolInformation: {
                                href: this.aasEndpoint,
                                endpointProtocol: this.aasEndpoint.split(':')[0]
                            },
                            interface: 'AAS-1.0'
                        }]
                    };
                    let body = Object.assign({id: aas.id, idShort: aas.idShort}, endpoints);
                    let path = this.registryURL + '/shell-descriptors';
                    let content = JSON.stringify(body);
                    let headers = { 'Content-Type': 'application/json' };
                    let context = 'registering AAS';
                    let disableMessage = false;
                    this.postRequest(path, content, headers, context, disableMessage).then((response: any) => {
                        if (response.success) { // execute if the AAS is successfully registered
                            this.store.dispatch('dispatchTriggerAASListReload', true); // trigger AAS List reload
                            this.RegisterAASDialog = false; // close dialog
                        }
                    });
                }
                this.registrationLoading = false;
            });
        },
    },
});
</script>
