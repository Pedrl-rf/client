
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', site: '', tags: '', selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.find((p) => p._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(sessionStorage.getItem('profile'));

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', site: '', tags: '', selectedFile: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, creator: user?.result?._id }));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, creator: user?.result?._id }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Por favor, inicie sesion
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editando un post "${post?.title}"` : 'Crear un post'}</Typography>
        <TextField name="title" variant="outlined" label="Titulo" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="site" variant="outlined" label="Sitio" fullWidth value={postData.site} onChange={(e) => setPostData({ ...postData, site: e.target.value })} />
        <TextField name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>
          {currentId ? 'Actualizar' : 'Crear'}
        </Button>

        {/* Mostrar botones adicionales solo si el post es del usuario actual */}
        {post?.creator === user?.result?._id && currentId !== 0 && (
          <>
            <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Borrar</Button>
          </>
        )}
      </form>
    </Paper>
  );
};

export default Form;
