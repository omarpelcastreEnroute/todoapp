import React, { useEffect, useState } from 'react'
import { Alert, Autocomplete, Box, Button, Card, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, Modal, Pagination, Select, Stack, styled, TextField, Typography } from '@mui/material';
import { AddCircleOutlineOutlined, CancelOutlined, Delete, SaveOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { Todo, Status, VALIDATIONS } from '@nxreact/data'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const url = "http://localhost:3333"
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    minWidth: '400px',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
};
const itemsPerPage = 15;

export const Todos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const todoValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Enter a title")
            .min(VALIDATIONS.TITLE.min, 'Title must have at least ' +VALIDATIONS.TITLE.min+' characters')
            .max(VALIDATIONS.TITLE.max, 'Title can not be longer than '+VALIDATIONS.TITLE.max+' characters'),
        description: Yup.string()
            .required("Enter a description")
            .min(VALIDATIONS.DESCRIPTION.min, 'description must have at least '+VALIDATIONS.DESCRIPTION.min+' characters')
            .max(VALIDATIONS.DESCRIPTION.max, 'description can not be longer than '+VALIDATIONS.DESCRIPTION.max+' characters')
    });
    const todoEditValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Enter a title")
            .min(VALIDATIONS.TITLE.min, 'Title must have at least ' +VALIDATIONS.TITLE.min+' characters')
            .max(VALIDATIONS.TITLE.max, 'Title can not be longer than '+VALIDATIONS.TITLE.max+' characters'),
        description: Yup.string()
            .required("Enter a description")
            .min(VALIDATIONS.DESCRIPTION.min, 'description must have at least '+VALIDATIONS.DESCRIPTION.min+' characters')
            .max(VALIDATIONS.DESCRIPTION.max, 'description can not be longer than '+VALIDATIONS.DESCRIPTION.max+' characters'),
        status: Yup.mixed().oneOf([Status.PENDING, Status.IN_PROGRESS, Status.DONE]).required()
    });

    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const filteredTodos = (): Todo[] => {
        if (filter == 'all')
            return todos.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage);
        let todosFilteredAux = todos.filter((todo) => todo.status == filter)
        return todosFilteredAux.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage);

    }

    const changeFilter = (value: Status | string) => {
        if (value == 'all') {
            setCurrentPage(0)
            setTotalPages(Math.ceil(todos.length / itemsPerPage))
        } else {
            let todosFilteredAux = todos.filter((todo) => todo.status == value)
            setCurrentPage(0)
            setTotalPages(Math.ceil(todosFilteredAux.length / itemsPerPage))
        }
        setFilter(value)
    }
    useEffect(() => {
        getTodos()
    }, []);

    const getTodos = () => {
        fetch(url + '/api/todos')
            .then((response) => response.json())
            .then((res) => {
                if(res.todos){
                    setTodos(res.todos);
                    if (filter == 'all')
                        setTotalPages(Math.ceil(res.todos.length / itemsPerPage))
                    else {
                        let todosFilteredAux = res.todos.filter((todo:Todo) => todo.status == filter)
                        setCurrentPage(0)
                        setTotalPages(Math.ceil(todosFilteredAux.length / itemsPerPage))
                    }
                }else{
                    if(res.message)
                        setErrorMessage(res.message)
                    else
                        setErrorMessage("Something went wrong trying to get todos")
                    setError(true)
                }
            })
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
    const changeTodoStatus = (todo: Todo, value: Status | null) => {
        if (!value) return
        todo.status = value
        fetch(url + '/api/todos/' + selectedId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.todo) {
                    getTodos()
                }
                else {
                    setErrorMessage('Something went wrong trying to change todo status')
                    setError(true)
                }
            }).catch(async error => {
                setError(true)
            })
    }
    const deleteTodo = () => {
        if (selectedId == '') return
        fetch(url + '/api/todos/' + selectedId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((res) => {
                if (res == true) {
                    getTodos()
                    setSuccessDelete(true)
                }
                else {
                    setErrorMessage('Something went wrong trying to delete todo')
                    setError(true)
                }

            }).catch(async error => {
                setErrorMessage('Something went wrong trying to delete todo')
                setError(true)
            })
        handleClose()
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

    const [secondary, setSecondary] = useState(true);
    const [filter, setFilter] = useState<Status | string>(Status.PENDING);

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [showFlag, setShowFlag] = useState(false);
    const [showTodo, setShowTodo] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleOpenDelete = (todo: any) => {
        setSelectedId(todo._id)
        setTodoSelected(todo)
        setOpenDelete(true);
    }
    const handleOpenTodoView = () => setShowTodo(true);
    const handleClose = () => { setOpen(false); setShowTodo(false); setOpenDelete(false); setShowFlag(false) }

    const [errorMessage, setErrorMessage] = useState<string>("Something went wrong")
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [successDelete, setSuccessDelete] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<string>('')

    useEffect(() => {
        const time = setTimeout(() => { setError(false); setErrorMessage("Something went wrong") }, 4500)
        return () => clearTimeout(time)
    }, [error])
    useEffect(() => {
        const time = setTimeout(() => { setSuccess(false); }, 2500)
        return () => clearTimeout(time)
    }, [success])
    useEffect(() => {
        const time = setTimeout(() => { setSuccessDelete(false); }, 2500)
        return () => clearTimeout(time)
    }, [successDelete])

    const openEditView = (todo: any) => {
        setShowFlag(false)
        setTodoSelected(todo)
        setSelectedId(todo._id)
        editForm.values.title = todo.title
        editForm.values.description = todo.description
        editForm.values.status = todo.status
        handleOpenTodoView()
    }
    const showTodoModal = (todo: any) => {
        setTodoSelected(todo)
        setSelectedId(todo._id)
        setShowFlag(true)
        handleOpenTodoView()
    }

    const handlePaginationChange = (e: any, newPage: any) => {
        setCurrentPage(newPage - 1);
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
                                    <Stack direction={'row'} justifyContent='center' spacing={2}>
                                        <Button variant="outlined" size="large" color='secondary'
                                            onClick={handleClose}
                                        >
                                            <CancelOutlined />
                                            cancel
                                        </Button>
                                        <Button variant="outlined" color='success' size="large" type='submit'>
                                            <AddCircleOutlineOutlined />
                                            Create
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        </Box>
                    </Modal>
                </div>
                <div>
                    <Modal
                        open={openDelete}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            <Typography textAlign={'center'} variant='subtitle1' marginBottom={3}>
                                Are you sure you want to delete <b>{todoSelected.title}</b>?
                            </Typography>
                            <Stack direction={'row'} justifyContent='center' spacing={2}>
                                <Button variant="outlined" size="large" color='secondary'
                                    onClick={handleClose}
                                >
                                    <CancelOutlined />
                                    cancel
                                </Button>
                                <Button variant="outlined" size="large" color='error'
                                    onClick={deleteTodo}
                                >
                                    <Delete />
                                    delete
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>
                </div>
                <div>
                    <Modal
                        open={showTodo}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            {showFlag ? (
                                <Stack spacing={2}>
                                    {error && <Alert sx={{ marginBottom: '20px' }} severity="error">{errorMessage}</Alert>}
                                    <Typography variant='h4'>
                                        {todoSelected.title}
                                    </Typography>
                                    <Typography variant='body1'>
                                        {todoSelected.description}
                                    </Typography>
                                    <Button disabled variant='text'>{todoSelected.status}</Button>
                                    {(todoSelected.status == Status.PENDING || todoSelected.status == Status.IN_PROGRESS) &&
                                        <Stack direction='row' justifyContent={'end'} margin={0} spacing={0}>
                                            <Select
                                                id="filterTodoShow"
                                                value={todoSelected.status}
                                                variant='outlined'
                                                sx={{ width: '50%' }}
                                                color='info'
                                                onChange={(event) => { changeTodoStatus(todoSelected, event.target.value as Status) }}
                                            >
                                                <MenuItem value={Status.PENDING}>{Status.PENDING}</MenuItem>
                                                <MenuItem value={Status.IN_PROGRESS}>{Status.IN_PROGRESS}</MenuItem>
                                                <MenuItem value={Status.DONE}>{Status.DONE}</MenuItem>
                                            </Select>
                                            <Button color='error' onClick={() => handleOpenDelete(todoSelected)}>
                                                <Delete />
                                                delete
                                            </Button>
                                            <Button color='secondary' onClick={() => openEditView(todoSelected)}>
                                                <EditIcon />
                                                edit task
                                            </Button>
                                        </Stack>
                                    }
                                </Stack>
                            )
                                :
                                (
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
                                                onChange={(event, value) => {
                                                    editForm.setFieldValue("status", value)
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
                                            <Stack direction={'row'} justifyContent='center' spacing={2}>
                                                <Button variant="outlined" size="large" color='secondary'
                                                    onClick={handleClose}
                                                >
                                                    <CancelOutlined />
                                                    cancel
                                                </Button>
                                                <Button variant="outlined" color='success' size="large" type='submit'>
                                                    <SaveOutlined />
                                                    Save
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </form>
                                )}
                        </Box>
                    </Modal>
                </div>
                <Typography variant='h2'> Todo App</Typography>
                <Button variant="contained" onClick={handleOpen} >Create New Task</Button>
                <Box sx={{ flexGrow: 1 }}>
                    {successDelete && <Alert sx={{ margin: '20px' }} severity="success">Todo has been deleted succesfully</Alert>}
                    {error && <Alert sx={{ margin: '20px' }} severity="error">{errorMessage}</Alert>}
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Tasks
                    </Typography>
                    <Box display={'flex'} justifyContent={'end'}>
                        <Select
                            id="filterTodo"
                            value={filter}
                            label="filter"
                            variant='standard'
                            onChange={(event) => { changeFilter(event.target.value) }}
                        >
                            <MenuItem value={"all"}>all</MenuItem>
                            <MenuItem value={Status.PENDING}>{Status.PENDING}</MenuItem>
                            <MenuItem value={Status.IN_PROGRESS}>{Status.IN_PROGRESS}</MenuItem>
                            <MenuItem value={Status.DONE}>{Status.DONE}</MenuItem>
                        </Select>
                    </Box>
                    <List sx={{ maxHeight: '60vh', overflow: 'scroll' }}>
                        {filteredTodos().map((todo: any) => (
                            <Card key={todo._id} sx={{ marginBottom: '10px' }}>
                                <ListItem >
                                    <ListItemText
                                        primaryTypographyProps={{ fontSize: '1.6rem' }}
                                        secondaryTypographyProps={{
                                            fontSize: '0.9rem', whiteSpace: 'nowrap',
                                            overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '122ch'
                                        }}
                                        onClick={() => showTodoModal(todo)}
                                        primary={todo.title}
                                        secondary={secondary ? todo.description : null}
                                    />
                                    <ListItemIcon>
                                        <Button disabled={true}>
                                            {todo.status}
                                        </Button>
                                    </ListItemIcon>
                                    <ListItemIcon>
                                        <Button color='error' onClick={() => handleOpenDelete(todo)}>
                                            <Delete />
                                        </Button>
                                    </ListItemIcon>
                                    <ListItemIcon>
                                        <Button color='secondary' onClick={() => openEditView(todo)}>
                                            <EditIcon />
                                        </Button>
                                    </ListItemIcon>
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                    <Pagination count={totalPages} variant="outlined" color="primary"
                        siblingCount={1}
                        boundaryCount={1}
                        page={currentPage + 1}
                        onChange={(e, newPage) => handlePaginationChange(e, newPage)} />
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={secondary}
                                    onChange={(event) => setSecondary(event.target.checked)}
                                />
                            }
                            label="Show description"
                        />
                    </FormGroup>
                </Box>
            </Container>
        </div >
    )
}
