'use client';
import { Card, CardActions, CardContent, Stack, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react'

const IdeaCard = ({ idea, handleDelete }) => {
    return (
        <Card sx={{ maxWidth: 450, minHeight: 200 }}>
            <CardContent>
                <Typography sx={{ fontSize: 24 }} gutterBottom>
                    {idea.title}
                </Typography>
                <Typography sx={{ fontSize: 18, marginBottom: 3 }} >
                    {idea.description}
                </Typography>
                <Stack direction="row" gap={2}>
                    <Typography sx={{ fontSize: 14 }}>{idea.date}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{idea.time}</Typography>
                </Stack>
            </CardContent>

            <Stack direction="row">
                <IconButton color="warning" aria-label="delete idea" onClick={() => { handleDelete(idea.id) }}>
                    <DeleteIcon />
                </IconButton>
            </Stack>

        </Card>
    )
}

export default IdeaCard