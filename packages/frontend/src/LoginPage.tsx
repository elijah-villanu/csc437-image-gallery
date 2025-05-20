import React from "react";
import { MainLayout } from "./MainLayout.tsx";
import "./LoginPage.css";

export function LoginPage() {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    return (
        <MainLayout>
            <h2>Login</h2>
            <form className="LoginPage-form">
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId}/>

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" />

                <input type="submit" value="Submit"/>
            </form>
        </MainLayout>
    );
}
