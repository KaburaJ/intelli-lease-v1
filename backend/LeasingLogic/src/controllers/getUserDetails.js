const mssql = require('mssql');
const config = require('../config/userConfig');

async function getUserDetails(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        let UserID = req.session.user.UserID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('UserID', UserID)
          let results = await request.execute('dbo.getUserDetails')
          res.json({
            success: true,
            message: "Obtained user details successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error obtained user details :', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = getUserDetails