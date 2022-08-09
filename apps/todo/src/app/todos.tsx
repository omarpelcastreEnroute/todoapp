import React, { useEffect, useState } from 'react'
import { Alert, Autocomplete, Box, Button, Card, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Modal, Stack, styled, TextField, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { Todo, Status } from '@nxreact/data'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const url = "http://localhost:3333"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
};

export const Todos = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const todoValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Enter a title")
            .min(12, 'Title must have at least 12 characters')
            .max(120, 'Title can not be longer than 120 characters'),
        description: Yup.string()
            .required("Enter a description")
            .min(100, 'description must have at least 100 characters')
            .max(1000, 'description can not be longer than 1000 characters')
    });
    const todoEditValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Enter a title")
            .min(12, 'Title must have at least 12 characters')
            .max(120, 'Title can not be longer than 120 characters'),
        description: Yup.string()
            .required("Enter a description")
            .min(100, 'description must have at least 100 characters')
            .max(1000, 'description can not be longer than 1000 characters'),
        status: Yup.mixed().oneOf([Status.PENDING, Status.IN_PROGRESS, Status.DONE]).required()
    });

    useEffect(() => {
        getTodos()

    }, []);

    const getTodos = () => {
        fetch(url + '/api/todos')
            .then((response) => response.json())
            .then((res) => setTodos(res.todos))
            .catch((error) => console.error(error));
    }
    const addTodo = () => {
        fetch(url + '/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formik.values)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.todo) {
                    setSuccess(true)
                    getTodos()
                }
                else {
                    setError(true)
                }

            }).catch(async error => {
                setError(true)
            })

        setTimeout(handleClose, 2500)
    }
    const setEditToDo = () => {
        fetch(url + '/api/todos/' + selectedId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editForm.values)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.todo) {
                    setSuccess(true)
                    getTodos()
                }
                else {
                    setError(true)
                }

            }).catch(async error => {
                setError(true)
            })

        setTimeout(handleClose, 2500)
    }

    const [todoSelected, setTodoSelected] = useState<Todo>({
        title: '',
        description: '',
        status: Status.PENDING
    })

    const formik = useFormik<Todo>({
        initialValues: {
            title: '',
            description: '',
            status: Status.PENDING
        },
        validationSchema: todoValidationSchema,
        onSubmit: addTodo
    });
    const editForm = useFormik<Todo>({
        initialValues: todoSelected,
        validationSchema: todoEditValidationSchema,
        onSubmit: setEditToDo
    });

    const [dense, setDense] = useState(false);
    const [secondary, setSecondary] = useState(true);

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleClose = () => { setOpen(false); setOpenEdit(false) }

    const [errorMessage, setErrorMessage] = useState<string>("Something went wrong")
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<string>('')


    useEffect(() => {
        const time = setTimeout(() => { setError(false) }, 4500)
        return () => clearTimeout(time)
    }, [error])
    useEffect(() => {
        const time = setTimeout(() => { setSuccess(false); }, 2500)
        return () => clearTimeout(time)
    }, [success])

    const openEditView = (todo: any) => {
        setTodoSelected(todo)
        setSelectedId(todo._id)
        editForm.values.title = todo.title
        editForm.values.description = todo.description
        editForm.values.status = todo.status
        handleOpenEdit()
    }

    return (
        <div>
            <Container>
                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            <form onSubmit={formik.handleSubmit}>
                                <Stack spacing={2}>
                                    {success && <Alert sx={{ marginBottom: '20px' }} severity="success">Todo has been created succesfully</Alert>}
                                    {error && <Alert sx={{ marginBottom: '20px' }} severity="error">{errorMessage}</Alert>}
                                    <TextField
                                        id="title"
                                        label="Title"
                                        type="text"
                                        name='title'
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                    />
                                    <TextField
                                        id="description"
                                        label="Description"
                                        multiline
                                        fullWidth
                                        rows={8}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                        variant="outlined"
                                    />
                                    <Button variant="contained" color='success' size="large" type='submit'>
                                        Create
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Modal>
                </div>
                <div>
                    <Modal
                        open={openEdit}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            <form onSubmit={editForm.handleSubmit}>
                                <Stack spacing={2} sx={{ textAlign: 'center' }}>
                                    {success && <Alert sx={{ marginBottom: '20px' }} severity="success">Todo has been edited succesfully</Alert>}
                                    {error && <Alert sx={{ marginBottom: '20px' }} severity="error">{errorMessage}</Alert>}
                                    <Typography variant='h4'>Edit Todo</Typography>
                                    <TextField
                                        id="titleEdit"
                                        label="Title"
                                        type="text"
                                        name='title'
                                        value={editForm.values.title}
                                        onChange={editForm.handleChange}
                                        error={editForm.touched.title && Boolean(editForm.errors.title)}
                                        helperText={editForm.touched.title && editForm.errors.title}
                                    />
                                    <TextField
                                        id="descriptionEdit"
                                        label="Description"
                                        name='description'
                                        multiline
                                        fullWidth
                                        rows={8}
                                        value={editForm.values.description}
                                        onChange={editForm.handleChange}
                                        error={editForm.touched.description && Boolean(editForm.errors.description)}
                                        helperText={editForm.touched.description && editForm.errors.description}
                                        variant="outlined"
                                    />
                                    <Autocomplete
                                        id='status-option'
                                        fullWidth
                                        sx={{ width: '100%' }}
                                        options={[Status.PENDING, Status.IN_PROGRESS, Status.DONE]}
                                        value={editForm.values.status}
                                        onChange={(event,value) => {
                                            editForm.setFieldValue("status",value)
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label="Select a status"
                                                margin='normal'
                                                error={editForm.touched.status && Boolean(editForm.errors.status)}
                                                helperText={editForm.touched.status && editForm.errors.status}
                                                // inputProps={{ readOnly: true }}
                                            />}
                                    />
                                    <Button variant="contained" color='success' size="large" type='submit'>
                                        Edit
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Modal>
                </div>


                <Typography variant='h2'> Todo App</Typography>
                <Button variant="contained" onClick={handleOpen} >Create New Task</Button>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Tasks
                    </Typography>
                    <List dense={dense}>
                        {todos.map((todo: any) => (
                            <Card key={todo._id} sx={{ marginBottom: '10px' }}>
                                <ListItem >
                                    <ListItemText
                                        primary={todo.title}
                                        secondary={secondary ? todo.description : null}
                                    />
                                    <ListItemIcon>
                                        <Button variant='outlined' disabled={true}>
                                            {todo.status}
                                        </Button>
                                    </ListItemIcon>
                                    <ListItemIcon>
                                        <Button>
                                            <Delete />
                                        </Button>
                                    </ListItemIcon>
                                    <ListItemIcon>
                                        <Button variant='outlined' onClick={() => openEditView(todo)}>
                                            <EditIcon />
                                        </Button>
                                    </ListItemIcon>
                                </ListItem>
                            </Card>
                        ))}
                    </List>

                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={dense}
                                    onChange={(event) => setDense(event.target.checked)}
                                />
                            }
                            label="Enable dense"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={secondary}
                                    onChange={(event) => setSecondary(event.target.checked)}
                                />
                            }
                            label="Enable secondary text"
                        />
                    </FormGroup>

                </Box>

            </Container>
        </div>
    )
}
