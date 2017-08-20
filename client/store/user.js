export default {
    state: {
        user: {},
        messages: {}
    },

    mutations: {
        authenticatedUser(state, user) {
            Object.assign(state.user, user)
        }
    },

    actions: {
        userAuthenticated({ commit }, user) {
            commit('authenticatedUser', user)
        }
    }
}