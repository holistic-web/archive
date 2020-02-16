import axios from 'axios';

const apiBase = 'https://us-central1-appprescriptions.cloudfunctions.net/api';

export default (storeName) => {

	const store = {
		namespaced: true,
		state: {
			count: 0,
			list: [],
			detail: null
		},
		mutations: {
			SET_COUNT(state, result) {
				const count = parseInt(result.data);
				state.count = count;
			},
			SET_LIST(state, result) {
				const list = result.data;
				state.list = list;
			},
			SET_DETAIL(state, result) {
				state.detail = result.data;
			}
		},
		actions: {
			async submit({ dispatch, rootState }, { data, options={} }) {
				const path = `${apiBase}/${storeName}`;
				const token = rootState.account.token;
				try {
					const result = await axios.post(path, data, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					return result;
				} catch (err) {
					await dispatch('account/logIn', {}, { root: true });
					if (!options.isRetry) return dispatch('submit', { data, options: { ...options, isRetry: true } });
					throw err;
				}
			},
			async update({ dispatch, rootState }, { data, id, options={} }) {
				const path = `${apiBase}/${storeName}/${id}`;
				const token = rootState.account.token;
				try {
					const result = await axios.post(path, data, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					return result;
				} catch (err) {
					await dispatch('account/logIn', {}, { root: true });
					if (!options.isRetry) return dispatch('submit', { data, id, options: { ...options, isRetry: true } });
					throw err;
				}

			},
			async count({ commit, dispatch, rootState }, options={}) {
				const path = `${apiBase}/${storeName}s/count`;
				const token = rootState.account.token;
				const query = options.query;
				try {
					const result = await axios.get(path, {
						headers: {
							Authorization: `Bearer ${token}`
						},
						params: {
							...query
						}
					});
					commit('SET_COUNT', result);
					return result;
				} catch (err) {
					await dispatch('account/logIn', {}, { root: true });
					if (!options.isRetry) return dispatch('count', { ...options, isRetry: true });
					throw err;
				}
			},
			async find({ commit, dispatch, rootState}, options={}) {
				const limit = options.limit || 10;
				const skip = options.skip || 0;
				const sortBy = options.sortBy || 'createdAt';
				const query = options.query;
				const dispatchCount = options.dispatchCount | true;
				const path = `${apiBase}/${storeName}s`;
				const token = rootState.account.token;
				try {
					if (dispatchCount) dispatch('count', { query });
					const result = await axios.get(path, {
						params: {
							limit: limit,
							skip: skip,
							sortBy: sortBy,
							...query
						},
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					commit('SET_LIST', result);
					return result;
				} catch (err) {
					await dispatch('account/logIn', {}, { root: true });
					if (!options.isRetry) return dispatch('find', { ...options, isRetry: true });
					throw err;
				}
			},
			async get({ commit, dispatch, rootState }, { id, options={} }) {
				const path = `${apiBase}/${storeName}/${id}`;
				const token = rootState.account.token;
				try {
					const result = await axios.get(path, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					commit('SET_DETAIL', result);
					return result;
				} catch (err) {
					await dispatch('account/logIn', {}, { root: true });
					if (!options.isRetry) return dispatch('get', { id, options: { ...options, isRetry: true } });
					throw err;
				}
			},
			async delete({ commit, dispatch, rootState }, { id, options={} }) {
				const path = `${apiBase}/${storeName}/${id}`;
				const token = rootState.account.token;
				try {
					const result = await axios.delete(path, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					return result;
				} catch (err) {
					await dispatch('account/logIn', {}, { root: true });
					if (!options.isRetry) return dispatch('delete', { id, options: { ...options, isRetry: true } });
					throw err;
				}
			}
		},
		getters: {
			count: state => state.count
		}
	}
	store.getters[`${storeName}s`] = state => state.list;
	store.getters[storeName] = state => state.detail;

	return store;
}
