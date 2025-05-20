import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";

function App() {
    const POSSIBLE_PAGES = [
        <AllImages />,
        <ImageDetails imageId={"0"} />,
        <UploadPage />,
        <LoginPage />
    ];

    return POSSIBLE_PAGES[0];
}

export default App;
