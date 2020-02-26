const router = require("express").Router();
const { Matches } = require("../database");

router.get("/:pageNo", (req, res) => {
  var perPage = 10;
  var page = Math.max(0, req.params.pageNo);
  Matches.find({})
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, result) {
      if (err) throw err;

      Matches.estimatedDocumentCount().exec(function(err, count) {
        if (err) throw err;

        var pageInfo = {
          firstPage: 1,
          prevPage: page - 1,
          currPage: page,
          nextPage: page + 1,
          totalPages: Math.floor(count / perPage)
        };
        if (page === 1) {
          pageInfo = {
            currPage: page,
            nextPage: page + 1,
            totalPages: Math.floor(count / perPage)
          };
        }
        if (page === Math.floor(count / perPage)) {
          pageInfo = {
            firstPage: 1,
            prevPage: page - 1,
            currPage: page,
            totalPages: Math.floor(count / perPage)
          };
        }
        res.json({ result, pageInfo });
      });
    });
});

router.get("/match/:matchId", (req, res) => {
  var matchId = req.params.matchId;
  Matches.find({ id: matchId })
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

module.exports = router;
