import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    ref: "lists",
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

export const taskModel = mongoose.model("tasks", taskSchema);




// const taskSchema = new mongoose.Schema({
//     name: {
//       type: String,
//       required: true
//     },
//     description: {
//       type: String,
//       required: true
//     },
//     dueDate: {
//       type: Date,
//       required: true
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ['Not Started', 'In Progress', 'Completed']
//     },
//     subtasks: [{
//       name: {
//         type: String,
//         required: true
//       },
//       status: {
//         type: String,
//         required: true,
//         enum: ['Not Started', 'In Progress', 'Completed']
//       }
//     }],
//     collection: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Collection',
//       required: true
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   });
