module.exports = [
  {
    method: 'get',
    path: '/',
    controller: (req, res) => {
      res.status(200).send('Welcome to Koop!')
    }
  }
]
