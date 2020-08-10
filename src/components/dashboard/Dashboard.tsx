import React, { useState, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Toolbar, IconButton, makeStyles, createStyles, Typography, Theme, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme, Container, Grid, Paper, Box } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import ArrangeIcon from '@material-ui/icons/Shuffle';
import { Action, InputType } from '@projectstorm/react-canvas-core';

import Canvas from '../canvas/Canvas';
import { TrayWidget } from '../tray/TrayWidget';
import { TrayItemWidget } from '../tray/TrayItemWidget';
import { Application, Component } from '../canvas/Application';
import { ConfigType, getConfig } from '../../confs/configs';
import { CompNodeModel } from '../canvas/diagram/CompNodeModel';

import Form from "@rjsf/material-ui";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
        },
        appBar: {
            marginLeft: drawerWidth,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        title: {
            flexGrow: 1,
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        controlPane: {
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
            textAlign:'center',
        },
        controlButton: {
            overflow: 'auto',
            width: '50px',
        },
        canvas: {
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
            minHeight: '50vh',
        },
        configuration: {
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '10vh',
            padding: "30px"
        },
        grid: {
            flexGrow:1, 
        },
        fixedHeight: {
            height: 240,
        },
    }),
);

export interface DashboardProps {
    app: Application;
}

class SelectNodeAction extends Action {
    constructor(app: Application, setComponent:(Component)=>void) {
        super({
            type: InputType.MOUSE_UP,
            fire: (event: any) => {
                const selectedEntities = this.engine.getModel().getSelectedEntities();
                if (selectedEntities.length == 1) {
                    const entity = selectedEntities[0];
                    if (entity instanceof CompNodeModel) {
                        setComponent(app.getComponent(entity.getOptions().name))
                    }
                }
            }
        });
    }
}

function Dashboard({ app }: DashboardProps) {
    const classes = useStyles();

    const [locked, setLocked] = useState(false);
    const [component, setComponent] = useState<Component>(undefined);

    const handleLock = (event: any) => {
        const toLock: boolean = !locked;
        setLocked(toLock);
        app.getDiagramEngine().getModel().setLocked(toLock);
    }

    const handleRearrange = (event: any) => {
        app.rearrange();
    }

    const setCurrentComponent = (c : Component) => {
        setComponent(c);
    }

    useEffect(() => {
        console.log("added event")
        app.getDiagramEngine().getActionEventBus().registerAction(new SelectNodeAction(app, setCurrentComponent));
    }, []);

    return (
        <div>
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Dashboard
                    </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {/* control panel */}
                    <Paper className={classes.controlPane}>
                        <Grid container className={classes.grid} spacing={3} justify="center">
                            <Grid item xs={3} sm={3}>
                                <IconButton onClick={handleLock} className={classes.controlButton}>
                                    {locked ? <LockIcon /> : <UnlockIcon />}
                                </IconButton>
                            </Grid>

                            <Grid item xs={3} sm={3}>
                                <IconButton onClick={handleRearrange} className={classes.controlButton}>
                                    <ArrangeIcon />
                                </IconButton>
                            </Grid>
                       </Grid>
                    </Paper>


                    {/* Component Canvas */}
                    <Container>
                        <Paper className={classes.canvas}>
                        <Grid container >
                            <Grid item xs={10} sm={10}>
                                <Canvas app={app} />
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <TrayWidget>
                                    <TrayItemWidget 
                                        model={{ 
                                            type: 'producer',
                                            confType: ConfigType.HdfsSpout ,
                                        }} 
                                        name="HdfsSpout" description="produce tuples"
                                    />
                                    {/*
                                    <TrayItemWidget model={{ type: 'processor' }} name="Processor Node" confName="filter" description="process tuples" />
                                    */}
                                    <TrayItemWidget 
                                        model={{ 
                                            type: 'consumer',
                                            confType: ConfigType.ClousPusher,
                                        }} 
                                        name="Consumer Node" description="consume tuples" 
                                    />
                                </TrayWidget>
                            </Grid>
                        </Grid>
                        </Paper>
                    </Container>


                    {/* Component Configuration */}
                    <Paper className={classes.configuration}>
                        { typeof(component) != "undefined" ?? <Form schema={component.config}></Form>  }
                    </Paper>

                </Container>
            </main>
        </div>
    )
}

export default Dashboard;