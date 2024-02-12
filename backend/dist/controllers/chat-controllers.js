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
        // get response from openai api
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
        // get user's chats
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
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: chats,
        });
        user.chats.push(chatResponse.data.choices[0].message);
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
        // `res.locals` property is an object that holds response local variables specific to the current request. i.e. jwtData
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .send({ message: 'User not registered or token malfuctioned' });
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send({ message: 'Permissions did not match' });
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        // get response from openai api
        return res.status(200).json({ message: 'OK' });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: 'ERROR', cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map