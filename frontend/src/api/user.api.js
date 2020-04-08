import axiosAPI from '../httpService/httpService';

export const userAPI = {
  login,
  getAll,
  add,
  edit,
  deleteUser,
  auth
};

function login(user) {
  return axiosAPI.post('/user/login', user);
}

function getAll() {
  return axiosAPI.get('/user');
}

function add(user) {
  return axiosAPI.post('/user', user)
}

function edit(user) {
  return axiosAPI.put(`/user/${user._id}`, user)
}

function deleteUser(userId) {
  return axiosAPI.delete(`/user/${userId}`);
}

function auth(userData) {
  return axiosAPI.post('/user/auth', userData);
}