import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { useEffect, useState } from "react";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData.ts";

function App() {
    const [imageData, _setImageData] = useState<IApiImageData[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [errorOcc, setErrorOcc] = useState(false);

    function imgDataChange(updatedData: IApiImageData[]){
        _setImageData([...updatedData])
    }

    useEffect(() => {
        fetch(`/api${ValidRoutes.ALLIMG}`).then(responseObj => {
            if (responseObj.status >= 400) {
                setErrorOcc(true)
                setIsFetching(false)
                return null;
            } else {
                return responseObj.json();
            };
        }).then(parsed => {
            if (parsed) {
                _setImageData(parsed)
            }
            setIsFetching(false)
        }).catch(() => {
            setErrorOcc(true)
            setIsFetching(false)
        });
    }, []);

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<AllImages data={imageData} fetchState={isFetching} errorState={errorOcc} />} />
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
                <Route path={ValidRoutes.IMAGES} element={<ImageDetails data={imageData} fetchState={isFetching} errorState={errorOcc} handleChange={imgDataChange}/>} />
            </Route>
        </Routes>
    );
}

export default App;
