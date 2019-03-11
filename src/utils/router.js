import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Redirect } from 'react-router-dom'

class PendingRouterLoader extends React.Component {

  static propTypes = {
    routes: PropTypes.array,
    children: PropTypes.any,
    location: PropTypes.object,
    redirect: PropTypes.object
  };

  render() {
    const { children, location, routes, redirect } = this.props;
    const _isRedirect = redirect
      && redirect.to
      && location.pathname === redirect.from
      && !location.pathname.match(new RegExp(redirect.to));
    return (
      <div style={{
        width: '100%',
        height: '100%'
      }}>
        <Route
          routes={routes}
          location={location}
          render={() => children} />
        {_isRedirect ? <Redirect from={redirect.from} to={redirect.to} /> : null}
      </div>
    )
  }
}

// wrap in withRouter
export default withRouter(PendingRouterLoader);
