import { reactive } from "vue";
import userApi from "@/services/api/userApi";
import { AxiosResponse } from "axios";
import { Module } from "vuex";

const state = reactive({
  data: {},
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  rememberMe: false,
});

export type userState = typeof state;

const userStore: Module<userState, never> = {
  namespaced: true,
  state,
  getters: {},
  mutations: {
    setTokens(
      state: userState,
      payload: {
        accessToken: string;
        refreshToken: string;
        rememberMe?: boolean;
      }
    ): void {
      state.refreshToken = payload.refreshToken;
      state.accessToken = payload.accessToken;
      if (typeof payload.rememberMe === "boolean") {
        state.rememberMe = payload.rememberMe;
      }
      localStorage.setItem("accessToken", payload.accessToken);
      if (state.rememberMe || localStorage.getItem("refreshToken")) {
        localStorage.setItem("refreshToken", payload.refreshToken);
      }
    },
    setUserData(state: userState, payload: Record<string, never>): void {
      state.data = payload;
    },
    clear(state: userState): void {
      state.data = {};
      state.rememberMe = false;
      state.refreshToken = "";
      state.accessToken = "";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  actions: {
    login(
      { commit },
      payload: { password: string; login: string; rememberMe: boolean }
    ): Promise<AxiosResponse> {
      return userApi.login(payload).then((response) => {
        const { accessToken, refreshToken } = response.data.data.attributes;
        commit("setTokens", {
          accessToken,
          refreshToken,
          rememberMe: payload.rememberMe,
        });
        return response;
      });
    },
    getMe({ commit }): Promise<AxiosResponse> {
      return userApi.getMe().then((res) => {
        commit("setUserData", res.data);
        return res;
      });
    },
    logout({ commit }): void {
      commit("clear");
    },
    signUp(_, payload: Record<string, string>): Promise<AxiosResponse> {
      return userApi.signUp(payload);
    },
  },
};

export default userStore;
