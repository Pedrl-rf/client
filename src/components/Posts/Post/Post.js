import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';
import { deletePost, likePost } from '../../../actions/posts';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));

    const isCreator = user?.result?._id === post.creator;
    const hasLikedPost = post?.likes?.find((like) => like === (user?.result?._id)); // Añadir verificación condicional

    const handleLike = () => {
        dispatch(likePost(post._id));
    };

    // Extraer solo el primer nombre del usuario si post.creator está definido
    const firstName = post.creator ? post.creator.split(' ')[0] : '';

    return (
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
            <div className={classes.overlay}>
                <Typography variant="h6">{firstName}</Typography> {/* Mostrar solo el primer nombre */}
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
            <Typography variant="h6" color="textPrimary" component="p">{post.site}</Typography>
                <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
            <CardContent>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" onClick={handleLike}>
                    <ThumbUpAltIcon fontSize="small" /> &nbsp; {hasLikedPost ? 'Unlike' : 'Like'} &nbsp; {post.likeCount}
                </Button>
                {isCreator && (
                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize="small" /> Eliminar
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default Post;