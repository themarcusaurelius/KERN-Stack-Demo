const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../elasticsearch/connection');

const atxTraffic = `https://data.austintexas.gov/resource/r3af-2r8x.json`;

router.get('/traffic_bulk', async () => {
    var offset = 0;
    var value = 500;
    var limit = 500;
    
    incrementOffset = () => {
        offset += value;
        return offset
    }
 
    indexAllDocs = async () => {
        try {
            const ATX_TRAFFIC_INCIDENTS = await axios.get(`${atxTraffic}?$limit=${limit}&$offset=${offset}`,{
                headers: {
                    'Content-Type': [
                        'application/json', 
                        'charset=utf-8'
                    ],
                    'X-App-Token': 'iYrdn00qYICOAvLFRMZnE397x'
                }
            })
 
            ATX_TRAFFIC_INCIDENTS.data.map(async traffic => (
                uploadTraffic = {
                    traffic_report_id: traffic.traffic_report_id,
                    published_date: traffic.published_date,
                    issue_reported: traffic.issue_reported,
                    status_date: traffic.traffic_report_status_date_time,
                    status: traffic.traffic_report_status,
                    address: traffic.address,
                    latitude: traffic.latitude,
                    longitude: traffic.longitude, 
                    location:
                        { 
                            lat: traffic.latitude,
                            lon: traffic.longitude,
                        }
                },

                await client.index({ 
                    index: 'atx_traffic',
                    id: traffic.traffic_report_id,
                    type: 'data',
                    wait_for_active_shards: "all",
                    refresh: 'true',
                    body: uploadTraffic
                }), (err, res, status) => {
                    console.log(res);
                }
            ));

            if (ATX_TRAFFIC_INCIDENTS.data.length > 0) {
                incrementOffset()
                indexAllDocs()
            } else {
                console.log('All Documents Have Been Indexed!')
            };
        } catch (err) {
            console.log(err)
        }; 
    };

    indexAllDocs(); 
});

module.exports = router;