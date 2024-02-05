const express = require("express");
const logicRoutes = express.Router();
const {
  EditUsername,
  ViewProfile,
  DeleteAccount,
  ViewNotifications,
  CreateProfile,
} = require("../controllers/UserDetails");
const {
  addLandLeasingDetails,
  withdrawLandLeasingDetails,
  UpdateLandSizeDetails,
  UserViewPendingLeaseRequests,
  UserViewApprovedLeaseRequests,
} = require("../controllers/LeasingDetails");
const {
  ApproveUpdatedLandSizeDetails,
  ApproveWithdrawLeaseRequest,
  ApproveLeaseRequest,
  ViewAdminNotifications,
  ViewPendingLeaseRequests,
} = require("../controllers/AdminDetails");
const userMiddleware = require("../middlewares/userMiddlewares");
const { log } = require("console");

logicRoutes.use(userMiddleware);
logicRoutes.post('/edit-username', EditUsername)
logicRoutes.post('/create-profile', CreateProfile)
logicRoutes.post('/view-profile', ViewProfile)
logicRoutes.get('/delete-account', DeleteAccount)
logicRoutes.get('/view-notifications', ViewNotifications)
logicRoutes.get('/view-admin-notifications', ViewAdminNotifications)
logicRoutes.post('/add-land-leasing-details', addLandLeasingDetails)
logicRoutes.post('/withdraw-land-leasing-details', withdrawLandLeasingDetails)
logicRoutes.post('/update-land-size-details', UpdateLandSizeDetails)
logicRoutes.get('/user-view-pending-lease-requests', UserViewPendingLeaseRequests)
logicRoutes.get('/user-view-approved-lease-requests', UserViewApprovedLeaseRequests)
logicRoutes.post('/approve-updated-land-size-details', ApproveUpdatedLandSizeDetails)
logicRoutes.post('/approve-withdraw-lease-request', ApproveWithdrawLeaseRequest)
logicRoutes.post('/approve-lease-request', ApproveLeaseRequest)
logicRoutes.post('/view-pending-lease-requests', ViewPendingLeaseRequests)


module.exports = logicRoutes;
