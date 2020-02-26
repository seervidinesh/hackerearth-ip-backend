const router = require("express").Router();
const { Deliveries, Matches } = require("../database");

router.get("/:pageNo", (req, res) => {
  var perPage = 10;
  var page = Math.max(0, req.params.pageNo);
  Deliveries.find({})
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, result) {
      if (err) throw err;
      Deliveries.estimatedDocumentCount().exec(function(err, count) {
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
  Deliveries.find({ match_id: matchId })
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get("/player-runs/:season/:playerName", (req, res) => {
  const paramsData = {
    season: req.params.season,
    playerName: req.params.playerName
  };

  let finalResult = {
    ids: []
  };
  var data = {
    total: 0,
    fours: 0,
    sixes: 0,
    wickets: 0,
    manOfTheMatch: 0
  };
  var result12 = [];
  Matches.find({ season: paramsData.season })
    .then(result => {
      result.map(item => {
        result12.push(item.id);
        if (item.player_of_match === paramsData.playerName) {
          data.manOfTheMatch += 1;
        }
      });
      Deliveries.find({ match_id: { $in: result12 } })
        .then(result1 => {
          result1.map(item => {
            if (
              item.batsman === paramsData.playerName ||
              item.bowler === paramsData.playerName
            ) {
              finalResult.ids.push(item);
            }
          });
          finalResult.ids.map(val => {
            data.total += parseInt(val.batsman_runs);

            if (val.batsman_runs == 4) {
              data.fours += 1;
            }
            if (val.batsman_runs == 6) {
              data.sixes += 1;
            }
            if (val.bowler === paramsData.playerName) {
              if (val.dismissal_kind.length > 0) {
                data.wickets += 1;
              }
            }
          });
          res.json(data);
        })
        .catch(err => console.log(err));
    })

    .catch(err => console.log(err));
});

module.exports = router;
