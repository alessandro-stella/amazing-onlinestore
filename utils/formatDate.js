const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const formatDate = () => {
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `${day} ${month} ${year}`;
};

module.exports = formatDate;
