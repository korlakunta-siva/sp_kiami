import { KiamiCfg } from './kiami';

export const isKiamiEnabled = (kiamiCfg: KiamiCfg): boolean =>
  !!kiamiCfg && kiamiCfg.isEnabled && !!kiamiCfg.project;

export const isKiamiEnabledLegacy = (kiamiCfg: KiamiCfg): boolean =>
  !!kiamiCfg && !!kiamiCfg.project;
