import React, { createContext, useReducer, useCallback } from 'react';

import * as Service from '../services/appSettings';
import appReduce from '../reducers/appSettingsReducer';
import ACTION from '../actions/appSettings';
import DataService from '../services/db';
import WalletService from '../utils/blockchain/wallet';
import { BALANCE_TABS } from '../constants';

const initialState = {
	settings: {
		activeDir: 'ltr',
		activeThemeLayout: 'vertical',
		activeTheme: 'light',
		activeSidebarType: 'full',
		activeLogoBg: 'skin6',
		activeNavbarBg: 'skin1',
		activeSidebarBg: 'skin6',
		activeSidebarPos: 'fixed',
		activeHeaderPos: 'fixed',
		activeLayout: 'full'
	},
	appSettings: { title: 'App Details' },
	tempIdentity: '',
	wallet: null,
	hasWallet: false,
	walletPasscode: null,
	isVerified: false,
	loading: false,
	openPasscodeModal: false,
	walletActionMsg: null,
	palikaWallet: null,
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	currentBalanceTab: BALANCE_TABS.TOKEN
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	const initApp = useCallback(async () => {
		let data = await DataService.initAppData();
		data.hasWallet = data.wallet === null ? false : true;
		const privateKey = await DataService.get('privateKey');
		if (privateKey) data.palikaWallet = await WalletService.loadFromPrivateKey(privateKey);
		if (!data.hasWallet) localStorage.removeItem('address');
		dispatch({ type: ACTION.INIT_APP, data });
	}, [dispatch]);

	const getAppSettings = useCallback(async () => {
		const res = await Service.getSettings();
		dispatch({ type: ACTION.GET_APP_SUCCESS, res });
	}, [dispatch]);

	function setPasscodeModal(flag) {
		dispatch({ type: ACTION.SET_PASSCODE_MODAL, data: flag });
	}

	function setCurrentBalanceTab(tabName) {
		dispatch({ type: ACTION.SET_BALANCE__CURRENT_TAB, data: tabName });
	}

	function setLoading(flag) {
		dispatch({ type: ACTION.SET_LOADING, data: flag });
	}

	function setWalletActionMsg(msg) {
		dispatch({ type: ACTION.SET_WALLET_ACTION_MSG, data: msg });
	}

	function setTempIdentity(tempIdentity) {
		dispatch({ type: ACTION.SET_TEMP_IDENTITY, data: tempIdentity });
	}

	function setHasWallet(hasWallet) {
		dispatch({ type: ACTION.SET_HASWALLET, data: hasWallet });
	}

	const setWallet = useCallback(wallet => {
		dispatch({ type: ACTION.SET_WALLET, data: wallet });
	}, []);

	const changeIsverified = useCallback(boolArg => {
		dispatch({ type: ACTION.CHANGE_ISVERIFIED, data: boolArg });
	}, []);

	return (
		<AppContext.Provider
			value={{
				settings: state.settings,
				appSettings: state.appSettings,
				tempIdentity: state.tempIdentity,
				hasWallet: state.hasWallet,
				wallet: state.wallet,
				palikaWallet: state.palikaWallet,
				walletPasscode: state.walletPasscode,
				isVerified: state.isVerified,
				loading: state.loading,
				openPasscodeModal: state.openPasscodeModal,
				walletActionMsg: state.walletActionMsg,
				pagination: state.pagination,
				currentBalanceTab: state.currentBalanceTab,
				setCurrentBalanceTab,
				setWalletActionMsg,
				setPasscodeModal,
				setLoading,
				getAppSettings,
				setTempIdentity,
				setHasWallet,
				setWallet,
				changeIsverified,
				initApp
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
