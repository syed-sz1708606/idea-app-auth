'use client';
import React, { useEffect, useState } from 'react'
import { Button, Card, TextField, Box } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import IdeaCard from '../../components/IdeaCard';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { userStore } from '../store/userStore';

export default function Home() {
  const queryClient = useQueryClient();

  const user = userStore((state) => state.user)
  const token = userStore((state) => state.token)



  const [idea, setIdea] = useState({ title: "", description: "" })
  const [open, setOpen] = useState(false)

  const addIdea = useMutation(async (idea) => {
    await fetch(`/api/${user}/ideas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(idea),
    })

  });

  const handleAdd = () => {
    addIdea.mutate(idea, { onSuccess: () => queryClient.invalidateQueries(["ideas"]) })
    setIdea({ title: "", description: "" })
    setOpen(!open)
  }

  const deleteIdea = useMutation(async (ideaId) => {
    await fetch(`/api/${user}/ideas`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ideaId }),
    })

  });

  const handleDelete = (ideaId) => {
    deleteIdea.mutate(ideaId, { onSuccess: () => queryClient.invalidateQueries(["ideas"]) })
  }

  const handleChange = (e) => {
    setIdea({
      ...idea,
      [e.target.id]: e.target.value
    })
  }

  const { data: ideas } = useQuery(["ideas", user], async () => {
    if (!user) {
      return []
    }
    const response = await fetch(`/api/${user}/ideas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json();
    return data;
  },
    {
      retry: false,
    });

  return (
    <>
      <IconButton color="primary" aria-label="add idea" onClick={() => { setOpen(!open) }}>
        <AddIcon />
      </IconButton>
      <Stack>
        {
          open &&
          <Box >
            <Stack sx={{ width: "50%" }}>
              <TextField id="title" label="Title" type="text" sx={{ my: 3 }} onChange={handleChange}></TextField>

              <TextField id="description" label="Description" type="text" multiline
                rows={5} onChange={handleChange} ></TextField>
            </Stack>
            <Stack direction="row" sx={{ my: 3 }} >
              <IconButton color="primary" aria-label="save idea" onClick={handleAdd} disabled={!(idea.title && idea.description)}>
                <SaveIcon />
              </IconButton>
              <IconButton color="primary" aria-label="cancel add idea" onClick={() => { setOpen(!open) }}>
                <CancelIcon />
              </IconButton>
            </Stack>
          </Box>
        }
        <Stack gap={3}>
          {ideas &&
            (ideas.length > 0 ? (ideas.map((idea, index) => (
              <IdeaCard idea={idea} key={index} handleDelete={handleDelete}></IdeaCard>
            ))) : <></>)
          }
        </Stack>

      </Stack>

    </>
  )
}
