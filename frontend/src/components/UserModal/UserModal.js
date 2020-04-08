import React, { useState, useContext, useEffect, useCallback,useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { UserContext } from '../../context/userContext';

const UserModal = React.forwardRef((props, ref) => {
  const [localData, setUserData] = useState({
    user: {
      email: '',
      role: null,
      password: '',
      confirmPassword: '',
    },
    isOpenModal: false,
    loading: false,
    error: null,
    title: '',
  });

  const { usersData, actions: {
    add,
    edit,
    toggleModal
  } } = useContext(UserContext);


  useEffect(() => {
    if (usersData && usersData.isEditing) { 
    setUserData(prevSate => {
      return {
        ...prevSate,
        user: usersData.user,
        users: usersData.users,
      }
    });
  }
  }, [usersData]);

const handleChange = useCallback(e => {
  e.persist();
  setUserData(prevSate => {
    const newState = { ...prevSate };
    return {
      ...newState,
      user: {
        ...newState.user,
        [e.target.name]: e.target.value,
      }

    };
  });
}, [setUserData]);

const handleSubmit = (e) => {
  e.preventDefault();
  if (usersData.isEditing) {
    edit(localData.user);
  } else {
    add(localData.user)
  }
};

const handleClose = (e) => {
  e.preventDefault();
  toggleModal(false, '', false);
}

const dialogRef = useRef(null)

return (
  <div ref={dialogRef}>
    <Dialog
      open={usersData.isOpenModal}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {usersData.title ? usersData.title : ''}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          id="email"
          label="Email"
          type="email"
          name="email"
          value={localData && localData.user && localData.user.email ? localData.user.email : ''}
          fullWidth
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select"
            value={localData && localData.user && localData.user.role ? localData.user.role : ''}
            onChange={handleChange}
            name="role"
            fullWidth
          >
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>Manager</MenuItem>
            <MenuItem value={3}>User</MenuItem>
          </Select>
        </FormControl>
        {usersData && usersData.isAdding ?
          <>
            <TextField
              margin="normal"
              id="password"
              label="Password"
              type="password"
              name="password"
              value={localData && localData.user && localData.user.password ? localData.user.password : ''}
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              id="confirmPassword"
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={localData && localData.user && localData.user.confirmPassword ? localData.user.confirmPassword : ''}
              fullWidth
              onChange={handleChange}
            />
          </>
          : null}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
          </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
          </Button>
      </DialogActions>
    </Dialog>
  </div>
);
})
export default UserModal;