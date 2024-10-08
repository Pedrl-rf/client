import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que esta importación sea correcta
import useStyles from './styles';
import ReFoto from '../../images/ReFoto.png';

const NavBar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    // Despacha una acción para hacer logout en la tienda
    dispatch({ type: 'LOGOUT' });
    // Elimina el perfil de localStorage
    localStorage.removeItem('profile');
    // Elimina todos los datos del localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Elimina todas las cookies del navegador (para tu dominio)
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    // Redirige al usuario a la página principal
    navigate('/');
    // Actualiza el estado del usuario
    setUser(null);
    // Recarga la página
    window.location.reload();
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [user?.token]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">
          ReFoto
        </Typography>
        <img className={classes.image} src={ReFoto} alt="ReFoto" height="60" />
      </div>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
              {user.result.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              {user.result.name}
            </Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <>
            <Button component={Link} to="/auth" variant="contained" color="primary">
              Registrarse o Loggin
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
