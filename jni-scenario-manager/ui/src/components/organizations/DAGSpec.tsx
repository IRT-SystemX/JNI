import {Autocomplete, Box, Button, Grid, Stack, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {GetDAGResponse} from '../../models/api';
import {DAGContext} from '../../contexts/DAGContext';
import {DAG, Step} from '../../models';
import DAGEditor from '../atoms/DAGEditor';
import DAGAttributes from '../molecules/DAGAttributes';
import DAGDefinition from '../molecules/DAGDefinition';
import Graph, {FlowchartType} from '../molecules/Graph';
import DAGStepTable from '../molecules/DAGStepTable';
import BorderedBox from '../atoms/BorderedBox';
import SubTitle from '../atoms/SubTitle';
import FlowchartSwitch from '../molecules/FlowchartSwitch';
import {useCookies} from 'react-cookie';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faFloppyDisk,
    faXmark,
    faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import Typography from "@mui/material/Typography";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import {WorkflowTemplate} from "../../pages/templates";

type Props = {
    data: GetDAGResponse;
};

export type TaskTemplate = {
    id?: string
    name: string
    description: string
    code_block: string
}

function DAGSpec({data}: Props) {
    const [editing, setEditing] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState(data.Definition);
    const handlers = getHandlers(data.DAG?.DAG);
    const [cookie, setCookie] = useCookies(['flowchart']);
    const [flowchart, setFlowchart] = React.useState(cookie['flowchart']);

    const [taskTemplateList, setTaskTemplateList] = useState<TaskTemplate[] | undefined>(undefined)
    const [taskTemplate, setTaskTemplate] = useState<TaskTemplate | undefined>(undefined)

    useEffect(() => {

        const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
        fetch(`http://${baseUrlWorkflowManager}/api/v1/tasks/`) // URL to your JSON file
            .then(response => response.json())
            .then(data => {
                setTaskTemplateList(data);
                setTaskTemplate(data[0]);
            })
            .catch(error => console.error("Fetching data failed", error));
    }, []);

    const onChangeFlowchart = React.useCallback(
        (value: FlowchartType) => {
            setCookie('flowchart', value, {path: '/'});
            setFlowchart(value);
        },
        [setCookie, flowchart, setFlowchart]
    );
    if (data.DAG?.DAG == null) {
        return null;
    }


    return (
        <DAGContext.Consumer>
            {(props) =>
                data?.DAG?.DAG && (
                    <React.Fragment>
                        <Box>
                            <Stack direction="row" justifyContent="space-between">
                                <SubTitle>Overview</SubTitle>
                                <FlowchartSwitch
                                    value={cookie['flowchart']}
                                    onChange={onChangeFlowchart}
                                />
                            </Stack>
                            <BorderedBox
                                sx={{
                                    mt: 2,
                                    py: 2,
                                    px: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowX: 'auto',
                                }}
                            >
                                <Box
                                    sx={{
                                        overflowX: 'auto',
                                    }}
                                >
                                    <Graph
                                        steps={data.DAG.DAG.Steps}
                                        type="config"
                                        flowchart={flowchart}
                                    />
                                </Box>
                            </BorderedBox>
                        </Box>

                        <Box sx={{mt: 3}}>
                            <Box sx={{mt: 2}}>
                                <DAGAttributes dag={data.DAG.DAG!}></DAGAttributes>
                            </Box>
                        </Box>
                        <Box sx={{mt: 3}}>
                            <Box sx={{mt: 2}}>
                                <SubTitle>Steps</SubTitle>
                                <DAGStepTable steps={data.DAG.DAG.Steps}></DAGStepTable>
                            </Box>
                        </Box>
                        {handlers?.length ? (
                            <Box sx={{mt: 3}}>
                                <SubTitle>Lifecycle Hooks</SubTitle>
                                <Box sx={{mt: 2}}>
                                    <DAGStepTable steps={handlers}></DAGStepTable>
                                </Box>
                            </Box>
                        ) : null}

                        <Box sx={{mt: 3}}>
                            <SubTitle>Spec</SubTitle>
                            <BorderedBox
                                sx={{
                                    mt: 2,
                                    px: 2,
                                    py: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Box
                                        sx={{
                                            color: 'grey.600',
                                        }}
                                    >
                                        {data.DAG.DAG.Location}
                                    </Box>
                                    {editing ? (
                                        <Stack direction="row">
                                            <Button
                                                id="save-config"
                                                color="primary"
                                                variant="outlined"
                                                startIcon={
                                                    <span className="icon">
                            <FontAwesomeIcon icon={faFloppyDisk}/>
                          </span>
                                                }
                                                onClick={async () => {
                                                    const url = `${getConfig().apiURL}/dags/${
                                                        props.name
                                                    }`;
                                                    const resp = await fetch(url, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            action: 'save',
                                                            value: currentValue,
                                                        }),
                                                    });
                                                    if (resp.ok) {
                                                        setEditing(false);
                                                        props.refresh();
                                                    } else {
                                                        const e = await resp.text();
                                                        alert(e);
                                                    }
                                                }}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                onClick={() => setEditing(false)}
                                                sx={{ml: 2}}
                                                startIcon={
                                                    <span className="icon">
                            <FontAwesomeIcon icon={faXmark}/>
                          </span>
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack direction="row">
                                            <Button
                                                id="edit-config"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => setEditing(true)}
                                                startIcon={
                                                    <span className="icon">
                            <FontAwesomeIcon icon={faPenToSquare}/>
                          </span>
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </Stack>
                                    )}
                                </Stack>
                                {editing ? (
                                    <Box sx={{mt: 2}}>
                                        <DAGEditor
                                            value={data.Definition}
                                            onChange={(newValue) => {
                                                setCurrentValue(newValue);
                                            }}
                                        ></DAGEditor>
                                    </Box>
                                ) : (
                                    <DAGDefinition value={data.Definition} lineNumbers/>
                                )}
                            </BorderedBox>
                        </Box>

                        <Grid container spacing={3}>
                            {/* 1. Column for the text description */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{mt: 3}}>
                                    <SubTitle>Task Templates</SubTitle>
                                    <BorderedBox
                                        sx={{
                                            mt: 2,
                                            px: 2,
                                            py: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box
                                                sx={{
                                                    color: 'grey.600',
                                                }}
                                            >
                                                <Box sx={{width: 300}}>
                                                    {taskTemplateList ?
                                                        <Autocomplete
                                                            freeSolo
                                                            id="free-solo-2-demo"
                                                            disableClearable
                                                            selectOnFocus
                                                            clearOnBlur
                                                            handleHomeEndKeys
                                                            options={taskTemplateList.map((taskTemplate: TaskTemplate) => taskTemplate.name)}
                                                            onChange={(event, newValue) => {
                                                                if (typeof newValue === 'string') {
                                                                    const selectedTask = taskTemplateList.find(({name}) => name === newValue)
                                                                    if (!selectedTask) return
                                                                    setTaskTemplate(selectedTask);
                                                                } else {
                                                                    setTaskTemplate(newValue);
                                                                }
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Search tasks"
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        type: 'search',
                                                                    }}
                                                                />
                                                            )}
                                                        /> : null}
                                                </Box>
                                            </Box>
                                            <Stack direction="row">
                                                <Button
                                                    disabled={taskTemplate === undefined}
                                                    onClick={() => navigator.clipboard.writeText(taskTemplate!.code_block)}><ContentPasteIcon/></Button>
                                            </Stack>
                                        </Stack>
                                        {taskTemplate ?
                                            <DAGDefinition value={taskTemplate.code_block} lineNumbers/>
                                            : null}
                                    </BorderedBox></Box>
                            </Grid>
                            {/* 2. Column for the code block */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{mt: 9}}>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            px: 2,
                                            py: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {taskTemplate ? (<Box>
                                            <SubTitle>{taskTemplate.name}</SubTitle>
                                            <Typography variant="body1" sx={{mt: 1}}>
                                                {taskTemplate.description}
                                            </Typography>
                                        </Box>) : null}
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>
                    </React.Fragment>
                )
            }
        </DAGContext.Consumer>
    );
}

export default DAGSpec;

function getHandlers(dag?: DAG) {
    const r: Step[] = [];
    if (!dag) {
        return r;
    }
    const h = dag.HandlerOn;
    if (h.Success) {
        r.push(h.Success);
    }
    if (h.Failure) {
        r.push(h.Failure);
    }
    if (h.Cancel) {
        r.push(h.Cancel);
    }
    if (h.Exit) {
        r.push(h.Exit);
    }
    return r;
}
