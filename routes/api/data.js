const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../elasticsearch/connection');

const seattle911 = `https://data.seattle.gov/resource/fire-911.json?$offset=0`;
const apdReports = `https://data.austintexas.gov/resource/fdj4-gpfu.json`;
const atxTraffic = `https://data.austintexas.gov/resource/r3af-2r8x.json?$offset=0`;

//'https://soda.demo.socrata.com/resource/4tka-6guv.json?$order=magnitude DESC'

// @route   GET api/current_data
// @desc    All Data Route
// @access  Public
router.get('/update', async () => {
    // try {
    //     const SEATTLE_911 = await axios.get(seattle911,{
    //         headers: {
    //             'Content-Type': [
    //                 'application/json', 
    //                 'charset=utf-8'
    //             ]
    //         } 
    //     });
  
    //     SEATTLE_911.data.map(async call => (
    //         upload911 = {
    //             address: call.address,
    //             type: call.type,
    //             datetime: call.datetime,
    //             incident_number: call.incident_number,
    //             latitude: call.report_location.coordinates[1],
    //             longitude: call.report_location.coordinates[0],
    //             location: { 
    //                 lat: call.report_location.coordinates[1],
    //                 lon: call.report_location.coordinates[0],
    //             }
    //         },
            
    //         await client.index({
    //             index: 'seattle911',
    //             id: call.incident_number,
    //             type: 'data',
    //             wait_for_active_shards: "all",
    //             refresh: 'true',
    //             body: upload911
    //         }), (err, resp, status) => {
    //             console.log(resp);
    //         }
    //     ));
    // } catch (err) {
    //     console.log(err)
    // }
        

    try {
        const APD_POLICE_REPORTS = await axios.get(apdReports,{
            headers: {
                'Content-Type': [
                    'application/json', 
                    'charset=utf-8'
                ]
            }
        })

        APD_POLICE_REPORTS.data.map(async report => (
            uploadReports = {
                incident_number: report.incident_report_number,
                crime_type: report.crime_type,
                ucr_code: report.ucr_code,
                address: report.address,
                family_violence: report.family_violence,
                occ_date_time: report.occ_date_time,
                rep_date_time: report.rep_date_time,
                location_type: report.location_type,
                address: report.address,
                zip_code: report.zip_code,
                council_district: report.council_district,
                sector: report.sector,
                district: report.district,
                pra: report.pra,
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
                wait_for_active_shards: "all",
                refresh: 'true',
                body: uploadReports
            }), (err, resp, status) => {
                console.log(resp);
            }
        ))
    } catch (err) {
        console.log(err)
    }


    // try {
    //     const ATX_TRAFFIC_INCIDENTS = await axios.get(atxTraffic,{
    //         headers: {
    //             'Content-Type': [
    //                 'application/json', 
    //                 'charset=utf-8'
    //             ],
    //             'X-App-Token': 'iYrdn00qYICOAvLFRMZnE397x'
    //         }
    //     })
        
    //     ATX_TRAFFIC_INCIDENTS.data.map(async traffic => (
    //         uploadTraffic = {
    //             traffic_report_id: traffic.traffic_report_id,
    //             published_date: traffic.published_date,
    //             issue_reported: traffic.issue_reported,
    //             status_date: traffic.traffic_report_status_date_time,
    //             status: traffic.traffic_report_status,
    //             address: traffic.address,
    //             latitude: traffic.latitude,
    //             longitude: traffic.longitude, 
    //             location:
    //                 { 
    //                     lat: traffic.latitude,
    //                     lon: traffic.longitude,
    //                 }
    //         },

    //         await client.index({ 
    //             index: 'atx_traffic',
    //             id: traffic.traffic_report_id,
    //             type: 'data',
    //             wait_for_active_shards: "all",
    //             refresh: 'true',
    //             body: uploadTraffic,
    //         }), (err, res, status) => {
    //             console.log(res);
    //         }

    //     )); 
    // } catch (err) {
    //     console.error(err);
    // };
})

module.exports = router;