import React, { useEffect } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router";
import { useActionState } from "react";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes";

interface ILoginPageProps {
    isRegistering: boolean,
    addToken: (arg:string) => void
}

export function LoginPage(props: ILoginPageProps) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    const navigate = useNavigate();

    function errorMessage(status: number) {
        if (status === 201) {
            return "Successfully created account"
        } else if (status === 400) {
            return "Missing username or password"
        } else if (status === 409) {
            return "Username already taken"
        } else if (status === 401) {
            return "Incorrect Username or password"
        } else if (status === 200) {
            return "Successful Login"
        }
        return "";
    }



    const [result, submitAction, isPending] = useActionState(
        async (previousState:{ status: number, token: string | null }, formData:FormData) => {
            const username = formData.get("username") as string;
            const pass = formData.get("password") as string;

            console.log(previousState)

            // Will get both registration and login
            const response = await fetch(`auth/${props.isRegistering ? "register" : "login"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password: pass }),
            });

            let token: string | null = null;
            if (response.status < 400) {
                token = await response.text();
            }
            return { status: response.status, token };
        },
        { status: -1, token: null }
    );

    // UseActionState was complaining on these functions (addToken and navigate)
    useEffect(() => {
        if (result.token) {
            props.addToken(result.token);
            navigate(`${ValidRoutes.HOME}`);
        }
    // Tracks when new successful reponse comes in and a token is generated
    }, [result.token, props, navigate]);

    return (
        <div>
            {props.isRegistering ? <h2>Register Here</h2> : <h2>Login</h2>}
            <form className="LoginPage-form" action={submitAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} required={true} name="username" disabled={isPending} />

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" required={true} name="password" disabled={isPending} />

                <input type="submit" value="Submit" disabled={isPending} />
            </form>
            {result.status >= 400 && <h1 style={{ color: "red" }} aria-live="polite">{errorMessage(result.status)}</h1>}
            {!props.isRegistering && <Link to={"/register"}>Don't have an account? Register Here!</Link>}
        </div>
    );
}
