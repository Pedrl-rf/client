import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { deletePost, likePost } from '../../../actions/posts';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));

    const isCreator = user?.result?._id === post.creator;
    const hasLikedPost = post?.likes?.find((like) => like === (user?.result?._id));

    const handleLike = () => {
        dispatch(likePost(post._id));
    };

    const firstName = post.creator ? post.creator.split(' ')[0] : '';

    // Calcular el tiempo restante antes de que se elimine la publicación
    const expirationTime = moment(post.createdAt).add(48, 'hours');
    const timeRemaining = expirationTime.fromNow(true);

    return (
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
            <div className={classes.overlay}>
                <Typography variant="h6">{firstName}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            </div>
            {isCreator && (
                <div className={classes.overlay2}>
                    <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(post._id)}>
                        <MoreHorizIcon fontSize="default" />
                    </Button>
                </div>
            )}
            <div className={classes.details}>
                <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
            <Typography variant="body2" className={classes.details} component="p">
                Tiempo restante: {timeRemaining}
            </Typography>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" onClick={handleLike}>
                    <ThumbUpAltIcon fontSize="small" /> &nbsp; {hasLikedPost ? 'Unlike' : 'Like'} &nbsp; {post.likeCount}
                </Button>
                {user && isCreator && ( // Verificar si el usuario está autenticado y es el creador
                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize="small" /> Eliminar
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default Post;