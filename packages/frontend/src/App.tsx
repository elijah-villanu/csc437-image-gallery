import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { ImageSearchForm } from "./images/ImageSearchForm.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { useRef, useState } from "react";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData.ts";
import { ProtectedRoute } from "./ProtectedRoutes.tsx";

function App() {
    const [imageData, _setImageData] = useState<IApiImageData[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [errorOcc, setErrorOcc] = useState(false);
    const [searchbox, setSearchbox] = useState("");
    const [token, setToken] = useState("")
    const ref = useRef(0);

    function imgDataChange(updatedData: IApiImageData[]) {
        _setImageData([...updatedData])
    }
    


    async function imageRequest(request: string) {
        ref.current = ref.current + 1;
        const reqCount = ref.current;

        // Reset error state just in case
        setErrorOcc(false)

        try {
            setIsFetching(true)
            const response = await fetch(request,{
                method: "GET",
                headers: {"Authorization": `Bearer ${token}`}
            });

            // Check for subsequent requests
            // Ignore if not the most recent request
            if (reqCount === ref.current) {
                setIsFetching(false)
            } else return;

            if (response.status >= 400) {
                if (reqCount === ref.current) {
                    setErrorOcc(true);
                    return;
                } else return;
            }

            const parsed = await response.json();
            if (parsed) {
                if (reqCount === ref.current) {
                    _setImageData(parsed)
                } else return;
            }

        } catch (error) {
            if (reqCount === ref.current) {
                setErrorOcc(true)
                console.log(error)
            } else return;
        }

    }


    async function handleImageSearch() {
        const params = new URLSearchParams();
        if (searchbox === "") {
            // If search box empty, render all images
            imageRequest(`/api${ValidRoutes.ALLIMG}`)
        } else {
            params.append("q", searchbox)
            imageRequest(`/api${ValidRoutes.APISEARCH}${params}`);
        }

        // Reset search box once submitted
        setSearchbox("");
    }

    function handleSearchBox(searchString: string) {
        setSearchbox(searchString)
    }

    
    // When token set, get another fetch
    function handleSetToken(newToken:string){
        setToken(newToken);
        imageRequest(`/api${ValidRoutes.ALLIMG}`);

    }

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<ProtectedRoute authToken={token}><AllImages data={imageData} fetchState={isFetching} errorState={errorOcc}
                    searchPanel={<ImageSearchForm searchString={searchbox} onSearchRequested={handleImageSearch} onSearchStringChange={handleSearchBox} />} /></ProtectedRoute>} />
                <Route path={ValidRoutes.UPLOAD} element={<ProtectedRoute authToken={token}><UploadPage authToken={token}/></ProtectedRoute>} />
                
                <Route path={ValidRoutes.LOGIN} element={<LoginPage isRegistering={false} addToken={handleSetToken} />} />
                <Route path={ValidRoutes.REGISTER} element={<LoginPage isRegistering={true} addToken={handleSetToken} />} />
                <Route path={ValidRoutes.IMAGES} element={<ProtectedRoute authToken={token}><ImageDetails data={imageData} fetchState={isFetching} errorState={errorOcc} handleChange={imgDataChange} /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}

export default App;
