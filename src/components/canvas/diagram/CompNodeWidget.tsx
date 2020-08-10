import * as React from 'react';
import { CompNodeModel } from './CompNodeModel';
import { DiagramEngine, PortModelAlignment, PortWidget, DefaultPortLabel } from '@projectstorm/react-diagrams';
import { createStyles, makeStyles, Button, Box, Grid } from '@material-ui/core';
import * as _ from 'lodash';
import { CompPortModel } from './CompPortModel';

interface Props {
    background: string;
    selected: boolean;
}

const useStyles = makeStyles({
    node: {
        background: (props: Props) => props.background,
        borderRadius: '10px',
        border: 0,
        fontFamily: 'sans-serif',
        fontSize: '15px',
        overflow: 'visible',
        color: 'white',
        margin: 0,
        minWidth: "10vh",
    },
    title: {
        padding: '10px',
        display: 'flex',
        whiteSpace: 'nowrap',
        justifyItems: 'center',
    },
    titleName: {
        flexGrow: 1,
        padding: '5px 5px',
        textAlign: 'center',
        fontSize: '20px',
    },
    port: {
        display: 'flex',
        '&:first-of-type': {
            marginRight: '0px',
        },
        '&:only-child': {
            marginRight: '5px',
        },
        flexDirection: 'column',
    }
});

export interface CompNodeWidgetProps {
	node: CompNodeModel;
	engine: DiagramEngine;
}

export interface CompNodeWidgetState {}

export function CompNodeWidget(props:CompNodeWidgetProps, state: CompNodeWidgetState) {
    const classes = useStyles({
        background: props.node.getOptions().color,
        selected: props.node.isSelected(),
    });
	
    const generateInPort = (port:CompPortModel, index:any) => {
		return (
            <Grid item>
                <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
            </Grid>
        );
    };

    const generateOutPort = (port:CompPortModel, index:any) => {
		return (
            <Grid item>
                <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
            </Grid>
        );
    };

    const handleClick = (e:any) => {
        console.log("clicked")
    }
    
    return (
            <div className={classes.node} onClick={handleClick}>
                <Grid container spacing={3} direction="column" justify="center" alignItems="center">
                    <Grid item xs={12}>
                        <div className={classes.title}>
                            <div className={classes.titleName}>
                                {props.node.getOptions().name}
                            </div>
                        </div>
                    </Grid>
                    <Grid container item xs={12} direction="row" >
                        <Grid container item xs={6} direction="column" alignItems="flex-start">
                            {_.map(props.node.getInPorts(), generateInPort)} 
                        </Grid>

                        <Grid container item xs={6} direction="column" alignItems="flex-end">
                            {_.map(props.node.getOutPorts(), generateOutPort)}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
    );
}
