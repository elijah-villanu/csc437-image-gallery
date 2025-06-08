import { useActionState, useId, useState } from "react";

interface IUploadPageProps {
    authToken: string
}

export function UploadPage(props: IUploadPageProps) {

    const [imageURL, setImageURL] = useState("")

    function readAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = (err) => reject(err);
        });
    }
    
    function handlePreview(e: React.ChangeEvent<HTMLInputElement>) {
        const inputElement = e.target;
        const fileObj = inputElement.files?.[0];
        if (!fileObj) {
            return;
        }
        readAsDataURL(fileObj)
            .then((url) => {
                setImageURL(url)
            })
    }

    const [result, submitAction, isPending] = useActionState(
        async (previousState:number, formData: FormData) => {
            if(previousState >= 400){
                //Unused var previous state
                console.log("")
            }
            const response = await fetch(`/api/images`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${props.authToken}` },
                body: formData
            });
            return response.status

        },-1
    );

    const inputId = useId();
    const uploadId = useId();
    return (
        <div>
            <form action={submitAction}>
                <div>
                    <label htmlFor={uploadId}>Choose image to upload: </label>
                    <input
                        name="image"
                        type="file"
                        id={uploadId}
                        accept=".png,.jpg,.jpeg"
                        onChange={handlePreview}
                        required
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label htmlFor={inputId}>
                        <span>Image title: </span>
                        <input name="name" required id={inputId} disabled={isPending} />
                    </label>
                </div>

                <div> {/* Preview img element */}
                    <img style={{ width: "20em", maxWidth: "100%" }} src={imageURL} alt="" />
                </div>

                {/* Submit is self labeling */}
                <input type="submit" value="Confirm upload" disabled={isPending} />
            </form>
            {(result < 400 && result !== -1)&& <h1 aria-live="polite">Successfully Uploaded!</h1>}
            {result >= 400 && <h1 style={{color:"red"}}aria-live="polite">Error Occured With Code: {result}</h1>}
        </div>
    );
}
