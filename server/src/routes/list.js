// import express from "express";
// import { listModel } from "../models/Lists.js";
// import { taskModel } from "../models/Tasks.js";
// import randomColor from "randomcolor";
// import auth from "../middleware/authmiddleware.js";

// const router = express.Router();

// router.get("/",  async (req, res) => {
//   try {
//     const lists = await listModel.find({});
//     res.json(lists);
//   } catch (error) {
//     res.json(error);
//   }
// });

// router.post("/",async (req, res) => {
//   try {
//     const { title } = req.body;
//     const color = randomColor(); // Generate a random color
//     const newList = new listModel({
//       title,
//       color,
//     });
//     const listDoc = await newList.save();
//     res.json(listDoc);
//   } catch (error) {
//     res.json(error);
//   }
// });

// router.patch("/:id", async (req, res) => {
//   try {
//     await listModel.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
//     res.json({ message: "updated successfully" });
//   } catch (error) {
//     res.json(error);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const removedListDoc = await listModel.findOneAndRemove({
//       _id: req.params.id,
//     });
//     res.send(removedListDoc);
//   } catch (error) {
//     res.send(error);
//   }
// });

// router.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await taskModel.find({})
//       .populate({
//         path: "_listId",
//         select: "color",
//         model: "lists"
//       });

//     const taskData = tasks.map((task) => {
//       return {
//         _id: task._id,
//         title: task.title,
//         _listId: {
//           _id: task._listId._id,
//           color: task._listId.color,
//         },
//       };
//     });

//     res.json(taskData);
//   } catch (error) {
//     res.json(error);
//   }
// });



// router.get("/:listId/tasks/:taskId", async (req, res) => {
//   try {
//     const _id = req.params.taskId;
//     const _listId = req.params.listId;
//     const task = await taskModel.findOne({
//       _id,
//       _listId,
//     });
//     res.json(task);
//   } catch (error) {
//     res.json(error);
//   }
// });

// router.get("/:listId/tasks", async (req, res) => {
//   try {
//     const tasks = await taskModel.find({
//       _listId: req.params.listId,
//     });

//     const list = await listModel.findById(req.params.listId);

//     res.send({
//       tasks,
//       listName: list.title,
//       listColor: list.color,
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// router.post("/:listId/tasks", async (req, res) => {
//   try {
//     const { title } = req.body;
//     const _listId = req.params.listId;
//     const newTask = await taskModel({ title, _listId });
//     const TaskDoc = await newTask.save();
//     res.json(TaskDoc);
//   } catch (error) {
//     res.json(error);
//   }
// });

// router.patch("/:listId/tasks/:taskId", async (req, res) => {
//   try {
//     const _id = req.params.taskId;
//     const _listId = req.params.listId;
//     await taskModel.findOneAndUpdate({ _id, _listId }, { $set: req.body });
//     res.json({ message: "updated successfully" });
//   } catch (error) {
//     res.json(error);
//   }
// });

// router.delete("/:listId/tasks/:taskId", async (req, res) => {
//   try {
//     const _id = req.params.taskId;
//     const _listId = req.params.listId;
//     const removedTaskDoc = await taskModel.findOneAndRemove({
//       _id,
//       _listId,
//     });
//     res.send(removedTaskDoc);
//   } catch (error) {
//     res.send(error);
//   }
// });

// export { router as listRouter };



import express from "express";
import { listModel } from "../models/Lists.js";
import { taskModel } from "../models/Tasks.js";
import randomColor from "randomcolor";
import auth from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/",auth, async (req, res) => {
  try {
    
    const userId = req.userId; // Access the authenticated user's ID
    console.log("User ID:", userId);
    const lists = await listModel.find({ createdBy: userId }); // Find lists associated with the user
    res.json(lists);
  } catch (error) {
    res.json(error);
  }
});

router.post("/",auth,  auth,async (req, res) => {
  try {
    const { title } = req.body;
    const color = randomColor();
    const userId = req.userId; // Access the authenticated user's ID
    const newList = new listModel({
      title,
      color,
      createdBy: userId, // Associate the list with the user
    });
    const listDoc = await newList.save();
    res.json(listDoc);
  } catch (error) {
    res.json(error);
  }
});

router.patch("/:id",auth,  async (req, res) => {
  try {
    await listModel.findOneAndUpdate({ _id: req.params.id, createdBy: req.userId }, { $set: req.body });
    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const removedListDoc = await listModel.findOneAndRemove({
      _id: req.params.id,
      createdBy: req.userId,
    });
    res.json(removedListDoc);
  } catch (error) {
    res.json(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const userId = req.userId; // Access the authenticated user's ID
    const tasks = await taskModel.find({ createdBy: userId })
      .populate({
        path: "_listId",
        select: "color",
        model: "lists"
      });

    const taskData = tasks.map((task) => {
      return {
        _id: task._id,
        title: task.title,
        _listId: {
          _id: task._listId._id,
          color: task._listId.color,
        },
      };
    });

    res.json(taskData);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:listId/tasks/:taskId",auth,  async (req, res) => {
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const userId = req.userId; // Access the authenticated user's ID
    const task = await taskModel.findOne({
      _id,
      _listId,
      createdBy: userId,
    });
    res.json(task);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:listId/tasks", auth,  async (req, res) => {
  try {
    const tasks = await taskModel.find({
      _listId: req.params.listId,
      createdBy: req.userId,
    });

    const list = await listModel.findById(req.params.listId);

    res.send({
      tasks,
      listName: list.title,
      listColor: list.color,
    });
  } catch (error) {
    res.send(error);
  }
});

router.post("/:listId/tasks", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const _listId = req.params.listId;
    const userId = req.userId; // Access the authenticated user's ID
    const newTask = await taskModel({ title, _listId, createdBy: userId });
    const TaskDoc = await newTask.save();
    res.json(TaskDoc);
  } catch (error) {
    res.json(error);
  }
});


router.patch("/:listId/tasks/:taskId/toggle", auth, async (req, res) => {
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const userId = req.userId; // Access the authenticated user's ID

    // Find the task based on the given ID and list ID
    const task = await taskModel.findOne({
      _id,
      _listId,
      createdBy: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle the checkbox state
    task.isChecked = !task.isChecked;

    // Save the updated task
    await task.save();

    res.json({ message: "Checkbox state updated successfully" });
  } catch (error) {
    res.json(error);
  }
});

router.patch("/:listId/tasks/:taskId/complete", auth, async (req, res) => {
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const userId = req.userId; // Access the authenticated user's ID

    // Find the task based on the given ID and list ID
    const task = await taskModel.findOne({
      _id,
      _listId,
      createdBy: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle the checkbox state
    task.isCompleted = !task.isCompleted;

    // Save the updated task
    await task.save();

    res.json({ message: "Task completion status updated successfully" });
  } catch (error) {
    res.json(error);
  }
});

router.patch("/:listId/tasks/:taskId", auth,async (req, res) => {
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const userId = req.userId; // Access the authenticated user's ID
    await taskModel.findOneAndUpdate({ _id, _listId, createdBy: userId }, { $set: req.body });
    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:listId/tasks/:taskId",auth, async (req, res) => {
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const userId = req.userId; // Access the authenticated user's ID
    const removedTaskDoc = await taskModel.findOneAndRemove({
      _id, 
      _listId,
      createdBy: userId,
    });
    res.send(removedTaskDoc);
  } catch (error) {
    res.send(error);
  }
});

export { router as listRouter };

