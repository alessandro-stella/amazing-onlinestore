import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import { useState } from "react";

function RadioCategory({ value, setCategory }) {
    const [options, setOptions] = useState([
        "All",
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
    ]);

    return (
        <>
            {options.length !== 0 ? (
                <FormControl fullWidth>
                    <RadioGroup
                        value={value}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}>
                        {options.map((singleOption) => (
                            <FormControlLabel
                                value={singleOption}
                                control={<Radio />}
                                label={singleOption}
                                key={singleOption}
                                labelPlacement="end"
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            ) : null}
        </>
    );
}

export default RadioCategory;
