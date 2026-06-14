import axios, { AxiosInstance, AxiosError } from 'axios';
const logger = require('../logger');

interface BlockchainInfo {
	height: number;
	hash: string;
	time: number;
	latest_url: string;
	previous_hash: string;
	previous_url: string;
	peer_count: number;
	unconfirmed_count: number;
	high_fee_per_kb: number;
	medium_fee_per_kb: number;
	low_fee_per_kb: number;
	last_fork_height: number;
	last_fork_hash: string;
}

interface AddressBalance {
	final_balance: number;
	n_tx: number;
	total_received: number;
	total_sent: number;
}

const blockchainClient: AxiosInstance = axios.create({
	baseURL: 'https://blockchain.info',
	timeout: 15000,
	headers: { 'User-Agent': 'nodejs-practice/1.0' }
});

export const getBlockchainInfo = async (): Promise<BlockchainInfo> => {
  	try {
		const response = await blockchainClient.get('/latestblock');
		return response.data;
  	} catch (error) {
		const axiosError = error as AxiosError;
		logger.error(`Blockchain API error: ${axiosError.message}`, {
			code: axiosError.code,
			status: axiosError.response?.status,
			data: axiosError.response?.data
		});
		throw new Error('Failed to fetch blockchain info');
  	}
};

export const getBlockchainHeight = async (): Promise<number> => {
	try {
		const info = await getBlockchainInfo();
		return info.height;
	} catch (error) {
		throw new Error(`Failed to get blockchain height: ${(error as Error).message}`);
	}
};

export const getAddressBalance = async (address: string): Promise<AddressBalance> => {
	try {
		const response = await blockchainClient.get(`/balance?active=${address}`);
		const data = response.data as Record<string, AddressBalance>;
		
		if (!data[address]) {
		throw new Error(`Address ${address} not found in response`);
		}
		
		return data[address];
	} catch (error) {
		const axiosError = error as AxiosError;
		logger.error(`Address balance API error: ${axiosError.message}`, {
			address,
			code: axiosError.code,
			status: axiosError.response?.status
		});
		throw new Error(`Failed to fetch balance for address: ${address}`);
	}
};

module.exports = { getBlockchainInfo, getBlockchainHeight, getAddressBalance };