import React, { useReducer, createContext } from 'react';
import { addUserAction, editUserAction, deleteUserAction, toggleModal, 
  userReducer, initialState, loading, hasError, getAllUsers, clearAlert, setSelectedUser } from '../reducers/userReducer';
import { userAPI } from '../api/index';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, dispatch] = useReducer(userReducer, initialState);

  const actions = {
    async add(user) {
      try {
        dispatch(loading())
        const data = await userAPI.add(user);
        dispatch(addUserAction(data.data.newUser, `Successfully added a new user: ${user.email}`)) 
      } catch (err) {
        if (!err.response.data) {
          return dispatch(hasError(err.response.statusText));
        }
        dispatch(hasError(err.response.data.error.message, user));
      }
    },
    async edit(user) {
      try {
        dispatch(loading())
        const data = await userAPI.edit(user)
        console.log('UPDATED USER: ', data)
        dispatch(editUserAction(data.data.user, `Successfully edited user: ${user.email}`));
      } catch (err) {
        if (!err.response.data) {
          return dispatch(hasError(err.response.statusText));
        }
        dispatch(hasError(err.response.data.error.message, user));
      }
      
    },
    async deleteUser(user) {
      try {
        dispatch(loading())
        await userAPI.deleteUser(user._id);
        dispatch(deleteUserAction(user._id, `Successfully deleted user: ${user.email}`));
      } catch (err) {
        dispatch(hasError(err.response.data.error.message, user));
      }
    },
    toggleModal(isOpen, title, isAdding) {
      dispatch(toggleModal(isOpen, title, isAdding))
    },
    async getAll(text, type, pageNumber) {
      try {
        await dispatch(loading())
        const data = await userAPI.getAll()
        await dispatch(getAllUsers(data.data)) 
      } catch (err) {
        if (!err.response.data) {
          return dispatch(hasError(err.response.statusText));
        }
        dispatch(hasError(err.response.data.error.message));
      }
    },
    clearAlert(user) {
      dispatch(clearAlert(user))
    },
    setSelectedUser(user, isEditing) {
      dispatch(setSelectedUser(user, isEditing))
    }
    
  }

  return (
    <UserContext.Provider value={{usersData: users, actions}}>
      {children}
    </UserContext.Provider>
  )
}
