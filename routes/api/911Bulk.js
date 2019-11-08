const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../elasticsearch/connection');

const URL = `https://data.seattle.gov/resource/fire-911.json`;

router.get('/911_bulk', async () => {
    var offset = 0;
    var value = 500;
    var limit = 500;
    
    incrementOffset = () => {
        offset += value;
        return offset
    }
  
    indexAllDocs = async () => {
        try {
            const SEATTLE_911 = await axios.get(`${URL}?$limit=${limit}&$offset=${offset}&$order=datetime DESC`,{
                headers: {
                    'Content-Type': [
                        'application/json', 
                        'charset=utf-8'
                    ]
                } 
            });
      
            SEATTLE_911.data.map(async call => (
                fireObject = {
                    address: call.address,
                    type: call.type,
                    datetime: call.datetime,
                    incident_number: call.incident_number,
                    latitude: call.report_location.coordinates[1],
                    longitude: call.report_location.coordinates[0],
                    location: { 
                        lat: call.report_location.coordinates[1],
                        lon: call.report_location.coordinates[0],
                    }
                },

                await client.index({ 
                    index: 'seattle911',
                    id: call.incident_number,
                    type: 'data',
                    body: fireObject
                }), (err, res, status) => {
                    console.log(res);
                }
            ));

            if (SEATTLE_911.data.length > 0) {
                incrementOffset()
                indexAllDocs()
            } else {
                console.log('All Documents Have Been Indexed!')
            }
        } catch (err) {
            console.log(err)
        }
    }

    indexAllDocs(); 
})

module.exports = router;