import React from "react"
import {
  HashRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

export default class AppRouter extends React.Component {
  static defaultProps = {
    routes: []
  }

  constructor(props) {
    super(props)
  }

  render() {

    // 传入的路由数组（来自于pages/routes）
    const { routes } = this.props
    
    return (
      <Router>
        <Switch>
          {routes.map(this.creatRoute)}
        </Switch>
      </Router>
    )
  }

  // 创建路由
  creatRoute = (routeConfig, i) => {
    const { key = i, path, exact, component: Comp, params } = routeConfig
    return (
      <Route
        key={key}
        exact={exact}
        path={path}
        render={props => <Comp {...props} params={params} />}
      />
    )
  }

}