const mssql = require('mssql');
const config = require('../config/userConfig');

async function addLandLeasingDetails(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        const userID = req.decodedToken.userID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('UserID', UserID)
          request.input('County', user.County)
          request.input('SubCounty', user.SubCounty)
          request.input('Constituency', user.Constituency)
          request.input('LandSize', user.LandSize)
          let results = await request.execute('dbo.addLandLeasingDetails')
          res.json({
            success: true,
            message: "Added land leasing details successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error adding land leasing details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = addLandLeasingDetails
