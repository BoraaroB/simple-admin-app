import React, { useContext, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import UserComponent from '../UserComponent/UserComponent';
import Button from '@material-ui/core/Button';
import Alert from '../Alert/Alert';

import { sessionService } from '../../sessionServices/sessionServices'
import UserModal from '../UserModal/UserModal';
import { UserContext } from '../../context/userContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const UserList = () => {

  const classes = useStyles();

  // initialization user context 
  const { usersData, actions: {
    getAll,
    toggleModal,
    clearAlert
  } } = useContext(UserContext);

  useEffect(() => {
    // call get function from the user context
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * openUser modal from add new user
   */
  const openUserModal = useCallback(() => {
    toggleModal(true, 'Add new user', true);
  }, [toggleModal])

  /**
   * close alert block
   */
  const closeAlertMessage = useCallback(() => {
    clearAlert();
  }, [clearAlert]);

  return (
    <div>
      {usersData && usersData.error ? <Alert type="error" message={usersData.error} open={!!usersData.error} handleClose={closeAlertMessage} /> : null}
      {usersData.successMsg ? <Alert type="success" message={usersData.successMsg} open={!!usersData.successMsg} handleClose={closeAlertMessage} /> : null}
      {usersData && usersData.isOpenModal ? <UserModal /> : null}
      <Container >
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            <Grid container justify="space-between" alignItems="center">
              <Typography variant="h6" className={classes.title}>
                List of Users
            </Typography>
              {sessionService.isAdmin() ? <div>
                <Button size="small" color="primary" onClick={openUserModal}>
                  Add User
              </Button>
              </div> : null}
            </Grid>
            <div className={classes.demo}>
              <List>
                {usersData && usersData.users ? usersData.users.map(item => <UserComponent user={item} key={item._id} />) : null}
              </List>
            </div>
          </Grid>
        </Grid>
        {/* {users ? users.map(item => <UserComponent user={item} key={item._id} />) : null} */}
      </Container>
    </div>
  )
}

export default UserList;