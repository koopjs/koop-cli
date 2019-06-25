module.exports = function (req, res) {
  this.model.pull(req, (error, data) => {
    if (error) {
      return res.status(500).json({
        message: error.message
      })
    }

    if (!data) {
      return res.status(404).send()
    }

    res.json(data)
  })
}
