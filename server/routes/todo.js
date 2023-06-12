const express = require('express');
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { task } = req.body;
    const userId = req.user.userId;

    const todo = new Todo({
      task,
      userId,
    });

    await todo.save();
    res.status(201).json({ message: 'Todo created successfully', todo });
  } catch (error) {
    res.status(500).json({ error: `Failed to create todo: ${error}` });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { task } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { task },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo updated successfully', todo });
  } catch (error) {
    res.status(500).json({ error: `Failed to update todo: ${error}` });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete todo: ${error}` });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const perPage = 2;
    const startIndex = (page - 1) * perPage;
    const searchQuery = req.query.search || '';

    const totalCount = await Todo.countDocuments({
      userId,
      task: { $regex: searchQuery, $options: 'i' },
    });

    const todos = await Todo.find({
      userId,
      task: { $regex: searchQuery, $options: 'i' },
    })
      .skip(startIndex)
      .limit(perPage);

    const totalPages = Math.ceil(totalCount / perPage);
    // console.log(todos);
    res.json({ todos, totalPages });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch todos: ${error}` });
  }
});

module.exports = router;
