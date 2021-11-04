import https from 'https'

export const state = () => ({
  pages: [],
  settings:{},
  isConnected: false,
  currentAddr: "",
  connectModalShow: 0,
  rate: 0,
  tolerance: 12,
  workingTokens: {}
});

export const mutations = {
  SET_PAGES(state, payload) {
    state.pages = payload
  },
  SET_SETTINGS(state, payload) {
    state.settings = payload
  },
  SET_CURRENT_ADDR(state, payload) {
    console.log("payload", payload);
    state.currentAddr = payload
    if(payload){
      state.isConnected = true
    }
    else{
      state.isConnected = false
    }
  },
  SET_IS_CONNECTED(state, payload) {
    state.isConnected = payload
  },
  SET_CONNECT_MODAL(state, payload) {
    state.connectModalShow++
  },
  SET_RATE(state, payload) {
    state.rate = payload
  },
  SET_TOLERANCE(state, payload) {
    state.tolerance = payload
  },
  SET_WORKING_TOKENS(state, payload) {
    state.workingTokens = payload
  }
};

export const getters = {
  getPages: state => state.pages,
  getSettings:state => state.settings,
  getIsConnected:state => state.isConnected,
  getCurrentAddr:state => state.currentAddr,
  getConnectModalShow:state => state.connectModalShow,
  getRate:state => state.rate,
  getTolerance:state => state.tolerance,
  getWorkingTokens:state => state.workingTokens,
  
  home: state => {
    if (state.pages.length > 0) {
      return state.pages.find(page => page.title === "Home")
    } else {
      return {}
    }
  },
};

export const actions = {
  async nuxtServerInit({dispatch}) {
    await dispatch('storePages');
    await dispatch('storeSettings')
  },

  async storePages({commit}) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    try {
      const data = await this.$axios.$get('/pages', { httpsAgent });
      console.log(data[1].blocks);
      commit('SET_PAGES', data)
    } catch (e) {
      console.log(e)
    }
  },

  async getBalance({commit}) {

  },

  async storeSettings({commit}) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    try {
      const data = await this.$axios.$get('/settings', { httpsAgent });
      commit('SET_SETTINGS', data)
    } catch (e) {
      console.log(e)
    }
  },

};
