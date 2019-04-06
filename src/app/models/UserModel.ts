import { BaseModel } from './BaseModel';

interface IUserModelProps {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    website?: string;
    isLiked?: boolean;
}

export class UserModel extends BaseModel<IUserModelProps> {
    constructor(props: IUserModelProps) {
        super(props);
    }

    static getFilteredByName(name): UserModel[] {
        const filteredUsers = UserModel.list().filter((userInstance) => {
            if (((userInstance.props.name) || '').toLowerCase().indexOf(name.toLowerCase()) > -1) {
                return userInstance;
            }
        })
        return filteredUsers;
    }

    static resource = 'user';
}
