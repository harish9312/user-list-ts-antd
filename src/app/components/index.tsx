// import Icon from 'antd/lib/Icon';
import Icon from 'antd/lib/Icon';
import Card from 'antd/lib/Card';
import Row from 'antd/lib/Row';
import Input from 'antd/lib/Input';
import Popconfirm from 'antd/lib/Popconfirm';
import * as React from 'react';
import { connect } from 'react-redux';
import { UserModel, IUserModelProps } from '../models/UserModel';
import { getUserData } from '../services/baseService';
import './home.scss';
import { Loader } from './Loader';
import { ANTModal } from './ANTModal';

export interface IHomeProps {
    users: UserModel[];
}

export interface IHomeState {
    filteredUsers: UserModel[];
    isLoading: boolean;
    editingUserId: string;
    searchValue: string;
}

/**
 * HomePage to show the list of users and search bar.
 * @class HomeImpl
 * @extends {React.Component<IHomeProps, IHomeState>}
 */
export class HomeImpl extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        this.state = { filteredUsers: [], searchValue: '', isLoading: true, editingUserId: '' }
    }

    /**
     * Calls the API to get the list of users once the component has been mounted.
     * @memberof HomeImpl
     */
    async componentDidMount() {
        await getUserData();
        this.setState({ isLoading: false })
    }

    /**
     * Saves a like when user clicks on the Like Icon
     * @param {IUserModelProps}  props
     * @memberof HomeImpl
     */
    handleLikeClick = (props: IUserModelProps) => {
        new UserModel({ ...props, isLiked: !props.isLiked }).$update()
    }

    /**
     * Deletes the instance from the list.
     * @param {string} userId 
     * @memberof HomeImpl
     */
    handleUserDelete = (userId: string) => {
        new UserModel({}).$delete(userId);
    }

    /**
     * Toggles the Modal upton user clicks on the pencil icon.
     * @param {string} userId
     * @memberof HomeImpl
     */
    handleEdit = (userId: string) => {
        this.setState({
            editingUserId: userId
        })
    }

    /**
     * Returns the userInstances according to the search of no search text is available then returns all.
     * @returns {UserModel[]}
     * @memberof HomeImpl
     */
    getUserList = () => {
        const { searchValue } = this.state;
        if (searchValue.length <= 0) {
            return UserModel.list();
        }
        return UserModel.getFilteredByName(searchValue);
    }

    /**
     * Renders the User List using a Stateless component.
     * @memberof HomeImpl
     */
    renderUserData = () => {
        return (this.getUserList() || []).map((userInstance, index) =>
            <UserCard
                {...userInstance.props}
                onClickDelete={this.handleUserDelete}
                onLikeClick={this.handleLikeClick}
                onClickEdit={this.handleEdit}
                key={index}
            />)
    }

    render() {
        const props = {
            id: this.state.editingUserId,
            onClose: () => this.setState({ editingUserId: '' })
        }
        return (this.state.isLoading ? <Loader /> :
            < React.Fragment >
                <ANTModal {...props as any} />
                <h4 className="header" >Guest User List</h4>
                <div className="search-bar-container" >
                    <Input onChange={e => this.setState({ searchValue: e.target.value })} placeholder="Type name to search..." />
                </div>
                <Row className="user-card-container" >
                    {this.renderUserData()}
                </Row>
            </React.Fragment >)
    }
}

export function mapStateToProps(state) {
    const users = UserModel.list(state);
    return {
        users
    }
};

export const Home = connect(mapStateToProps)(HomeImpl)

const UserCard = (props) => {
    return <Card
        className="card card-1"
        style={{ width: 300 }}
    >
        <div className="avatar  " ><img src={`https://avatars.dicebear.com/v2/avataaars/${props.username}.svg?options[mood][]=happy`} /></div>
        <Row className="user-info" >
            <div className="username" >{props.name}</div>
            <div className="user-data" ><Icon type="mail" />{props.email}</div>
            <div className="user-data" ><Icon type="phone" />{props.phone}</div>
            <div className="user-data" ><Icon type="global" />{props.website}</div>
        </Row>
        <Row className="icon-container" >
            <Icon
                theme={props.isLiked ? 'filled' : 'outlined'}
                onClick={() => props.onLikeClick(props)}
                className={props.isLiked ? 'is-liked' : ''}
                type="heart"
            />
            <Icon
                onClick={() => props.onClickEdit(props.id)}
                theme="filled"
                type="edit"
            />
            <Popconfirm title={`Are you sure delete user ${props.name}?`}
                onConfirm={() => props.onClickDelete(props.id)}
                okText="Yes"
                cancelText="No">
                <Icon
                    theme="filled"
                    type="delete"
                />
            </Popconfirm>
        </Row>
    </Card>
}
