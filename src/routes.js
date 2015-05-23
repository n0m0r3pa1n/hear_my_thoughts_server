import users_routes from './routes/users_routes.js'
import sessions_routes from './routes/sessions_routes.js'
let routes = []
routes = routes.concat(users_routes)
routes = routes.concat(sessions_routes)

export default routes