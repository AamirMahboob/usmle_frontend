"use client"
import React from 'react'
import { Modal, Form, Input, Select, Switch, Divider, notification, Button, Checkbox } from "antd";


const DeleteUserModal = ({ setOpenDeleteUserModal, open }) => {
    return (
        <div>
            <Modal
                title="Delete User"
                open={open}
                onCancel={() => setOpenDeleteUserModal(false)}
                footer={null}
            >

            </Modal>
        </div>
    )
}

export default DeleteUserModal