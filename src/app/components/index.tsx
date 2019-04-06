// import Icon from 'antd/lib/Icon';
import Icon from 'antd/lib/Icon';
import Card from 'antd/lib/Card';
import Row from 'antd/lib/Row';
import Input from 'antd/lib/Input';
import Popconfirm from 'antd/lib/Popconfirm';
import * as React from 'react';
import { connect } from 'react-redux';
import { UserModel } from '../models/UserModel';
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

export class HomeImpl extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        this.state = { filteredUsers: [], searchValue: '', isLoading: true, editingUserId: '' }
    }

    async componentDidMount() {
        await getUserData();
        this.setState({ isLoading: false })
    }

    handleLikeClick = (props) => {
        new UserModel({ ...props, isLiked: !props.isLiked }).$update()
    }

    handleUserDelete = (userId) => {
        new UserModel({}).$delete(userId);
    }

    handleEdit = (userId) => {
        this.setState({
            editingUserId: userId
        })
    }

    getUserList = () => {
        const { searchValue } = this.state;
        if (searchValue.length <= 0) {
            return UserModel.list();
        }
        return UserModel.getFilteredByName(searchValue);
    }

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
