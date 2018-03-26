/* @flow */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import type { AuthState } from '../../data/modules/auth';
import { logout } from '../../data/modules/auth';
import { socketsSubscribe } from '../../middleware/socketActions';
import type { SocketState } from "../../data/modules/websockets";

import * as Names from '../../constants/names';

type Props = {
    auth: AuthState,
    socketState: SocketState,
    socketsSubscribe: (topic: string) => void,
    logout: () => void
};

type State = {
    subscriptionActive: boolean
}

class AppNav extends React.Component<Props, State> {
    props: Props;
    state: State;

    constructor(props) {
        super(props);
        this.state = {
            subscriptionActive: false
        };
    }

    authLink(signedIn) {
        if (!signedIn) {
            return (
                <NavItem>
                    <NavLink><Link to="/signin">Sign In</Link></NavLink>
                </NavItem>
            )
        }

        return (
                <NavItem>
                    <NavLink><a href='#' onClick={() => this.props.logout()}>Sign Out</a></NavLink>
                </NavItem>
        );
    }

    userLink(signedIn, username) {
        if (signedIn) {
            return (
                <NavItem>
                    <NavLink><div className="text-info">{username}</div></NavLink>
                </NavItem>
            )
        }

        return null;
    }

    roleLink(signedIn, roles) {
        if (signedIn && roles.some(item => Names.ROLE_ADMIN === item)) {
            return (
                <NavItem>
                    <NavLink><a href='#'>AdminMenu</a></NavLink>
                </NavItem>
            )
        }

        return null;
    }

    socketLink() {

        const { connected } = this.props.socketState;

        if (connected && !this.state.subscriptionActive) {
            this.props.socketsSubscribe('/topic/update');
            this.setState({subscriptionActive: true})
        }

        if (connected && this.state.subscriptionActive) {
            return (
                <NavItem>
                    <NavLink><a href='#'>{this.props.socketState.message}</a></NavLink>
                </NavItem>
            )
        }

        return null;
    }

    render() {

        const { roles, signedIn, username } = this.props.auth;

        return (
            <Navbar color="dark" expand={true} fixed="top">
                <NavbarBrand href="/">spring-react-boilerplate</NavbarBrand>
                <Nav className="d-flex ml-auto" horizontal="end" navbar>
                    {this.socketLink()}
                    {this.userLink(signedIn, username)}
                    {this.roleLink(signedIn, roles)}
                    <NavItem>
                        <NavLink><Link to="/">Home</Link></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink><Link to="/about-us">About</Link></NavLink>
                    </NavItem>
                    {this.authLink(signedIn)}
                </Nav>
            </Navbar>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    socketState: state.websockets
});
const mapDispatchToProps = { logout, socketsSubscribe };

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AppNav)
);
