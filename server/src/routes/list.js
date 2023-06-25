import express, { json } from "express";

import {listModel} from "../models/Lists.js"

import {taskModel} from "../models/Tasks.js"



const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const lists = await listModel.find({});
        res.json(lists);
      } catch (error) {
        res.json(error);
      }

})


router.post('/', async (req, res) => {
    try {
      const { title } = req.body;
      const newList = new listModel({
        title,
      });
      const listDoc = await newList.save();
      res.json(listDoc);
    } catch (error) {
      res.json(error);
    }
  });


router.patch('/:id',async(req,res)=>{
  try {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    await listModel.findOneAndUpdate({ _id: req.params.id}, {
      $set: req.body
    });
    res.json({ 'message': 'updated successfully'});
  } catch (error) {
    res.json(error);
  }

});


router.delete('/:id', async(req, res) => {
  try {
    // We want to delete the specified list (document with id in the URL)
    const removedListDoc = await listModel.findOneAndRemove({
      _id: req.params.id,
    });
    res.send(removedListDoc);
  } catch (error) {
    res.send(error);
  }
})
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await taskModel.find({})
    res.json(tasks);
    
  } catch (error) {
    res,json(err);
    
  }
})

router.get('/:listId/tasks/:taskId',async(req,res) => {
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const task = await taskModel.findOne({
      _id,_listId
    })
    res.json(task);
    
  } catch (error) {
    res.json(error);
    
  }
})
router.get('/:listId/tasks', async (req, res) => {
  try {
    const tasks = await taskModel.find({
      _listId: req.params.listId
    });

    const list = await listModel.findById(req.params.listId);

    res.send({
      tasks,
      listName: list.title // Assuming the name field exists in your list model
    });
  } catch (error) {
    res.send(error);
  }
});



router.post('/:listId/tasks',async(req,res)=>{
  try {
    const {title} = req.body;
    const _listId = req.params.listId;
    const newTask = await taskModel({title,_listId});
    const TaskDoc = await newTask.save();
    res.json(TaskDoc);

    
  } catch (error) {
    res.json(error);
    
  }
})

router.patch('/:listId/tasks/:taskId', async(req, res) =>{
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    await taskModel.findOneAndUpdate({ _id,_listId}, {
      $set: req.body
    });
    res.json({ 'message': 'updated successfully'});
  } catch (error) {
    res.json(error);
  }
})

router.delete('/:listId/tasks/:taskId',async(req,res)=>{
  try {
    const _id = req.params.taskId;
    const _listId = req.params.listId;
    const removedTaskDoc = await taskModel.findOneAndRemove({
      _id,
      _listId
    });
    res.send(removedTaskDoc);
  } catch (error) {
    res.send(error);
  }

})


  export {router as listRouter};