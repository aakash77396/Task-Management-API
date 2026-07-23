const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
});

module.exports= mongoose.model("BlacklistToken",blacklistTokenSchema);