import fs from 'fs-extra'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { decodeToken } from '../../../utils/jwt';

export default async function handler(req, res) {
    const { method } = req
    const { user } = req.query

    const token = req.headers.authorization.split(' ')[1]
    const { email } = decodeToken(token)

    try {
        const existsIdeas = fs.existsSync(`/tmp/ideas.json`)
        if (!existsIdeas) {
            const empty = []
            fs.outputJsonSync('/tmp/ideas.json', empty)
        }
    } catch (error) {
        console.log(error.message)
    }

    switch (method) {
        case 'GET':
            try {
                if (user == !email) res.status(401).json({ message: "invalid user" })
                const ideasObj = await fs.readJSON("/tmp/ideas.json")
                const userIdeas = ideasObj.filter((idea) => (idea.user === email)).reverse()
                res.status(200).json(userIdeas)
            } catch (error) {
                console.log(error)
            }
            break;
        case 'POST':
            try {
                if (user == !email) res.status(401).json({ message: "invalid user" })
                const id = uuidv4();
                const { title, description } = req.body
                const date = moment().format("D/M/yyyy");
                const time = moment().format("h:mm:ss a");
                const ideaObj = { id, user: email, title, description, date, time }
                try {
                    let ideasObj = await fs.readJSON("/tmp/ideas.json")
                    ideasObj.push(ideaObj)
                    await fs.writeJson('/tmp/ideas.json', ideasObj)
                } catch (error) {
                    console.log("could not write")
                }
                res.status(200).json(ideaObj)
            } catch (error) {
                console.log(error)
            }
            break;
        case 'DELETE':
            try {
                if (user == !email) res.status(401).json({ message: "invalid user" })
                let ideasObj = await fs.readJSON("/tmp/ideas.json")
                ideasObj = ideasObj.filter((idea) => (idea.id !== req.body.ideaId))
                console.log(ideasObj)
                await fs.writeJson('/tmp/ideas.json', ideasObj)
                res.json({ message: "deleted Idea" })
            } catch (error) {
                console.log(error)
            }
            break;
        default:
            res.status(400).json({ message: "method not supported" })
            break;
    }
}