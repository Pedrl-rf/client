import axios from 'axios';

const url = 'http://localhost:5000/posts'; // Asegúrate de que esta URL sea correcta

export const fetchPosts = () => axios.get(url);
export const createPost = (newPost) => axios.post(url, newPost);
export const updatePost = (id, updatedPost) => axios.patch(`${url}/${id}`, updatedPost);