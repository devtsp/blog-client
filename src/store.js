import { createStore, action, thunk, computed } from 'easy-peasy';
import api from './api/posts';

export default createStore({
	posts: [],
	setPosts: action((state, payload) => {
		state.posts = payload;
	}),

	postTitle: '',
	setPostTitle: action((state, payload) => {
		state.postTitle = payload;
	}),

	postBody: '',
	setPostBody: action((state, payload) => {
		state.postBody = payload;
	}),

	editTitle: '',
	setEditTitle: action((state, payload) => {
		state.editTitle = payload;
	}),

	editBody: '',
	setEditBody: action((state, payload) => {
		state.editBody = payload;
	}),

	search: '',
	setSearch: action((state, payload) => {
		state.search = payload;
	}),

	searchResults: [],
	setSearchResults: action((state, payload) => {
		state.searchResults = payload;
	}),

	postCount: computed(state => state.posts.length),

	getPostById: computed(state => {
		return id => state.posts.find(post => post._id.toString() === id);
	}),

	savePost: thunk(async (actions, newPost, helpers) => {
		const { posts } = helpers.getState();
		try {
			const response = await api.post('/posts', newPost);
			actions.setPosts([...posts, response.data]);
			actions.setPostTitle('');
			actions.setPostBody('');
		} catch (err) {
			console.log(`Error: ${err.message}`);
		}
	}),

	deletePost: thunk(async (actions, id, helpers) => {
		const { posts } = helpers.getState();
		try {
			await api.delete('/posts', { data: { id } });
			actions.setPosts(posts.filter(post => post._id !== id));
		} catch (err) {
			console.log(`Error: ${err.message}`);
		}
	}),

	editPost: thunk(async (actions, updatedPost, helpers) => {
		const { posts } = helpers.getState();
		const { _id } = updatedPost;
		try {
			const response = await api.put('/posts', { ...updatedPost, id: _id });
			actions.setPosts(
				posts.map(post => (post._id === _id ? { ...response.data } : post))
			);
			actions.setEditTitle('');
			actions.setEditBody('');
		} catch (err) {
			console.log(`Error: ${err.message}`);
		}
	}),
});
