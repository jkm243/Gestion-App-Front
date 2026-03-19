import { Provider } from 'react-redux';
import { store } from './services/store/store';
import { AppRouter } from './router/AppRouter';
import NotistackProvider from './notistack/notistack-provider';

function App() {
  return (
    <NotistackProvider>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </NotistackProvider>
  );
}

export default App;
