// generate a jwt here after validating the didToken
// this jwt token should be stored in the localstorage in client side
// use it to serve content (i.e client pass it when requesting ideas)
import { Magic } from '@magic-sdk/admin';
import { createToken } from 'utils/jwt';

const mAdmin = new Magic(process.env.SECRET_KEY);

export default async function login(req, res) {
    console.clear()
    const { method } = req

    switch (method) {
        case "POST":
            try {
                const didToken = req.headers.authorization.substr(7);
                const { email } = await mAdmin.users.getMetadataByToken(didToken)
                mAdmin.token.validate(didToken)
                const token = createToken({ email })
                res.status(200).json({ token });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        default:
            res.status(405).json({ message: "Method is not allowed" })
            break;
    }

}