// inside of controllers/index.js

function index(req, res) {
  console.log(req.user);
  console.log("req.user inside index controller: ", req.user);
  res.render("index");
}

module.exports = {
  index,
};
