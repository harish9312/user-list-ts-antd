import { get } from "../utils/HTTP";
import { UserModel } from '../models/UserModel';

/**
 * Calls the API and returns the response.
 * @export 
 * @returns
 */
export async function getUserData() {
    try {
        const response = await get('https://jsonplaceholder.typicode.com/users');
        (response.data || []).forEach(userInstance => {
            const { name, email, phone, website, id, username } = userInstance
            new UserModel({ name, email, phone, website, id, username }).$save();
        });
        return response;
    } catch (error) {
        throw error;
    }
}