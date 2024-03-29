const fs = require('fs')
const jsonServer = require('json-server')
const path = require('path')

const server = jsonServer.create()

const router = jsonServer.router(path.resolve(__dirname, 'db.json'))

server.use(jsonServer.defaults({ noCors: false }))
server.use(jsonServer.bodyParser)

// Нужно для небольшой задержки, чтобы запрос проходил не мгновенно, имитация реального апи
server.use(async (req, res, next) => {
  // eslint-disable-next-line promise/param-names
  await new Promise((res) => {
    setTimeout(res, 800)
  })
  next()
})

// Эндпоинт для логина
server.post('/login', (req, res) => {
  try {
    const { email, password } = req.body
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8')
    )
    const { users = [] } = db

    const userFromBd = users.find(
      (user) => user.email === email && user.password === password
    )

    if (userFromBd) {
      const response = { ...userFromBd }
      delete response.password
      return res.json(response)
    }

    return res.status(403).json({ message: 'User not found' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: e.message })
  }
})

// Роуты, которые должны быть доступны без авторизации
const notProtectedRoutes = [
  {
    regExp: /\/articles\/*/,
    method: 'GET',
  },
  {
    regExp: /\/comments\/*/,
    method: 'GET',
  },
  {
    regExp: /\/profile\/*/,
    method: 'GET',
  },
]

// проверяем, авторизован ли пользователь
server.use((req, res, next) => {
  if (
    !req.headers.authorization &&
    !notProtectedRoutes.some(
      ({ method, regExp }) => regExp.test(req.path) && method === req.method
    )
  ) {
    return res.status(403).json({ message: 'AUTH ERROR' })
  }

  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }

  next()
})

server.get('/articles', (req, res) => {
  const { _page, _limit, _expand } = req.query

  req.query._expand = _expand

  const articles = router.db.get('articles').value()
  const profiles = router.db.get('profiles').value()

  const currentPage = parseInt(_page) || 1
  const perPage = parseInt(_limit) || 10

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage

  const lastIndexOfArticles = articles.length - 1

  const pagedArticles = articles.slice(startIndex, endIndex).map((article) => ({
    ...article,
    profile:
      profiles.find((profile) => profile.id === article.profileId) ?? null,
  }))

  res.json({
    currentPage,
    perPage,
    total: articles.length,
    data: pagedArticles,
    hasMore: endIndex <= lastIndexOfArticles,
  })
})

server.use('/articles', (req, res, next) => {
  const { _expand } = req.query
  req.query = _expand
  next()
})

server.use(router)

// запуск сервера
server.listen(8000, () => {
  console.log('server is running on 8000 port')
})
