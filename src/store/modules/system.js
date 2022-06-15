const system = {
  state: {
    cpuInfo: null,
    memoryInfo: null,
    administratorCount: null
  },

  mutations: {
    'setCpu': (state, cpuInfo) => {
      state.cpuInfo = cpuInfo
    },
    'setMemory': (state, memoryInfo) => {
      state.memoryInfo = memoryInfo
    },
    'setAdministratorCount': (state, administratorCount) => {
      state.administratorCount = administratorCount
    }
  }
}
export default system
