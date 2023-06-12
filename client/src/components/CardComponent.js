import axios from 'axios';
import React, { useState } from "react";
import { Modal } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import './CardComponent.css'

const CardComponent = ({ todo, onDelete }) => {
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [updatedTask, setUpdatedTask] = useState("");

  const handleDelete = () => {
    onDelete(todo._id);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/todo/${todo._id}`, { task: updatedTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      todo.task = updatedTask;
      hideUpdateModal();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const showDeleteModal = () => {
    setModalDeleteVisible(true);
  };

  const hideDeleteModal = () => {
    setModalDeleteVisible(false);
  };

  const showUpdateModal = () => {
    setModalUpdateVisible(true);
    setUpdatedTask(todo.task);
  };

  const hideUpdateModal = () => {
    setModalUpdateVisible(false);
  };

  return (
    <div className="mt-3 custom_width rounded-full bg-slate-100 custom_container">
      <div className="mx-2">
        <span>Task: {todo.task}</span>
      </div>
      <button className="mx-1" onClick={showDeleteModal}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      <button className="mx-1" onClick={showUpdateModal}>
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <Modal
        title="Delete Todo"
        open={modalDeleteVisible}
        onOk={handleDelete}
        onCancel={hideDeleteModal}
        okType="danger"
        okText='Delete'
      >
        Are you sure you want to delete this todo?
      </Modal>
      <Modal
        title="Update Todo"
        open={modalUpdateVisible}
        onOk={handleUpdate}
        onCancel={hideUpdateModal}
        okType="dashed"
        okText='Update'
      >
        Are you sure you want to update this todo?
        <input
          className="mt-3 ml-2 rounded-md"
          type="text"
          value={updatedTask}
          onChange={(e) => setUpdatedTask(e.target.value)}
          required
        />
      </Modal>
    </div>
  );
};

export default CardComponent;
