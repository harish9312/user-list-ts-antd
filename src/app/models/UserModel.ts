import { BaseModel } from './BaseModel';

export interface IUserModelProps {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    website?: string;
    isLiked?: boolean;
}

/**
 * User Model to store the User Instance coming from the API.
 * @export
 * @class UserModel
 * @extends {BaseModel<IUserModelProps>}
 */
export class UserModel extends BaseModel<IUserModelProps> {
    constructor(props: IUserModelProps) {
        super(props);
    }

    /**
     * Returns the filtered list of user.
     * @static
     * @param {*} name
     * @returns {UserModel[]}
     * @memberof UserModel
     */
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
