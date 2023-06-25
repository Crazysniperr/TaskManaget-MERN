import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },

});

  export const listModel = mongoose.model('lists', listSchema);