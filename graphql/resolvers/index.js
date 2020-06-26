import User from '../../models/User';

export default ({
    Query: {
        user: async (_, args) => {
            let { id } = args;

            try {
                const user = await User.findById(id);

                if(!user) throw new Error('User isn\'t exist');

                console.log(user);

                return {
                    ...user._doc,
                    id: user._id
                }
            }
            catch(err) {
                console.log(err);

                throw err;
            }
        },
        users: async (_, args) => {
            let { skip, limit } = args;

            try {
                const users = await User.find().skip(skip).limit(limit);

                console.log(users);

                return users.map((user) => {
                    return {
                        ...user._doc,
                        id: user._id
                    }
                })
            }
            catch(err) {
                console.log(err);

                throw err;
            }
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            let { email, name } = args.input;

            try {
                const isExist = await User.findOne({ email });

                if(!!isExist) throw new Error('Email is already taken');

                const user = new User({
                    email,
                    name
                });

                await user.save();

                return {
                    ...user._doc,
                    id: user._id
                }
            }
            catch(err) {
                console.log(err);

                throw err;
            }
        },
        updateUser: async (_, args) => {
            let { id, input } = args;

            try {
                let user = await User.findOneAndUpdate({ _id: id }, { ...input });
                console.log(user);

                return {
                    ...user._doc,
                    id: user._id
                }
            }
            catch(err) {
                console.log(err);

                throw err;
            } 
        },
        deleteUser: async (_, args) => {
            let { id } = args;

            try {
                const user = await User.findByIdAndDelete(id);

                return {
                    ...user._doc,
                    id: user._id
                }
            }
            catch(err) {
                console.log(err);

                throw err;
            }
        }
    }
})