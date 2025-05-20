import React from "react";
import { Header } from "./Header.tsx";

export function MainLayout(props: React.PropsWithChildren<{}>) {
    return (
        <div>
            <Header />
            <div style={{padding: "0 2em"}}>
                {props.children}
            </div>
        </div>
    );
}
