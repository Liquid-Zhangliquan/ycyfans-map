import './assets/style/view/index.scss';
import './assets/style/common/normalize.css';
import './assets/style/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import routes from './routes/index';
import { store } from './redux/index';
// import serviceWorker from './utils/serviceWorker';
const env = process.env.NODE_ENV || 'development';
const RootApp = () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <Router>
        {routes}
      </Router>
    </Provider>
  </LocaleProvider>
);

// Render the main component into the dom
if (env === 'development') {
  window.onload = () => {
    const render = Component => {
      ReactDOM.render(
        <AppContainer>
          <Component />
        </AppContainer>,
        document.getElementById('app'),
      );
    };
    render(RootApp);

    // HMR
    if (module.hot) {
      module.hot.accept('./routes', () => {
        render(RootApp);
      });
    }
  };
} else {
  window.onload = () => {
    ReactDOM.render(
      <RootApp />,
      document.getElementById('app'),
    );
  };
}

// serviceWorker();
