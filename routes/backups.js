const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const Product = require("../models/productModel.js");

router.post("/uploadProductBackup", (req, res, next) => {
    const productJSON = [
        {
            name: "Padella",
            price: "24",
            category: "Home & Kitchen",
            description: "Grande padella in ghisa fantastica sgravata",
            image: "https://i.imgur.com/079QmAN.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "12",
        },

        {
            name: "Coperchio",
            price: "13",
            category: "Home & Kitchen",
            description:
                "Fantastico coperchio per pentole, fatto a mano dal diavolo",
            image: "https://i.imgur.com/qHUwEKr.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "534",
        },

        {
            name: "sasso",
            price: "5000",
            category: "Tools & Home Improvement",
            description: "Un sasso un sacco bello lel",
            image: "https://i.imgur.com/qSkVFKS.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "665",
        },

        {
            name: "Fornello",
            price: "56",
            category: "Home & Kitchen",
            description: "Un bel fornello per bruciare i ne",
            image: "https://i.imgur.com/LSjM9kL.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "271",
        },

        {
            name: "Borraccia",
            price: "12",
            category: "Home & Kitchen",
            description:
                "Na' borraccia peggio di quel cesso che ci hanno dato al volterra, madonna che schifo",
            image: "https://i.imgur.com/FoUXPXO.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "75",
        },

        {
            name: "Boxxettino",
            price: "34",
            category: "Toys & Games",
            description: "Goxxeofs",
            image: "https://i.imgur.com/Y4FWe1j.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "28",
        },

        {
            name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: "109.95",
            category: "Men's Fashion",
            description:
                "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "126",
        },

        {
            name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
            price: "109",
            category: "Electronics",
            description:
                "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
            image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "543",
        },

        {
            name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
            price: "29.95",
            category: "Women's Fashion",
            description:
                "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
            image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "748",
        },

        {
            name: "Mens Casual Slim Fit",
            price: "15.99",
            category: "Men's Fashion",
            description:
                "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
            image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "634",
        },

        {
            name: "Mens Casual Premium Slim Fit T-Shirts ",
            price: "22.3",
            category: "Men's Fashion",
            description:
                "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
            image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "981",
        },

        {
            name: "Mens Cotton Jacket",
            price: "55.99",
            category: "Men's Fashion",
            description:
                "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "153",
        },

        {
            name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
            price: "10.99",
            category: "Beauty & Personal Care",
            description:
                "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
            image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "365",
        },

        {
            name: "Opna Women's Short Sleeve Moisture",
            price: "7.95",
            category: "Women's Fashion",
            description:
                "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
            image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "148",
        },

        {
            name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
            price: "695",
            category: "Beauty & Personal Care",
            description:
                "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
            image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "364",
        },

        {
            name: "White Gold Plated Princess",
            price: "9.99",
            category: "Beauty & Personal Care",
            description:
                "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
            image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "794",
        },

        {
            name: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
            price: "114",
            category: "Electronics",
            description:
                "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
            image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "53",
        },

        {
            name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
            price: "56.99",
            category: "Women's Fashion",
            description:
                "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
            image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "478",
        },

        {
            name: "MBJ Women's Solid Short Sleeve Boat Neck V ",
            price: "9.85",
            category: "Women's Fashion",
            description:
                "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
            image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "69",
        },

        {
            name: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
            price: "599",
            category: "Electronics",
            description:
                "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
            image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "145",
        },

        {
            name: "Solid Gold Petite Micropave",
            price: "168",
            category: "Beauty & Personal Care",
            description:
                "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
            image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "368",
        },

        {
            name: "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
            price: "64",
            category: "Electronics",
            description:
                "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
            image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "47",
        },

        {
            name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
            price: "39.99",
            category: "Women's Fashion",
            description:
                "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
            image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "17",
        },

        {
            name: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
            price: "109",
            category: "Electronics",
            description:
                "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
            image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "689",
        },

        {
            name: "DANVOUY Womens T Shirt Casual Cotton Short",
            price: "12.99",
            category: "Women's Fashion",
            description:
                "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
            image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "45",
        },

        {
            name: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
            price: "999.99",
            category: "Electronics",
            description:
                "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
            image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "37",
        },

        {
            name: "Salame",
            price: "15",
            category: "Home & Kitchen",
            description: "Un salamino un sacco buono",
            image: "https://i.imgur.com/sJnkTPD.jpg",
            sellerUsername: "AmazingOfficial",
            inStock: "465",
        },
    ];

    Product.insertMany(productJSON)
        .then((products) => res.status(200).json({ success: true, products }))
        .catch((err) => res.status(400).json({ msg: "backup error" }));
});

router.post("/uploadUserBackup", (req, res, next) => {
    const usersJSON = [
        {
            _id: "62880fbd70413d67bbac585a",
            username: "Skyluca",
            email: "luca201103@gmail.com",
            password:
                "$2b$10$XaHhrkqgZVdXFYvFNHDL7.3ElASrJ.CVlJjI3xJUJrX6deAfA8Mtu",
            registeredOn: "20 May 2022",
            isSeller: true,
            resetPasswordToken: "",
            resetPasswordTokenExpire: "",
            __v: 0,
        },
        {
            _id: "627e25baf1c0ecd55ffccfd6",
            username: "aaaaa",
            email: "aaaa@gmail.com",
            password:
                "$2b$10$HB8Kfj02HFr6jZldoY2alOfd1JwRKAXpRnkJMxRuMw/40PGRbTbV2",
            registeredOn: "13 May 2022",
            isSeller: true,
            resetPasswordToken: "",
            resetPasswordTokenExpire: "",
            __v: 0,
        },
        {
            _id: "627e250cf1c0ecd55ffccfcd",
            username: "Ale's Boyfirend",
            email: "ivan.mastrocesare@gmail.com",
            password:
                "$2b$10$eijB4xWAQghcMEblFy34we6jYHwtqIM4XH0YH.b9WZERKTuwYrlWm",
            registeredOn: "13 May 2022",
            isSeller: true,
            resetPasswordToken: "",
            resetPasswordTokenExpire: "",
            __v: 0,
        },
        {
            _id: "627d134502d923bf5ce520ab",
            username: "Heinrich Himmler",
            email: "simonebonaccorso17@gmail.com",
            password:
                "$2b$10$KnY90pqe2UYN0LrNUjkiAe/rWeW4RzGD31P2ui49fxd3//tlCNqhu",
            registeredOn: "12 May 2022",
            isSeller: true,
            resetPasswordToken: "",
            resetPasswordTokenExpire: "",
            __v: 0,
        },
        {
            _id: "627ae6181c86a722f81caf71",
            username: "Palla12",
            email: "ashjrock03@gmail.com",
            password:
                "$2b$10$FCSFf61xGNDeE6QynZJxgu2p6USCejVvwXAGj6Ora.nE7Cggx4AAG",
            registeredOn: "10 May 2022",
            isSeller: true,
            resetPasswordToken: "",
            resetPasswordTokenExpire: "",
            __v: 0,
        },
        {
            _id: "6266ab5769fa2400873a14dc",
            username: "AmazingOfficial",
            email: "alessandro.stella2004@gmail.com",
            password:
                "$2b$10$bEmWFAnji1ifvjYTxJtGqOhJbAvuLP8nVT5H9ofFqCxPZFu5zlzya",
            registeredOn: "27 April 2022",
            isSeller: true,
            resetPasswordToken: "",
            resetPasswordTokenExpire: "",
            __v: 0,
        },
    ];

    User.insertMany(usersJSON)
        .then((users) => res.status(200).json({ success: true, users }))
        .catch((err) => res.status(400).json({ msg: "backup error" }));
});

module.exports = router;
