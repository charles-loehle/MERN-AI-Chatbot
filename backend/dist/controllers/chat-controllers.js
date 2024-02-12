import User from '../models/User.js';
import { configureOpenAI } from '../config/openai-config.js';
import { OpenAIApi } from 'openai';
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .send({ message: 'User not registered or token malfuctioned' });
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send({ message: 'Permissions did not match' });
        }
        // get chats from database mernaichatbot.user.chats
        return res.status(200).json({ message: 'OK', chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: error.message });
    }
};
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: 'User not registered or token malfuctioned' });
        }
        // get user's chats from database mernaichatbot.user.chats
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        // add new chats from form input
        chats.push({ content: message, role: 'user' });
        user.chats.push({ content: message, role: 'user' });
        // send all chats plus new one to openai api
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        // get openai api response
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: chats,
        });
        // save openai response to database
        user.chats.push(chatResponse.data.choices[0].message);
        // save every thing to database
        await user.save();
        // get response from openai api
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        // get user by id
        const user = await User.findById(res.locals.jwtData.id);
        // if user not found, send error message
        if (!user) {
            return res
                .status(401)
                .send({ message: 'User not registered or token malfuctioned' });
        }
        // check if user's id in database doesn't match id in jwt
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send({ message: 'Permissions did not match' });
        }
        //@ts-ignore
        // reset chats array
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: 'OK' });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: 'ERROR', cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map