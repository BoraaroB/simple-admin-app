export const initialState = {
  user: {
    email: '',
    role: null,
    password: ''
  },
  users: [],
  loading: false,
  error: null,
  successMsg: null,
  isAdding: false,
  isOpenModal:false,
  isEditing: false
};

const ADD_USER = "ADD_USER";
const EDIT_USER = "EDIT_USER";
const DELETE_USER = "DELETE_USER";
const TOGGLE_MODAL = 'TOGGLE_MODAL';
const LOADING = 'LOADING';
const ERROR = 'ERROR';
const GET_ALL_USERS = 'GET_ALL_USERS';
const CLEAR_ALERT = 'CLEAR_ALERT';
const SELECTED_USER = 'usersVICE';

export function userReducer(state, action) {
  switch (action.type) {
    case ADD_USER:
      return {
        users: [...state.users, {...action.payload.user}],
        user: {...initialState.user},
        isOpenModal:false,
        loading: false,
        error: null,
        successMsg: action.payload.successMsg || ''
      }
    case EDIT_USER:
      return {
        ...state,
        users: state.users.map(item => {
          if(item._id === action.payload.user._id) return {...action.payload.user};
          return item;
        }),
        user: {...initialState.user},
        isOpenModal:false,
        loading: false,
        error: null,
        isEditing: false,
        title: '',
        successMsg: action.payload.successMsg || ''
      }
    case DELETE_USER: {
      return {
        ...state,
        users: [...state.users.filter(item => item._id !== action.payload.userId)],
        isOpenModal:false,
        loading: false,
        error: null,
        isEditing: false,
        title: '',
        successMsg: action.payload.successMsg || ''
      }
    }
    case TOGGLE_MODAL: {
      return {
        ...state, 
        isOpenModal: action.payload.isOpen,
        loading: false,
        error: false,
        title: action.payload.title,
        isEditing: false,
        isAdding: action.payload.isAdding
      }
    }
    case LOADING: {
      return {
        ...state,
        loading: true,
        error: null
      }
    }
    case ERROR: {
      return {
        ...state,
        users: [...state.users],
        loading: false,
        user: {...action.payload.user},
        error: action.payload.error,
      }
    }
    case GET_ALL_USERS: {
      return {
        ...state,
        users: [...action.payload.users],
        loading: false,
        error: null,
      }
    }
    case CLEAR_ALERT: {
      return {
        ...state,
        loading: false,
        error: null,
        successMsg: null
      }
    }
    case SELECTED_USER: {
      return {
        ...state,
        user: {...action.payload.selectedUser},
        isOpenModal: true,
        title: 'Edit user',
        isEditing: action.payload.isEditing
      }
    }
    default:
      return state;
  }
}

export function addUserAction(user, successMsg) {
  return {
    type: ADD_USER,
    payload: {
      user,
      successMsg 
    }
  };
}

export function editUserAction(user, successMsg) {
  return {
    type: EDIT_USER,
    payload: {
      user,
      successMsg
    }
  };
}

export function deleteUserAction(userId, successMsg) {
  return {
    type: DELETE_USER,
    payload: {
      userId,
      successMsg
    }
  };
}

export function toggleModal(isOpen, title, isAdding) {
  return {
    type: TOGGLE_MODAL,
    payload: {
      isOpen,
      title,
      isAdding
    }
  }
}

export function loading() {
  return {
    type: LOADING
  }
}

export function hasError(error, user) {
  return {
    type: ERROR,
    payload: {
      error,
      user
    }
  }
}

export function getAllUsers(data) {
  return {
    type: GET_ALL_USERS,
    payload: {
      users: data,
    }
  }
}

export function clearAlert() {
  return {
    type: CLEAR_ALERT
  }
}
  

export function setSelectedUser(selectedUser,  isEditing) {
  return {
    type: SELECTED_USER,
    payload: {
      selectedUser,
      isEditing
    }
  }
}