import { useState } from "react";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData";

interface INameEditorProps {
    initialValue: string;
    imageId: string;
    onEdit: (arg: IApiImageData[]) => void
}

export function ImageNameEditor(props: INameEditorProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [input, setInput] = useState(props.initialValue);

    const [isFetching, setIsFetching] = useState(false);
    const [errorOcc, setErrorOcc] = useState(false);


    async function handleSubmitPressed() {
        setIsFetching(true);
        setErrorOcc(false);

        try {
            const response = await fetch(`/api${ValidRoutes.ALLIMG}`);

            if (response.status >= 400) {
                setErrorOcc(true);
                return;
            }

            const putResponse = await fetch(`/api${ValidRoutes.ALLIMG}/${props.imageId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: input })
            })

            if (putResponse.status >= 400) {
                setErrorOcc(true);
                return;
            }

            console.log("Successful request")

            // Parsing is an async function
            const parsed: IApiImageData[] = await response.json();

            // Directly mutates parsed array
            const toEdit = parsed.find(img => img.id === props.imageId);

            if (toEdit) {
                toEdit.name = input;
                props.onEdit(parsed);
            }

            //Reset states once request is done
            setIsFetching(false);
            setIsEditingName(false);
            setInput("");

        } catch (error) {
            setErrorOcc(true);
            console.log(error)
            // Reset States if requests fail

            setIsFetching(false);
            setIsEditingName(false);
            setInput("");
        }
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name <input value={input} onChange={e => setInput(e.target.value)} disabled={isFetching} />
                </label>
                <button disabled={(input.length === 0) || isFetching} onClick={handleSubmitPressed} >Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                {isFetching && <div><h1>Working...</h1></div>}
                {errorOcc && <div><h1>ERROR OCCURED</h1></div>}
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={() => setIsEditingName(true)}>Edit name</button>
            </div>
        );
    }
}