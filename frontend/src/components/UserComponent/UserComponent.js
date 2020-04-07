import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

import { sessionService } from '../../sessionServices/sessionServices';
import { UserContext } from '../../context/userContext';

const UserComponent = ({ user }) => {

  const { actions: { deleteUser, setSelectedUser } } = useContext(UserContext);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const onDelete = () => {
    setOpenConfirmationModal(prevState => {
      return {
        title: 'Delete user',
        message: `Are you sure you want delete: ${user.email}`,
        isOpen: true,
        data: user,
        handleSubmit: deleteUser,
        handleClose: handleCancel
      };
    });
  };

  const handleCancel = () => {
    setOpenConfirmationModal(null);
  };

  const onUpdate = () => {
    setSelectedUser(user, true);
  }

  const getRole = (role) => {
    switch (role) {
      case 1: {
        return 'Admin'
      }
      case 2: {
        return 'Manager'
      }
      case 3: {
        return 'User'
      }
      default: return '';
    }
  }

  return (
    <div>
      {openConfirmationModal && openConfirmationModal.isOpen ? <ConfirmationModal {...openConfirmationModal} /> : null}
      <Grid>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user && user.email ? user.email : ''}
          />
          <ListItemText
            // primary={user && user.email ? user.email : ''}
            secondary={user && user.role ? getRole(user.role) : ''}
          />
          <ListItemSecondaryAction>
            {sessionService.isAdmin() || sessionService.isManager() ?
              <IconButton edge="end" aria-label="delete" onClick={onUpdate}>
                <EditIcon />
              </IconButton>
              : null}
            {sessionService.isAdmin() ? <IconButton edge="end" aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton> : null}
          </ListItemSecondaryAction>
        </ListItem>
      </Grid>
    </div>
  )
}

export default UserComponent;