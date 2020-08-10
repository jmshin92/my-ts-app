import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Application } from "./Application";
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { ConfigType } from "../../confs/configs";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            background: 'rgb(250, 60, 60)',
        },
        canvas: {
            flexGrow: 1,
            color: 'rgba(255,255,255, 0.05)',
            background: 'rgb(60, 60, 60)',
            height: '50vh',
        },
    })
)

export interface BodyWidgetProps {
	app: Application;
}

function Canvas({app}: BodyWidgetProps) {
    const classes = useStyles();
    const [, updateState] = React.useState({});

    const handleDrop = (event : React.DragEvent<HTMLDivElement>) =>{
        var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
        const engine = app.getDiagramEngine()
        var nodesCount = engine.getModel().getNodes().length;
        const point = engine.getRelativeMousePoint(event);
        const confType = data.confType as ConfigType;

        const name = 'Node ' + (nodesCount + 1);
        if (data.type == 'processor') {
            app.addProcessingNode(name, confType, point)
        } else if (data.type == 'producer') {
            app.addSourceNode(name, confType, point)
        } else {
            app.addConsumerNode(name, confType, point)
        }
        updateState({})
    }
    
    return (
        <div 
            className={classes.root}
            onDrop={handleDrop}
            onDragOver={(event) => {
                event.preventDefault();
            }}
        >
            <CanvasWidget  engine={app.getDiagramEngine()} className={classes.canvas} />

        </div>
    )
}

export default Canvas