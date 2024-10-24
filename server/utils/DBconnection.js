const mongoose = require('mongoose');

exports.connectDB = (uri) => {
    mongoose.connect(uri , {
        dbName : 'react-with-typeScript'
    }).then((c) => console.log(`DB connect to ${c.connection.host}`))
    .catch((e) => console.log(e));
}