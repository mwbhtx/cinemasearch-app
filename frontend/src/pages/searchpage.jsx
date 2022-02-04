import './searchpage-styles.css';
import '../styles/global-styles.css';
import { useEffect, useState } from 'react';

import axios from 'axios';

// import asset images
import netflixImage from '../assets/images/netflix.svg';
import huluImage from '../assets/images/hulu.svg';
import hboImage from '../assets/images/hbomax.svg';
import disneyImage from '../assets/images/disneyplus.svg';

import netflix_icon from '../assets/images/netflix_icon.webp';
import disney_icon from '../assets/images/disney_icon.webp';
import hbo_icon from '../assets/images/hbo_icon.webp';
import hulu_icon from '../assets/images/hulu_icon.webp';
import prime_icon from '../assets/images/prime_icon.webp';
import apple_icon from '../assets/images/apple_icon.webp';

class SupportedStreamingService {

    init(name,image) {
        this._name = name;
        this._image = image;
    }

    getName() {
        return this._name;
    }

    getImage() {
        return this._image;
    }

}

const supportedStreamingServices = {
    netflix: netflix_icon,
    hbo: hbo_icon,
    disney: disney_icon,
    hulu: hulu_icon,
    prime: prime_icon,
    apple: apple_icon,
}
const baseURL = 'https://mwbhtx-cinemasearch-6k9ku.ondigitalocean.app/v1/';

export default function SearchPage(props) {

    const [formValues, setFormValues] = useState({
        query: '',
        query_type: 'movie',
    })

    const [mediaQueryResponse, setMediaQueryResponse] = useState([]);

    const handleFormChange = e => {
        setFormValues(
            {
                ...formValues,
                [e.target.name]: e.target.value,
            }
        )
    }

    const onSubmitHandler = async e => {
        e.preventDefault();

        const uri = baseURL + formValues.query_type;
        const requestConfig = {
            url: uri,
            params: formValues,
        }

        try {
            const response = await axios(requestConfig);
            setMediaQueryResponse(response.data);
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='app-container'>

            <header className='header-grid'>

                {/* Column 1 */}
                <nav className='header-col-1'>
                    <ul id='nav-list'>
                        <li><a>HOME</a></li>
                        <li><a>ABOUT</a></li>
                        <li><a>PROJECTS</a></li>
                        <li><a>CONTACT</a></li>
                    </ul>
                </nav>

                {/* Column 2 */}

                <section className='header-col-2'>
                    <span className='header-headings'>
                        <h1>CINEMA<br />SEARCH</h1>
                        <h4>Seek and you shall find.</h4>
                    </span>
                    <form className='form-container' onSubmit={onSubmitHandler}>
                        <select id='type-input' type='text' name='query_type' value={formValues.query_type} onChange={handleFormChange}>
                            <option value='movie'>Movie</option>
                            <option value='tv'>TV</option>
                        </select>
                        <span className='search-submit-container'>
                            <input id='search-input' type='text' placeholder='eg: Mr Robot' name='query' value={formValues.query} onChange={handleFormChange} />
                            <input id='submit-input' type='submit' value='search' />
                        </span>
                    </form>
                </section>
                {/* Column 3 */}

            </header>

            <section id='mid-content-grid'>
                <div id='mid-content-banner'/>
                {/* <AvailableStreams/> */}
                
                <MoviePosterGallery 
                mediaQueryResponse={
                    mediaQueryResponse
                }/>

            </section>
            

            <footer id='footer-grid'>
                <div id='footer-col-1'></div>
                <div id='footer-col-2'> 
                    <h5>lost in space</h5>
                    <i className="fas fa-user-astronaut"></i>
                    <h5>@the_lost_dev</h5>
                </div>
                <div id='footer-col-3'></div>
            </footer>

        </div>
    )
}

function MoviePosterGallery(props) {

    return (
        <>
         <section id='movie-poster-grid'>
            {
                props.mediaQueryResponse.map( ({title, image_url, tmdb_id, type}) => {
                    return (
                        <MoviePoster image={image_url} tmdb_id={tmdb_id} key={tmdb_id} title={title} services={[disney_icon, netflix_icon, hbo_icon]} type={type}/>
                    )
                })
            }
         </section>
        </>
    )
}

function MoviePoster(props) {

    let [noChachedData, setNoChachedData] = useState(true);
    let [showServicesWindow, setShowServicesWindow] = useState(false);
    let [serviceHelperText, setServiceHelperText] = useState('LOADING...');
    let [streamingServiceHtmlElements, setStreamingServiceHtmlElements] = useState([]);

    useEffect( () => {

        console.log('checking streaming service elements');

        if (noChachedData == false) {
            if (streamingServiceHtmlElements.length) {
                setServiceHelperText('AVAILABLE TO WATCH ON')
            } else {
                setServiceHelperText('NO STREAMING SERVICES FOUND');
            }
        }

    }, [streamingServiceHtmlElements])
    

    const fetchServicesAndToggleWindow = () => {

        // fetch data on first load
        if (noChachedData) {
            fetchServicesData();
            setNoChachedData(false);
        }

        // toggle window
        setShowServicesWindow(!showServicesWindow);
    }



    const fetchServicesData = async () => {

        try {

            const uri = baseURL + 'streams/' + props.type + '/' + props.tmdb_id;
            const requestConfig = {
                url: uri
            }

            const response = await axios(requestConfig);

            const data = response.data.streamingInfo;
            
            const servicesToShow = [];

            if (data != null) {

                // check if streaming services returned are supported by our application
                Object.keys(data).forEach( serviceIn => {
                    // if supported, append an html element to our services list
                    if (Object.keys(supportedStreamingServices).includes(serviceIn)) {
                        servicesToShow.push(<StreamServiceIcon key={serviceIn} icon_url={supportedStreamingServices[serviceIn]}/>);
                    }
                })
            }

            setStreamingServiceHtmlElements(servicesToShow);

        }
        catch(error) {
            console.log(error);
        }


    }

    return (
        <>
        <span className='poster-container'  onClick={fetchServicesAndToggleWindow}>
            <section className={`poster-service-icons-container ${showServicesWindow ? 'active' : ''}`}>
                <h5>{serviceHelperText}</h5>
                <section className='poster-services-list'>

                    {
                        streamingServiceHtmlElements
                    }

                </section>
            </section>
            <span id='poster-service-activate-icon' className="fa-stack fa-lg">
                <i id='service-icon-background' className="fas fa-circle service-icon fa-stack-2x"></i>
                <i className='fa fa-info-circle service-icon fa-stack-1x'/>
            </span>
            
            {
                props.image ? <img className='poster-image' src={props.image}/> : <FallBackPosterBackground title={props.title}/>
            }
           
        </span>
        </>
    )
}

function FallBackPosterBackground(props) {

    return (
        <div className='fallback-poster-background'>
            <h4>{props.title}</h4>
        </div>
    )
}

function StreamServiceIcon(props) {

    return (
        <>
            <img className='poster-service-icon'  src={props.icon_url}></img>
        </>
    )
}


function AvailableStreams(props) {

    return (
            <section className='search-results-container'>

                <h1 className='available-on-text'>AVAILABLE ON</h1>

                <StreamServiceComponent
                    id='netflix-badge'
                    image={netflixImage} />

                <StreamServiceComponent
                    id='hulu-badge'
                    image={huluImage} />

                <StreamServiceComponent
                    id='hbomax-badge'
                    image={hboImage} />

                <StreamServiceComponent
                    id='disneyplus-badge'
                    image={disneyImage} />
                    
            </section>
    )
}

function StreamServiceComponent(props) {


    return (

        <>
            <div id={props.id} className='search-result-item'>
                <img src={props.image} />
                <i className="fas fa-arrow-circle-right fa-2x"></i>
            </div>
        </>
    )
}