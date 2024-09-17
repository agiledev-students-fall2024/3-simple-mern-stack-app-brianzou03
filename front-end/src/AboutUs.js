import React, {useEffect, useState} from 'react';
import axios from 'axios';

function AboutUs(){
    // create state
    const [data, setData] = useState({paragraphs: [], image: ""});

    // fetch data from backend route about 
    useEffect(() => {
        axios.get('http://localhost:5002/about')
        .then(response => setData(response.data))
        .catch(err => console.error(err));
    }, []);

    // return page contents
    return(
        <div>
            <h1>About Brian</h1>
            {data.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            {data.image && <img src={data.image} alt="Me"/>}
        </div>

    );
}

export default AboutUs