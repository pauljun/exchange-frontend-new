import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  permissions: [],
  email: "",
  id: "",
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  SET_USER_ID: (state, id) => {
    state.id = id;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password })
        .then((response) => {
          const data = response.data;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  setInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const data = JSON.parse(localStorage.getItem("userInfo"));

      const { id, roles, username, avatar, introduction, permissions, email } =
        data;
      console.log(roles, permissions);
      commit("SET_ROLES", roles);
      if (!roles?.length || !permissions.length) {
        localStorage.removeItem("userInfo");
        return resolve(data);
      }
      commit("SET_NAME", username);
      commit("SET_AVATAR", avatar);
      commit("SET_INTRODUCTION", introduction);
      commit("SET_PERMISSIONS", permissions);
      commit("SET_EMAIL", email);
      commit("SET_USER_ID", id);
      resolve(data);
    });
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const {
            id,
            roles,
            username,
            avatar,
            introduction,
            permissions,
            email,
          } = data;

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject("getInfo: roles must be a non-null array!");
          }
          commit("SET_ROLES", roles);
          commit("SET_NAME", username);
          commit("SET_AVATAR", avatar);
          commit("SET_INTRODUCTION", introduction);
          commit("SET_PERMISSIONS", permissions);
          commit("SET_EMAIL", email);
          commit("SET_USER_ID", id);
          localStorage.setItem("userInfo", JSON.stringify(data));
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();

          dispatch("tagsView/delAllViews", null, { root: true });
          localStorage.removeItem("userInfo");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true,
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
