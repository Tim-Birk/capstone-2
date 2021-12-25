import persistPlugin from '@rematch/persist';
import { init } from '@rematch/core';
import storage from 'redux-persist/lib/storage';
import * as models from './models';

const persistConfig = {
  key: 'root',
  storage,
};

const store = init({ models, plugins: [persistPlugin(persistConfig)] });

export default store;
