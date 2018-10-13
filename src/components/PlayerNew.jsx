import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {Button, Form} from "semantic-ui-react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {createPlayer} from "../actions";
import {connect} from "react-redux";

const Container = styled.div`
    max-width: 700px;
    padding-top: 100px;
    margin: auto;
`;

const ErrorContainer = styled.div`
    color: red;
`;

class PlayerNew extends Component {
    renderField = (field) =>
        <Form.Field>
            <label>{field.label}</label>
            <input type={field.type} {...field.input}/>
            <ErrorContainer>{field.meta.touched ? field.meta.error : ''}</ErrorContainer>
        </Form.Field>;

    onSubmit(values) {
        this.props.createPlayer(values, () => {
            this.props.history.push('/player/list');
        });
    }

    render() {
        const {handleSubmit} = this.props;

        return (
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Container>
                        <Field label={'Name'} name={'name'} type={'text'} component={this.renderField}/>
                        <Field label={'Email'} name={'email'} type={'email'} component={this.renderField}/>
                        <Button basic color={'blue'} type={'submit'}>Submit</Button>
                        <Link to={'/player/list'}><Button basic type={'submit'}>Cancel</Button></Link>
                    </Container>
                </Form>
        );
    }
}

function validate(values) {
    const errors = {};

    if (!values.name || values.name.length < 2) {
        errors.name = 'Enter a valid name'
    }
    if (!values.email) {
        errors.email = 'Enter an email'
    }
    return errors;
}

export default reduxForm({
    validate,
    form: 'PlayerNewForm'
})(
    connect(null, {createPlayer})(PlayerNew)
);