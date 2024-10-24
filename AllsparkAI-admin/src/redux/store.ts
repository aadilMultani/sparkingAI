import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducer/userReducer';
import { dropdownReducer } from './reducer/dropdownReducer';

const store = configureStore({
    reducer: {
        authReducer,
        dropdownReducer
    }
});

export default store;

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;