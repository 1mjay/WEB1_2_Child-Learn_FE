import { baseApi } from "./base";
import { MiniGameTransaction, Wallet, ExchangeRequest } from "@/features/minigame/points/types/pointTypes";

// Wallet API
export const walletApi = {
  // 현재 포인트 및 코인 조회
  getWallet: async (memberId: number): Promise<Wallet> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.get(`/wallet/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      throw error;
    }
  },

  // 환전 처리
  exchangePoints: async (request: ExchangeRequest): Promise<Wallet> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(`/wallet/exchange`, request, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to exchange points:", error);
      throw error;
    }
  },

  // 미니게임 포인트 처리
  processMiniGamePoints: async (transaction: MiniGameTransaction): Promise<Wallet> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(`/wallet/minigame`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to process mini-game points:", error);
      throw error;
    }
  },
};
