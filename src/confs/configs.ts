import hdfsSpoutConfig from './hdfsSpout.json'
import clousPusherConfig from './clousPusher.json'

export enum ConfigType {
    HdfsSpout,
    ClousPusher,
}

export function getConfig(type: ConfigType):any{
    switch(type) {
    case ConfigType.HdfsSpout:
        console.log("get:" + hdfsSpoutConfig);
        return hdfsSpoutConfig;
    case ConfigType.ClousPusher:
        console.log(clousPusherConfig);
        return clousPusherConfig;

    default:
        console.log("default: " + type)
    }
}