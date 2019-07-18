import React from "react";

export default function asyncComponent(importComponent) {

  // react组件
  class AsyncComponent extends React.Component {
    constructor(props) {
      super(props)

      // state
      this.state = { comp: null }
    }

    componentDidMount() {

      // 延时导入组件
      importComponent().then(({ default: comp }) => {
        this.setState({ comp })
      })
    }

    render() {
      const { comp: Comp } = this.state

      // 渲染组件
      return Comp ? <Comp {...this.props} /> : null
    }
  }

  return AsyncComponent
}