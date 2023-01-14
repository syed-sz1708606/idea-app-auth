import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra'

export default async function handler(req, res) {
    const { method } = req

    try {
        const existsUsers = fs.existsSync(`/tmp/users.json`)
        if (!existsUsers) {
            const empty = []
            fs.outputJsonSync('/tmp/users.json', empty)
        }
    } catch (error) {
        console.log(error.message)
    }

    switch (method) {
        case 'GET':
            try {
                const id = uuidv4();
                try {
                    let usersObj = await fs.readJSON("/tmp/users.json")
                    usersObj.push({ id })
                    await fs.writeJson('/tmp/users.json', usersObj)
                } catch (err) {
                    console.error(err)
                }
                res.status(200).json({ id })
            } catch (error) {
                res.stauts(406).json({ message: error.message })
            }
            break;
        default:
            res.status(400).json({ message: "method not supported" })
            break;
    }
}