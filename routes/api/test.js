const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../elasticsearch/connection');

router.get('/test', async function (req,res, next) {
    const allRecords = [];

    var { _scroll_id, hits } = await client.search({
        index: 'apd_reports',
        scroll: '10s',
        body: {
            from: 0,
            size : 100,
            query: {
                bool: {
                    must: [
                        {
                            match_all: {},
                        },
                        {
                            range: {
                                "rep_date_time": {
                                    from: "now-30d/m",
                                    to: "now/m",
                                    include_lower: true,
                                    include_upper: true,
                                    format: "epoch_millis",
                                    boost: 1
                                }
                            }
                        }
                    ]
                }
            },
            sort: [
                { "rep_date_time": "desc" }
            ]
        }
    })

    while(hits && hits.hits.length) {
        // Append all new hits
        allRecords.push(...hits.hits)

        var { _scroll_id, hits } = await client.scroll({
            scrollId: _scroll_id,
            scroll: '10s'
        })
    }
    
    res.json({ data: allRecords })
});

module.exports = router;