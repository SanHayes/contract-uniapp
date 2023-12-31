import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import http from "@/common/http";
import i18n from '@/locale'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        title: '',
        isConnected: false,//钱包是否链接
        isApprove: false,//是否已授权
        contracts: [],//合约列表
        address: ``,//当前链接的钱包地址
        walletLinkName: ['Ethereum', 'Binance Smart Chain', 'TRX'],
        walletLink: ['erc', 'bsc', 'trc'],
        walletLinkId: [1, 56, 1],
        walletIndex: undefined,//当前选中的钱包索引
		service: {}, // 客服第三方地址
        token: ``,//jwt
        invite_code: ``,//邀请码
        user: {},//当前登录用户信息
        inviteUrl: ``,//邀请连接
        pageAccount: {
            earnings: 0,
            today: 0,
            yield: 0,
            pool: 0,
            balance: 0,
            eth: {
                total: 0,
                balance: 0,
                freeze: 0,
            },
            usdt: {
                total: 0,
                balance: 0,
                freeze: 0,
            },
        },//account页面数据
    },
    getters: {
        title: state => {
            return state.title
        },
        isConnected: state => {
            return state.isConnected
        },
        isApprove: state => {
            return state.isApprove
        },
        contracts: state => {
            return state.contracts
        },
        address: state => {
            if (state.address) {
                return state.address
            }
            return i18n.t(`connect`)
        },
        walletLinkName: state => {
            return state.walletLinkName
        },
        walletLink: state => {
            return state.walletLink
        },
        walletLinkId: state => {
            return state.walletLinkId
        },
        walletIndex: state => {
            return state.walletIndex
        },
        token: state => {
            return state.token
        },
        user: state => {
            return state.user
        },
        inviteUrl: state => {
            if(state.inviteUrl === ``){
                return window.location.origin
            }
            return state.inviteUrl
        },
        pageAccount: state => {
            return state.pageAccount
        },
    },
    mutations: {
        setTitle(state, payload) {
            state.title = payload.title
        },
        setIsConnected(state, payload) {
            state.isConnected = payload
        },
        setIsApprove(state, payload) {
            state.isApprove = payload
        },
        setContracts(state, payload) {
            state.contracts = payload
        },
        setAddress(state, payload) {
            state.address = payload
        },
        setWalletIndex(state, payload) {
            state.walletIndex = payload
        },
		setState(state, payload) {
			if (!payload.key) {
				return
			}
			state[payload.key] = payload.value
		},
        setToken(state, payload) {
            state.token = payload
            uni.setStorage({key: 'token', data: payload})
        },
        setUser(state, payload) {
            state.user = payload
        },
        resetState(state){
            state.address = ``
            state.inviteUrl = ``
            state.isConnected = false
            state.isApprove = false
        },
        setInviteUrl(state, payload) {
            state.inviteUrl = payload
        },
        setPageAccount(state, payload) {
            state.pageAccount = payload
        },
        setInviteCode(state, payload) {
            state.invite_code = payload
        },
    },
    actions: {
        async setTitle({commit}, data) {
            commit(`setTitle`, data)
        },
        async setIsConnected({commit}, data) {
            commit(`setIsConnected`, data)
        },
        async setIsApprove({commit}, data) {
            if (data.result) {
                await http.post('/api/Index/approve', {txid: data.txid})
            }
            commit(`setIsApprove`, data.result)
        },
        async setContracts({commit}) {
            const {data} = await http.post('/api/Index/contract')
            commit(`setContracts`, data)
        },
        async setAddress({commit, dispatch, state}, value) {
            const invite_code = state?.invite_code
            const param = {...value, invite_code}
            const {data} = await http.post('/api/Index/login', param)
            if (data?.token) {
                commit(`setToken`, data.token)
                commit(`setUser`, data)
                commit(`setAddress`, value.wallet_address)
                commit(`setIsConnected`, true)
                commit(`setInviteUrl`, `${window.location.origin}/#/?code=${data.invite_code}`)
                dispatch(`setPageAccount`)
            }
        },
        async setWalletIndex({commit}, data) {
            commit(`setWalletIndex`, data)
        },
        async resetState({commit}){
            commit(`resetState`)
        },
        async setPageAccount({commit}) {
            const {data} = await http.post('/api/Account/getAccount');
            commit(`setPageAccount`, data)
        },
        async setInviteCode({commit}, data) {
            if (data) {
                commit(`setInviteCode`, data)
            }
        }
    },
    plugins: [createPersistedState()]
})

export default store