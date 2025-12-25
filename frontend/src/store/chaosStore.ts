import { create } from 'zustand';
interface TableDrift {
  tableName: string;
  drifts: { originalField: string; brokenField: string; }[];
  sql: string;
}

interface ChaosState {
  isChaosActive: boolean;
  activeNodeId: string | null;
  // Currently viewed in Inspector
  attackMap: Record<string, { label: string, columns: string[] }>;
  // nodeID -> {label, columns}
  infectedNodes: string[];
  vixScore: number;
  fleetDriftData: TableDrift[];
  setActiveNode: (id: string, label: string, fields: string[]) => void;
  toggleColumn: (nodeId: string, label: string, field: string) => void;
  triggerFleetChaos: (infected: string[], score: number, fleetData: TableDrift[]) => void;
  resolveChaos: () => void;
}

export const useChaosStore = create<ChaosState>((set) => ({
  isChaosActive: false,
  activeNodeId: null,
  attackMap: {},
  infectedNodes: [],
  vixScore: 12.5,
  fleetDriftData: [],

  setActiveNode: (id) => set({ activeNodeId: id }),

  toggleColumn: (nodeId, label, field) => set((state) => {
    // We implemented this toggle logic to allow multi-column selection for the "Correlated Attack" scenario.
    const currentTarget = state.attackMap[nodeId] || { label, columns: [] };
    const newColumns = currentTarget.columns.includes(field)
      ? currentTarget.columns.filter(f => f !== field)
      : [...currentTarget.columns, field];

    const newMap = { ...state.attackMap };
    if (newColumns.length === 0) delete newMap[nodeId];
    else newMap[nodeId] = { label, columns: newColumns };

    return { attackMap: newMap };
  }),

  triggerFleetChaos: (infected, score, fleetData) => set({
    isChaosActive: true,
    infectedNodes: infected,
    vixScore: score,
    fleetDriftData: fleetData
  }),

  resolveChaos: () => set({
    // We reset the VIX score to 12.5 and clear the infected nodes to restore the "Green State".
    isChaosActive: false,
    activeNodeId: null,
    attackMap: {},
    infectedNodes: [],
    vixScore: 12.5,
    fleetDriftData: []
  })
}));