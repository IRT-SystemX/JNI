# dagu UI
Dagu UI - IRT SystemX Fork

This fork of Dagu UI includes additional features developed for IRT SystemX. The original Dagu functionality remains intact, with the following enhancements:

## New Features

1. Workflow & Tasks Templates
    - Description: This feature introduces a workflow template repository, allowing users to manage and search their workflow templates directly through the Dagu UI. It integrates with a MongoDB backend for efficient storage and retrieval of templates.

    - Key Functionalities:
      a) CRUD Operations: Users can Create, Read, Update, and Delete workflow templates via the Dagu UI.
      b) Template Search: A search functionality enables users to find specific templates quickly.
      c) Workflow Creation: Users can create new workflows based on existing templates listed in the UI.

    - Technical Implementation:
        - Backend: FastAPI with MongoDB for template storage and management
        - Frontend: New page added to the Dagu UI for template interactions

    - How to Use:
        1. Navigate to the new Templates page in the Dagu UI
        2. Browse existing templates or use the search function to find specific ones
        3. Perform CRUD operations on templates as needed
        4. To create a new workflow, select a template and use the "Create Workflow" option

    - Additional Integration:
      a) Task Template Access in Workflow Editor: Users can access task templates directly from the spec tab in every workflow/DAG page.
      b) Easy Implementation: This allows users to copy and paste examples from templates and edit the workflow directly within the workflow page.

    - How to Use Task Templates in Workflow Editor:
        1. Open a workflow/DAG page
        2. Navigate to the spec tab
        3. Access the task templates from within this tab
        4. Copy the desired template
        5. Paste and edit the template directly in the workflow editor

    - Benefits:
        - Streamlines workflow creation process
        - Ensures consistency across similar workflows
        - Facilitates knowledge sharing and best practices
        - Streamlines the process of implementing standard tasks within workflows
        - Reduces errors by providing pre-written, tested task templates
        - Improves efficiency by allowing direct editing within the workflow page

2. Decision System Params
    - Description: This feature implements a JNI (Jumeau Numérique) Connection, enabling users to send simulation parameters to relevant AAS (Asset Administration Shell) sub-model properties in the JNI Platform.

    - Key Functionality:
        - Establishes a connection between Dagu and the JNI (Digital Twin) Platform
        - Allows users to input and send simulation parameters directly from Dagu
        - Integrates with specific AAS sub-model properties in the JNI system

    - Technical Implementation:
        - JNI Connection: Facilitates communication between Dagu and the Digital Twin platform
        - Parameter Transmission: Enables sending of user-defined simulation parameters

    - How to Use:
        1. Navigate to the "Scenario Results" tab in the Dagu UI.
        2. Choose a scenario from the execution history.
        3. Locate and click on the "Decision System Params JNI Connection" bar, found under the scheduler log.
        4. This action will open the JNI Platform connection panel.
        5. In the panel, search for and select the relevant submodels.
        6. Once a submodel is selected, an element details card will appear.
        7. Use the input field on the element details card to update the property as needed.
        8. Confirm the changes to send the updated parameters to the JNI Platform.

    - Benefits:
        - Streamlines the process of setting up and running simulations in the JNI Platform
        - Enhances integration between workflow management (Dagu) and digital twin simulations
        - Improves efficiency in parameter management for complex simulation models

    - Use Case:
      Particularly useful for researchers working with digital twin models, allowing them to easily adjust and test different simulation parameters within their Dagu workflows.

## Development Instructions

### 1. Starting the Backend Server
The Dagu UI relies on a backend server that provides the necessary data for the UI to function properly. To start the backend server, navigate to the project root directory and execute the following command:

```bash
git clone git@github.com:yohamta/dagu.git
cd dagu
make server
```

This command will start the backend server at 127.0.0.1:8080 by default. If you need to use a different address or port, you can modify the appropriate settings in the backend configuration file.

### 2. Starting the Webpack Dev Server

Once the backend server is up and running, you can start the Webpack dev server to serve the frontend assets. To do this, navigate to the ui/ directory and execute the following commands:

```bash
cd ui/
yarn install
yarn start
```

This command will start the Webpack dev server at `127.0.0.1:8081`. You can access the UI by opening your web browser and navigating to http://localhost:8081.

### 3. Building the Bundle.js File

If you need to build the `bundle.js` file, which contains all the necessary frontend assets, you can do so using the following command:

```
cd dagu
make build-ui
```

This command will build the `bundle.js` file and copy it to dagu/service/frontend/assets/js/bundle.js. This is necessary for the Go backend to include the JavaScript within the binary.
