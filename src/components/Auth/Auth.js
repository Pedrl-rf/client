import React, { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const classes = useStyles();
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario ya está autenticado
    const user = JSON.parse(localStorage.getItem('profile'));
    if (user) {
      navigate('/'); // Redirige a la página principal si ya está autenticado
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(form, navigate)).then(() => window.location.reload());
    } else {
      dispatch(signin(form, navigate)).then(() => window.location.reload());
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{isSignup ? 'Regístrate' : 'Inicia Sesion'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField name="firstName" label="Nombre" onChange={handleChange} autoFocus half />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="lastName" label="Apellidos" onChange={handleChange} half />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField name="email" label="Correo Electrónico" onChange={handleChange} type="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField name="password" label="Contraseña" onChange={handleChange} type="password" />
            </Grid>
            {isSignup && (
              <Grid item xs={12}>
                <TextField name="confirmPassword" label="Confirma la contraseña" onChange={handleChange} type="password" />
              </Grid>
            )}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? 'Regístrate' : 'Inicia Sesion'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? 'Ya tienes cuenta? Inicia Sesion' : "Regístrate"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
