import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core'
import { CompPortModel } from './CompPortModel';
import * as _ from 'lodash';

export interface CompNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
}

export interface CompNodeModelGenerics extends NodeModelGenerics{
	OPTIONS: CompNodeModelOptions;
}

export class CompNodeModel extends NodeModel<CompNodeModelGenerics> {
    protected portsIn: CompPortModel[];
	protected portsOut: CompPortModel[];

	protected compConfig: Map<string, any>;

	constructor(options?: CompNodeModelOptions){
		super({
			type: 'comp',
			name: 'Untitled',
			color: 'rgb(0,192,255)',
			...options
		});
		this.portsOut = [];
		this.portsIn = [];
    }

	doClone(lookupTable: {}, clone: any): void {
		clone.portsIn = [];
		clone.portsOut = [];
		super.doClone(lookupTable, clone);
	}

	removePort(port: CompPortModel): void {
		super.removePort(port);
		if (port.getOptions().in) {
			this.portsIn = null;
		} else {
			this.portsOut = null;
		}
	}

	addPort<T extends CompPortModel>(port: T): T {
		super.addPort(port);
		if (port.getOptions().in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
    }
    
	addInPort(label: string): CompPortModel {
		const p = new CompPortModel({
			in: true,
			name: label,
			label: label,
			alignment: PortModelAlignment.LEFT
		});
		return this.addPort(p);
	}

	addOutPort(label: string): CompPortModel {
		const p = new CompPortModel({
			in: false,
			name: label,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		return this.addPort(p);
	}

	getInPorts(): CompPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): CompPortModel[] {
		return this.portsOut;
	}

	getCompConfig(): Map<string, any> {
		return this.compConfig;
	}

	setCompConfig(conf: Map<string,any>) {
		conf.forEach((v, k) => this.compConfig.set(k, v))
	}

	putCompConfig(k: string, v:any) {
		this.compConfig.set(k, v);
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.name = event.data.name;
		this.options.color = event.data.color;
		this.portsIn = _.map(event.data.portsInOrder, id => {
			return this.getPortFromID(id);
		}) as CompPortModel[];
		this.portsOut = _.map(event.data.portsOutOrder, id => {
			return this.getPortFromID(id);
		}) as CompPortModel[];
		this.compConfig = event.data.compConfig;
	}

	serialize(): any {
		return {
			...super.serialize(),
			name: this.options.name,
			color: this.options.color,
			portsInOrder: _.map(this.portsIn, port => {
				return port.getID();
			}),
			portsOutOrder: _.map(this.portsOut, port => {
				return port.getID();
			}),
			compConfig: this.compConfig,
		};
	}
}