/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Button, Container, Form, FormGroup, Label, ListGroup, ListGroupItem, Input, Alert } from 'reactstrap';

import { authenticated, login, logout } from '../../data/modules/auth';
import type { AuthState, Role } from '../../data/modules/auth';
import { socketsConnect } from '../../middleware/socketActions';

type Props = {
    authState: AuthState,
    authenticated: (authData: { roles: Role[] }) => void,
    location: {
        state?: {
            nextPathname?: string
        }
    },
    history: {
        push: (path: string) => void
    },
    login: (username: string, password: string) => void,
    logout: () => void,
    socketsConnect:  () => void
};

type State = {
    authFailed: boolean,
    username: string,
    password: string
};

class SignIn extends React.Component<Props, State> {
    state = {
        authFailed: false,
        username: '',
        password: ''
    };

    handleOnSignIn(event) {
        event.preventDefault();

        const { username, password } = this.state;

        const u = username ? username.trim() : '';
        const p = password ? password.trim() : '';

        if (u.length === 0) {
            return;
        }

        this.props.login(u, p);
        // this.props.socketsConnect();
    }

    handleSignOut(event) {
        event.preventDefault();

        this.props.logout();
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    authFailedMessage() {
        if (!this.props.authState.authFailure) {
            return null;
        }

        return (
            <div>
                <Alert color="warning">
                    <h1>Authentication failed!</h1>
                    <div>Please Enter a valid username and password</div>
                </Alert>
            </div>
        );
    }

    authSucceededMessage() {
        if (this.props.authState.signedIn) {

            const assignedRoles = this.props.authState.roles.map(item => {
                return <ListGroupItem>{item}</ListGroupItem>
            });

            return (
                <div>
                    <Alert color="success">
                        <h1>Authentication Succeeded!</h1>
                        <div>Signed in as: {this.props.authState.username}</div>
                    </Alert>
                    <ListGroup>
                        <ListGroupItem disabled>Assigned Roles</ListGroupItem>
                        {assignedRoles}
                    </ListGroup>
                </div>
            )
        }

        return null;
    }

    render() {

        const { username, password } = this.state;
        const { authState } = this.props;

        const roleList = authState.roles.join();

        return (
            <div>

                <Form>
                    <h1>Sign In</h1>
                    <Container>
                        {this.authSucceededMessage()}
                        {this.authFailedMessage()}
                    </Container>
                    <br/>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="username"
                               name="username"
                               id="username"
                               placeholder="Username"
                               value={username}
                               onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Password</Label>
                        <Input type="password"
                               name="password"
                               id="password"
                               placeholder="Password"
                               value={password}
                               onChange={this.handleChange}
                        />
                    </FormGroup>

                    <Button disabled={authState.signedIn} onClick={e => this.handleOnSignIn(e)}>Login</Button>{' '}
                    <Button disabled={!authState.signedIn} onClick={e => this.handleSignOut(e)}>Logout</Button>
                </Form>
                <br/>
                <div>Roles: {roleList}</div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authState: state.auth
    };
}

/* Inject auth state and dispatch() into props */
export default withRouter(
    connect(mapStateToProps, { authenticated, login, logout, socketsConnect })(SignIn)
);
