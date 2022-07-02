import "../styles/loadingData.css";

function LoadingData() {
    return (
        <div className="loading-data">
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="loading-data__text">Loading...</div>
        </div>
    );
}

export default LoadingData;
