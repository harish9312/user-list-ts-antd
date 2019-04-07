import Modal from 'antd/lib/Modal';
import * as React from 'react';
import { UserModel } from '../../models/UserModel';
import Input from 'antd/lib/input';
import Form from 'antd/lib/Form';
import './antModal.scss';

export interface IModalProps {
    id: string;
    form: any;
    onClose: () => void
}

export interface IModalState {
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    website?: string;
    isVisible?: boolean;
}

/**
 * Shows modal popup using antd modal library.
 * @class ANTModalImpl
 * @extends {React.PureComponent<IModalProps, IModalState>}
 */
export class ANTModalImpl extends React.PureComponent<IModalProps, IModalState> {
    constructor(props: IModalProps) {
        super(props);
        this.state = { name: '', email: '', username: '', phone: '', website: '', isVisible: false }
    }

    /**
     * Checks if the new id is there to show the modal and toggles modal visibility accordingly.
     * @param {IModalProps} nextProps
     * @memberof ANTModalImpl
     */
    componentWillReceiveProps(nextProps: IModalProps) {
        if (nextProps.id && this.props.id !== nextProps.id) {
            const userInstance = UserModel.get(nextProps.id);
            const { name, email, phone, website, username } = userInstance.props;
            this.setState({ name, email, phone, website, username, isVisible: true })
        }
    }

    /**
     * Executes if user presses OK Button on the Modal
     * @memberof ANTModalImpl
     */
    handleOk = () => {
        let hasFormError = null;
        this.props.form.validateFieldsAndScroll((err, values) => {
            hasFormError = err;
        });
        if (hasFormError) {
            return;
        }
        const { name, email, phone, username, website } = this.state;
        new UserModel({ name, email, username, phone, website, id: this.props.id }).$update();
        this.setState({ isVisible: false })
        this.props.form.resetFields();
        this.props.onClose()
    }

    /**
     * Executes if the user clicks on the Cancel.
     * @memberof ANTModalImpl
     */
    handleCancel = () => {
        this.setState({ isVisible: false })
        this.props.form.resetFields();
        this.props.onClose()
    }

    /**
     * Changes the value of input dynamically using the name attribute.
     * @param {React.ChangeEvent<HTMLInputElement>} event
     * @memberof ANTModalImpl
     */
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const { name, email, phone, website } = this.state;
        const { getFieldDecorator } = this.props.form;
        return <div>
            < Modal
                title={`Edit User ${name}`}
                visible={this.state.isVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form.Item
                    label="Name"
                >
                    {getFieldDecorator('name', {
                        initialValue: name,
                        preserve: false,
                        rules: [{
                            required: true, message: 'Please input name!',
                        }],
                    })(
                        <Input onChange={this.handleInputChange} name="name" />
                    )}
                </Form.Item>
                <Form.Item
                    label="Email"
                >
                    {getFieldDecorator('email', {
                        initialValue: email,
                        preserve: false,
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input onChange={this.handleInputChange} name="email" />
                    )}
                </Form.Item>
                <Form.Item
                    label="Phone"
                >
                    {getFieldDecorator('phone', {
                        initialValue: phone,
                        preserve: false,
                        rules: [{
                            required: true, message: 'Please input Phone Number!',
                        }],
                    })(
                        <Input onChange={this.handleInputChange} name="phone" />
                    )}
                </Form.Item>
                <Form.Item
                    label="Website"
                >
                    {getFieldDecorator('website', {
                        initialValue: website,
                        preserve: false,
                        rules: [{
                            required: true, message: 'Please input website name!',
                        }],
                    })(
                        <Input onChange={this.handleInputChange} name="website" />
                    )}
                </Form.Item>
            </Modal>
        </div >
    }
}
export const ANTModal = Form.create({ name: 'coordinated' })(ANTModalImpl as any);
