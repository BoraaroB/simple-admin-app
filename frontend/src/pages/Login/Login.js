import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Alert from '../../components/Alert/Alert';
import { userAPI } from '../../api/index';
import { sessionService } from '../../sessionServices/sessionServices';
import { LoginContext } from '../../context/loginContext';
import MicrosoftLogin from './MicrosoftLogin';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = () => {

  const classes = useStyles();
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('')

  const { setUser } = useContext(LoginContext);

  const history = useHistory();

  /**
   * login to the app
   * @param {object} e event object 
   */
  const login = async e => {
    try {
      e.preventDefault();
      const { data } = await userAPI.login(userData);
      if (data) {
        sessionService.create(data);
        setUser(data);
        history.push('/users');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.message) {
        setError(err.response.data.error.message || "");
      } else {
        setError(err.response.data.statusText || "");
      }

    }
  };

  /**
   * handle change input fields
   * @param {object} e event 
   */
  const handleChange = e => {
    e.preventDefault();
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * close alert modal
   */
  const handleClose = () => {
    setError('');
  };

  return (
    <Container component="main" maxWidth="xs">
      
      <CssBaseline />
      <div className={classes.paper}>
        {error ? (
          <Alert
            type="error"
            message={error}
            open={!!error}
            handleClose={handleClose}
          />
        ) : null}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
      </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="user"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            Login
        </Button>
        </form>
        <MicrosoftLogin />
      </div>
    </Container>
  )
}

export default Login;


