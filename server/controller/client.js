const TryCatch = require('../middleware/tryCatch');
const Client = require('../models/client_model');
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

exports.addClient = TryCatch(
    async (req, res, next) => {
        const { name, contact_information, address_info, type, category, notes, rating } = req.body;

        if (
            !name ||
            !contact_information.email ||
            !contact_information.phone_number
        ) {
            return next(new ErrorHandler('Please fill all required fields', 400));
        }

        const email = contact_information.email;
        const existingClient = await Client.findOne({ email })
        if (existingClient) {
            return next(new ErrorHandler('Client Already exist', 400));
        }

        const client = new Client({
            name,
            contact_information,
            address_info,
            type,
            category,
            notes,
            rating
        });

        // Create New Client
        await client.save();

        return res.json({
            status: true,
            client,
            message: "Client save successfully",
        });
    }
);

exports.updateClient = TryCatch(async (req, res, next) => {
    const id = req.params._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler('Invalid User Id', 400));
    }

    // Check if client not exists
    const client = await Client.findOne({ _id: id, isDeleted: null });
    if (!client) {
        return next(new ErrorHandler('Client not found', 404));
    }

    const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true })
        .then(data => {
            if (data) {
                return res.json({
                    status: true,
                    client: data,
                    message: "Client update successfully",
                });
            } else {
                return next(new ErrorHandler(`Cannot update Client with id=${id}. Maybe Client was not found!`))
            }
        })
        .catch((err) => {
            return next(new ErrorHandler(err.message, 500));
        })
});


exports.getAllClient = TryCatch(async (req, res, next) => {

    const client = await Client.find({ isDeleted: null }).sort({ createdAt: -1 });

    return res.json({
        status: true,
        client,
        message: 'Client fetch successfully',
    });
})

exports.getSingleClient = TryCatch(async (req, res, next) => {
    const id = req.params._id;
    if (!id) {
        return next(new ErrorHandler('Client _id is required.', 400));
    }
    const client = await Client.find({ _id: id, isDeleted: null });

    if (!client)
        return next(new ErrorHandler('Client not found', 404));

    return res.json({
        status: true,
        client,
        message: 'Client fetch successfully',
    });
})

exports.deleteClient = TryCatch(async (req, res, next) => {

    // Check if id not Provided
    const id = req.params._id;
    console.log("id >>>", id);
    if (!id) {
        return next(new ErrorHandler('user _id is required for deleting.', 400));
    }

    const deletedClient = await Client.findByIdAndUpdate(
        id,
        {
            $set: {
                isDeleted: new Date().getTime(),
            }
        },
        { new: true }
    )
        .catch((err) => {
            console.log("err??", err);
        })

    if (!deletedClient) {
        return res.json({
            status: false,
            message: 'Client not found for the given _id.',
        });
    }

    res.json({
        status: true,
        data: deletedClient,
        message: 'Client deleted successfully.',
    });
});