import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Modal, Stack, styled, TextField, Typography } from '@mui/material';
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

    useEffect(() => {
        getTodos()

    }, []);

    const getTodos = () => {
        fetch(url + '/api/todos')
            .then((response) => response.json())
            .then((res) => setTodos(res.todos))
            .catch((error) => console.error(error));
        console.log(todos);
    }
    const addTodo = () => {
        console.log(formik.values);
        fetch(url + '/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formik.values)
        })
            .then((response) => response.json())
            .then((res) => {
                console.log((res));
                if(res.todo){
                    setSuccess(true)
                    getTodos()
                }
                else{
                    setError(true)
                }

            }).catch(async error => {
                setError(true)
            })
    }

    const formik = useFormik<Todo>({
        initialValues: {
            title: '',
            description: '',
            status: Status.PENDING
        },
        validationSchema: todoValidationSchema,
        onSubmit: addTodo
    });

    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(true);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [errorMessage, setErrorMessage] = useState<string>("Something went wrong")
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    useEffect(() => {
        const time = setTimeout(() => { setError(false) }, 4500)
        return () => clearTimeout(time)
    }, [error])
    useEffect(() => {
        const time = setTimeout(() => { setSuccess(false); handleClose() }, 2500)
        return () => clearTimeout(time)
    }, [success])

    return (
        <div>
            <Container>
                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
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
                                        <Button>
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
