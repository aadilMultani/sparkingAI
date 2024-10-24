const TryCatch = require("../middleware/tryCatch");
const JobCart = require('../models/jobCard_model');
const Roles = require('../models/roles');
const User = require('../models/user_model');
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require('mongoose');

exports.addJobCart = TryCatch(async (req, res, next) => {
  console.log("req ???", req)
  const user_id = req.body.user_id;
  if (!user_id) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  // const role = await Roles.find();
  const user = await User.find({ _id: user_id, isDeleted: null });
  const jobCart = await JobCart.create(req.body);

  return res.json({
    status: true,
    data: jobCart,
    message: "Job Cart Added Successfully",
  });
});

exports.getAllJobCart = TryCatch(async (req, res, next) => {
  const jobCart = await JobCart.find({ isDeleted: null }).populate('user_id');
  if (!jobCart) return next(new ErrorHandler("jobCart not found", 400));

  return res.json({
    status: true,
    data: jobCart,
  });
})

exports.getSingleJobCart = TryCatch(async (req, res, next) => {
  const jobCart = await JobCart.findById(req.params._id).populate('user_id');
  if (!jobCart) return next(new ErrorHandler("jobCart not found", 400));

  return res.json({
    status: true,
    data: jobCart
  });
});

exports.updateJobcart = TryCatch(async (req, res, next) => {
  const id = req.params._id;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler('Invalid User Id', 400));
  }

  // Check if the job cart exists
  const jobCart = await JobCart.findById(id).where({ isDeleted: null });
  if (!jobCart) {
    return next(new ErrorHandler('Job cart not found', 404));
  }

  // Update the job cart
  try {
    const updatedJobCart = await JobCart.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJobCart) {
      return next(new ErrorHandler(`Cannot update job cart with id=${id}. Maybe job cart was not found!`));
    }
    return res.json({
      status: true,
      data: updatedJobCart,
      message: "Job cart updated successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});


exports.deleteJobcart = TryCatch(async (req, res, next) => {

  const id = req.params._id;
  // check _id given or not
  if (!id) {
    return next(new ErrorHandler('please provide _id', 400));
  }

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler('Invalid User Id', 400));
  }

  const deletedJobCart = await JobCart.findByIdAndUpdate(id,
    {
      $set: {
        isDeleted: new Date().getTime(),
      }
    },
    { new: true }
  ).catch((err) => {
    console.log("err??", err);
  })

  if (!deletedJobCart) {
    return next(new ErrorHandler('jobCart not delete to given id'));
  }

  res.json({
    status: true,
    data: deletedJobCart,
    message: 'jobCart delete successfully',
  })

})
