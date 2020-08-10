import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment, PortModelOptions, PortModelGenerics } from '@projectstorm/react-diagrams';
import {DeserializeEvent, AbstractModelFactory} from '@projectstorm/react-canvas-core'

export interface CompPortModelOptions extends PortModelOptions {
    label?: string;
    in?: boolean;
}

export interface CompPortModelGenerics extends PortModelGenerics {
	OPTIONS: CompPortModelOptions;
}

export class CompPortModel extends PortModel<CompPortModelGenerics> {
    constructor(options: CompPortModelOptions){
		super({
			type: 'comp',
            label: options.label || options.name,
            alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
            ...options
		});
    }
    
    deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.in = event.data.in;
		this.options.label = event.data.label;
	}

	serialize() {
		return {
			...super.serialize(),
			in: this.options.in,
			label: this.options.label
		};
    }
    
    link<T extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<T>): T {
		let link = this.createLinkModel(factory);
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link as T;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof CompPortModel) {
			return this.options.in !== port.getOptions().in;
		}
		return true;
	}

	createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
		let link = super.createLinkModel();
		if (!link && factory) {
			return factory.generateModel({});
		}
		return link || new DefaultLinkModel();
	}
}