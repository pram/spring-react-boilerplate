/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import { Button, Col, Container, Form, FormGroup, Label, Input, Table } from 'reactstrap';

import type { Book, BookAddRequest } from "../../data/modules/books";
import { refreshBooks, requestBookAdd } from "../../data/modules/books";
import type { AuthState } from '../../data/modules/auth';

type Props = {
    authState: AuthState,
    refreshBooks: () => void,
    requestBookAdd:(bookAddRequest: BookAddRequest) => void,
    books: Array<Book>
};

type State = {
    bookName: string,
    bookPrice: number
};

class Home extends React.Component<Props, State> {
    props: Props;
    state: State;

    constructor(props) {
        super(props);
        this.state = {
            bookName: '',
            bookPrice: 0
        };
    }

    componentDidMount() {
        this.props.refreshBooks();
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleAddBook(event) {
        event.preventDefault();

        const { bookName, bookPrice } = this.state;

        const bookAddRequest: BookAddRequest = {name: bookName, price: bookPrice}

        this.props.requestBookAdd(bookAddRequest);
    }

    displayBooks() {

        const { books } = this.props;

        if (books) {

            const loadedBooks = books.map((item) => {
                return (
                    <tr key={item.id}>
                        <th scope="row">{item.id}</th>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                    </tr>
                )
            });

            return (
                <Container className="mt-2 col-md-12">
                    <Table striped bordered>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                            {loadedBooks}
                        </tbody>
                    </Table>
                </Container>
            )
        }

        return null;
    }

    render() {

        const { bookName, bookPrice } = this.state;
        const { authState } = this.props;


        if (!authState.signedIn) {
            return (
                <div>
                    <h1>Home</h1>
                    Please sign in
                </div>
            )
        }

        return (
            <div>
                <h1>Home</h1>
                <Container>
                    <Form>
                        <FormGroup row>
                            <Label for="bookName" sm={2}>Book Name</Label>
                            <Col sm={10}>
                                <Input type="bookName"
                                       name="bookName"
                                       id="bookName"
                                       placeholder="Name of Book"
                                       value={bookName}
                                       onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="bookPrice" sm={2}>Book Price</Label>
                            <Col sm={10}>
                                <Input type="bookPrice"
                                       name="bookPrice"
                                       id="bookPrice"
                                       placeholder="Price of Book"
                                       value={bookPrice}
                                       onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10 }}>
                                <Button onClick={e => this.handleAddBook(e)}>Submit</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>
                {this.displayBooks()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authState: state.auth,
        books: state.books.data
    };
}

export default connect(mapStateToProps, { refreshBooks, requestBookAdd })(Home);
