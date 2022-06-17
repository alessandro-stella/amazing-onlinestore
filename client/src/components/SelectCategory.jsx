import {
    FormControl, InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import { useEffect, useState } from "react";

function SelectCategory({ value, setCategory, isAllSelectable }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let tempArray = [
            "Arts & Crafts",
            "Automotive",
            "Baby",
            "Beauty & Personal Care",
            "Books",
            "Boy's Fashion",
            "Computers",
            "Deals",
            "Digital Music",
            "Electronics",
            "Girls' Fashion",
            "Health & Household",
            "Home & Kitchen",
            "Industrial & Scientific",
            "Luggage",
            "Men's Fashion",
            "Movies & TV",
            "Music, CDs & Vinyl",
            "Pet Supplies",
            "Software",
            "Sports & Outdoors",
            "Tools & Home Improvement",
            "Toys & Games",
            "Video Games",
            "Women's Fashion",
        ];

        if (isAllSelectable) {
            tempArray.unshift("All");
        }

        setOptions(tempArray);
    }, []);

    return (
        <>
            {options.length !== 0 ? (
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={value}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}>
                        {options.map((singleOption) => (
                            <MenuItem value={singleOption} key={singleOption}>
                                {singleOption}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : null}
        </>
    );
}

export default SelectCategory;
