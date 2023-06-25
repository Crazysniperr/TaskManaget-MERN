import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    collections: [{
      name: {
        type: String,
        required: true
      },
      tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }]
    }]
  });


  export const UserModel = mongoose.model('Users', userSchema);