import { createStore, Store } from "vuex";
import createPersistedState from "vuex-persistedstate";
import createMultiTabState from "vuex-multi-tab-state";
import user, { userState } from "@/store/modules/user";

export interface State {
  user: userState;
}

export default <Store<State>>createStore({
  modules: {
    user,
  },
  plugins: [
    createMultiTabState({ statesPaths: ["user"] }),
    createPersistedState({
      paths: ["user"],
    }),
  ],
});
