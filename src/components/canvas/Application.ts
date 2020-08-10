import createEngine, { DagreEngine, DiagramModel, DiagramEngine, DefaultNodeModel, DefaultLinkModel, PathFindingLinkFactory, DefaultPortFactory, PortModelAlignment } from '@projectstorm/react-diagrams';

import { Action } from '@projectstorm/react-canvas-core';
import { Point } from '@projectstorm/geometry';
import { CompNodeModel } from './diagram/CompNodeModel';
import { CompNodeFactory } from './diagram/CompNodeFactory';
import { CompPortFactory } from './diagram/CompPortFactory';
import { ConfigType, getConfig } from '../../confs/configs';

export type Component = {
	node: CompNodeModel;
	config: any;
}

export class Application {
	protected activeModel!: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected dagreEngine!: DagreEngine;

	public compMap: Map<string, Component>;

	constructor(
	) {
		this.dagreEngine = new DagreEngine({
			graph: {
				rankdir: 'LR',
				ranker: 'logest-path',
				marginx: 100,
				marginy: 100
			},
			includeLinks: true
		})
		this.diagramEngine = createEngine({
			registerDefaultDeleteItemsAction: false,
			registerDefaultZoomCanvasAction: false,
		});
		this.compMap = new Map<string, Component>();
		this.newModel();
	}
	
	public registerAction(action: Action) {
		this.diagramEngine.getActionEventBus().registerAction(action);
	}

	public newModel() {
		this.activeModel = new DiagramModel();
		this.diagramEngine.setModel(this.activeModel);
		this.diagramEngine.getPortFactories().registerFactory(new CompPortFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new CompNodeFactory());

		this.diagramEngine.getModel().registerListener({
			linksUpdated: (e:any) => {
				if (!e.isCreated) {
					return;
				}
				const link:DefaultLinkModel = e.link
				link.setLocked(true)
				link.registerListener({
					selectionChanged: (e:any) => {
						if (!link.isSelected() && (!link.getTargetPort() || !link.getSourcePort())) {
							this.getDiagramEngine().getModel().removeLink(link);
						}
					}
				});
			},
		})
	}
	
	public getComponent(name:string):Component {
		return this.compMap.get(name);
	}
	public addSourceNode(name:string, confType:ConfigType, point:Point) {
		const node = new CompNodeModel({
			name: name, 
			color: 'rgb(162, 155, 254)',
		});
		node.addOutPort('OUT');
		node.setPosition(point);
		this.diagramEngine.getModel().addNode(node);
		this.compMap.set(name, {
			node: node,
			config: getConfig(confType),
		});
		console.log("source node added")
	}

	public addProcessingNode(name:string, confType:ConfigType, point:Point) {
		const node = new CompNodeModel({
			name: name, 
			color: 'rgb(85, 239, 196)',
		});
		node.addInPort('IN');
		node.addOutPort('OUT');
		node.setPosition(point);
		this.diagramEngine.getModel().addNode(node);
		this.compMap.set(name, {
			node: node,
			config: getConfig(confType),
		});
		console.log("process node added")
	}

	public addConsumerNode(name:string, confType:ConfigType, point:Point) {
		const node = new CompNodeModel({
			name: name, 
			color: 'rgb(253, 121, 168)',
		});
		node.addInPort('IN');
		node.setPosition(point);
		this.diagramEngine.getModel().addNode(node);
		this.compMap.set(name, {
			node: node,
			config: getConfig(confType),
		});
		console.log("consumer node added")
	}

	public getActiveDiagram(): DiagramModel{
		return this.activeModel;
	}

	public getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}

	public getDagreEngine(): DagreEngine {
		return this.dagreEngine;
	}

	public rearrange() {
		this.getDagreEngine().redistribute(this.getActiveDiagram())
		this.getDiagramEngine()
			.getLinkFactories()
			.getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME)
			.calculateRoutingMatrix();
		this.getDiagramEngine().repaintCanvas();
	}
}