import React from "react";
import "./LoginPage.css";

export function LoginPage() {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    return (
        <div>
            <h2>Login</h2>
            <form className="LoginPage-form">
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId}/>

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" />

                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}
