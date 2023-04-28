import React from "react";
import './SignInFormStyle.css';
import * as d3 from "d3";
import {let_visible_to_admin, let_visible_to_user} from "./BaseScripts";
import axios from "axios";

const EmailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); // RFC 5322. https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression/201378#201378  http://emailregex.com/  got for the javascript

interface SignInProps {
    name?: any;
    value?: any;
}

interface SignInState {
    email: string,
    password: string,
    errors: {
        email: string,
        password: string
    }
}

export function sign_in_hide_bar() {
    let elem = d3.select(".sign_in_form");
    let elem_sign_up = d3.select(".sign_up_form");
    if (elem_sign_up.style("visibility") === "visible") // Важно заметить, что для изменения css нужно менять style, не attr
        elem_sign_up.style("visibility", "hidden")
    if (elem.style("visibility") === "hidden")
        elem.style("visibility", "visible");
    else
        elem.style("visibility", "hidden");
}

export class SignIn extends React.Component<SignInProps, SignInState> {
    constructor(props: SignInProps) {
        super(props);
        const initialState = {
            email: '',
            password: '',
            errors: {
                email: '',
                password: ''
            }
        }
        this.state = initialState;
        this.handleChange_sign_in = this.handleChange_sign_in.bind(this);
    }

    handleChange_sign_in = (event: any) => {
        event.preventDefault();
        const {name, value} = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'email':
                errors.email = EmailRegex.test(value) ? '' : 'Email is not valid!';
                break;
            case 'password':
                errors.password = value.length < 4 ? 'Password must be eight characters long!' : '';
                break;
            default:
                break;
        }
        this.setState(Object.assign(this.state, {errors, [name]: value}));
        console.log(this.state.errors);
    }

    handleSubmit_sign_in = (event: any) => {
        event.preventDefault();
        let is_validate = true;
        Object.values(this.state.errors).forEach(
            (val) => val.length > 0 && (is_validate = false)
        );
        if (is_validate) {
            this.post_request(this.state.email, this.state.password);
            console.log("Registering can be done");
        } else {
            console.log("You cannot be registered!!!")
        }
    }
    post_request = (email: string, password: string) => { // https://axios-http.com/docs/post_example
        console.log(`Testing POST: email=${email}, password=${password}`);
        axios({
            url: 'api/v1/session/create',
            method: 'post',
            data: {
                "user_data": {
                    "email": email,
                    "password": password
                }
            },
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    let_visible_to_admin();
                    // TODO все ок, показываем пользователю основное содержимое
                }
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.status === 400) {
                    alert("Неверный логин или пароль")
                } else {
                    alert("Технические неполадки. Попробуйте войти позже")
                }
            });
    }

    render() {
        const {errors} = this.state
        return (
            <form onSubmit={this.handleSubmit_sign_in} noValidate className={"sign_in_form"}>Войти
                <p>
                    <div className='email'>
                        <label htmlFor="email">Email</label>
                        <input type='email' name='email' onChange={this.handleChange_sign_in}/>
                        {errors.email.length > 0 && <span style={{color: "red"}}>{errors.email}</span>}
                    </div>
                </p>
                <p>
                    <div className='password'>
                        <label htmlFor="password">Пароль</label>
                        <input type='password' name='password' onChange={this.handleChange_sign_in}/>
                        {errors.password.length > 0 && <span style={{color: "red"}}>{errors.password}</span>}
                    </div>
                </p>
                <p>
                    <div className='submit'>
                        <button>Войти</button>
                    </div>
                </p>
            </form>
        );
    }
}



