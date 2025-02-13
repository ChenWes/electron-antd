
import React from 'react'
import { AsyncImport } from '../components'

import demo from './demo'
import about from './about'

// 路由数组
const routes = [
  { path: '/', exact: true, component: AsyncImport(() => import('./home')), params: { test: 'ok' } },
  demo,
  about,
]


module.exports = routes
