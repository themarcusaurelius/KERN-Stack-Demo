const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../elasticsearch/connection');

const URL = `https://data.austintexas.gov/resource/fdj4-gpfu.json`;

router.get('/stop', () => {
    client.cluster.health({},function(err,resp,status) {  
        console.log("-- Client Health --",resp);
    });
}) 
     
router.get('/crime_bulk', async () => {
    offset = 0;
    value = 500;
    limit = 500;
    
    incrementOffset = () => {
        offset += value;
        return offset 
    } 
    
    indexAllDocs = async () => {
        try {
            const APD_POLICE_REPORTS = await axios.get(`${URL}?$limit=${limit}&$offset=${offset}&$order=rep_date_time DESC`,{
                headers: {
                    'Content-Type': [
                        'application/json',  
                        'charset=utf-8' 
                    ]
                }
            })

            results = APD_POLICE_REPORTS.data.length
         
            APD_POLICE_REPORTS.data.map(async report => (
                reportsObject = {
                    incident_number: report.incident_report_number,
                    crime_type: report.crime_type,
                    ucr_code: report.ucr_code,
                    address: report.address,
                    family_violence: report.family_violence,
                    occ_date_time: report.occ_date_time,
                    rep_date_time: report.rep_date_time,
                    rep_time: report.rep_time,
                    location_type: report.location_type,
                    address: report.address,
                    zip_code: report.zip_code,
                    council_district: report.council_district,
                    sector: report.sector,
                    district: report.district,
                    pra: report.pra,
                    census_tract: report.census_tract,
                    latitude: report.latitude,
                    longitude: report.longitude,
                    location:
                        { 
                            lat: report.latitude,
                            lon: report.longitude,
                        }
                },

                await client.index({ 
                    index: 'apd_reports',
                    id: report.incident_report_number,
                    type: 'data',
                    body: reportsObject
                }), (err, resp, status) => {
                    console.log(resp);
                }
            ));
    
            if (APD_POLICE_REPORTS.data.length > 0) {
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