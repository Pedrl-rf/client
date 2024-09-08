import React, { useState , useEffect } from 'react';
import { Paper, Typography, TextField, Button } from '@material-ui/core';
import useStyles from './styles';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { createPost , updatePost} from '../../actions/posts';

// Función para convertir un archivo a base64
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const Form = ({ currentId, setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [postData, setPostData] = useState({ creator: '', title: '', site: '', tags: '', selectedFile: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const validate = () => {
        let tempErrors = {};
        tempErrors.creator = postData.creator ? "" : "Este campo es requerido.";
        tempErrors.title = postData.title ? "" : "Este campo es requerido.";
        tempErrors.site = postData.site ? "" : "Este campo es requerido.";
        tempErrors.tags = postData.tags ? "" : "Este campo es requerido.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentId) {
            dispatch(updatePost(currentId, postData));
        } else {
            dispatch(createPost(postData));
        }

        if (validate()) {
            try {
                // Convertir el archivo a base64 si existe y es un tipo válido
                let fileBase64 = '';
                if (postData.selectedFile && postData.selectedFile instanceof Blob) {
                    fileBase64 = await convertToBase64(postData.selectedFile);
                }

                // Crear una copia del postData con el archivo convertido
                const postDataToSend = { ...postData, selectedFile: fileBase64 };

                const response = await axios.post('http://localhost:5000/posts', postDataToSend);
                console.log(response.data);
                clear();
            } catch (error) {
                //setServerError('No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
                console.error('Error al enviar los datos:', error);
            }
        }
};

    const clear = () => {
        setPostData({ creator: '', title: '', site: '', tags: '', selectedFile: '' });
        setErrors({});
        setServerError('')
    }

    const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
    useEffect(() => {
        if (post) setPostData(post)
    }, [post])

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">Sube la fotografía</Typography>
                <TextField 
                    name="creator" 
                    variant="outlined" 
                    label="Creador" 
                    fullWidth 
                    value={postData.creator} 
                    onChange={(e) => setPostData({ ...postData, creator: e.target.value })} 
                    {...(errors.creator && { error: true, helperText: errors.creator })}
                />
                <TextField 
                    name="title" 
                    variant="outlined" 
                    label="Título" 
                    fullWidth 
                    value={postData.title} 
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })} 
                    {...(errors.title && { error: true, helperText: errors.title })}
                />
                <TextField 
                    name="site" 
                    variant="outlined" 
                    label="Lugar" 
                    fullWidth 
                    value={postData.site} 
                    onChange={(e) => setPostData({ ...postData, site: e.target.value })} 
                    {...(errors.site && { error: true, helperText: errors.site })}
                />
                <TextField 
                    name="tags" 
                    variant="outlined" 
                    label="Tags (separados por comas)" 
                    fullWidth 
                    value={postData.tags} 
                    onChange={(e) => setPostData({ ...postData, tags: e.target.value })} 
                    {...(errors.tags && { error: true, helperText: errors.tags })} 
                />
                <div className={classes.fileInput}>
                    <input type="file" onChange={(e) => setPostData({ ...postData, selectedFile: e.target.files[0] })} />
                </div>
                {serverError && <Typography color="error">{serverError}</Typography>}
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Subir</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Limpiar</Button>
            </form>
        </Paper>
    );
};

export default Form;
