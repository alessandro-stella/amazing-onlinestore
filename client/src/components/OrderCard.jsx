import { useEffect } from "react";

function OrderCard({ orderData }) {
    useEffect(() => {
        console.log(orderData);
    }, []);

    return <div>OrderCard</div>;
}

export default OrderCard;
