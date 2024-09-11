import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { searchPosts } from '../../actions/posts';
import useStyles from '../Posts/Post/styles';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchPosts(searchQuery));
    } else {
      // Recargar la página si la búsqueda está vacía
      window.location.reload();
    }
  };

  return (
    <div className={classes.searchBar}>
      <TextField
        name="search"
        variant="outlined"
        label="Buscar Posts"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleSearch} className={classes.searchButton} variant="contained" color="primary">
        Buscar
      </Button>
    </div>
  );
};

export default SearchBar;
