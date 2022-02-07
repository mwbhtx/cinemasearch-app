import './searchpage-styles.css';
import '../styles/global-styles.css';
import { useEffect, useState } from 'react';

import axios from 'axios';

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
const digitalOceanEndpoint = 'https://mwbhtx-cinemasearch-6k9ku.ondigitalocean.app/v1/';

const endpoint = process.env.REACT_APP_LOCALHOST_MULTI || digitalOceanEndpoint;

export default function SearchPage(props) {

    const [formValues, setFormValues] = useState({
        query: '',
        query_type: 'movie',
    })

    const [mediaQueryResponse, setMediaQueryResponse] = useState([]);

    const [navMenuShown, setNavMenuShown] = useState(false);

    const [userRequestedTitle, setUserRequestedTitle] = useState(false);

    const handleFormChange = e => {
        setFormValues(
            {
                ...formValues,
                [e.target.name]: e.target.value,
            }
        )
    }

    const navMenuClickHandler = e => {
        setNavMenuShown(!navMenuShown);
    }

    const onSubmitHandler = async e => {
        e.preventDefault();

        if (!userRequestedTitle) {
            setUserRequestedTitle(true);    
        }

        const searchQuery = formValues.query;

        if (searchQuery.length > 0) {
            const requestConfig = {
                url: endpoint + 'multi',
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
    }

    return (
        <div className='app-container'>
            <nav>
                <span id='nav-button-container'  onClick={navMenuClickHandler}>
                   <i className={`fas fa-chevron-circle-up nav-button ${navMenuShown ? 'nav-button-active' : ''}`}/>
                   <a src='/'>
                        <h4>NAVIGATION</h4>
                   </a>
                </span>
                <ul id='nav-list' className={`${navMenuShown ? 'show-nav-menu' : ''}`}>
                    <li>HOME</li>
                    <li>ABOUT</li>
                    <li>PROJECTS</li>
                    <li>CONTACT</li>
                </ul>
            </nav>
            <header className='header-grid'>
            
                {/* Column 1 */}
                <div className='header-col-1'>
                </div>

                {/* Column 2 */}

                <section className='header-col-2'>

                    <span className='header-headings'>
                        <span className='header-site-name'>
                            <h2>CINEMA<br/>SEARCH</h2>
                        </span> 
                        <span className='header-subtitle'>
                            <h4>FIND A SHOW OR MOVIE TITLE.</h4>
                            <h4>EMBRACE THE BINGE.</h4>
                        </span>
                    </span>
                    <form className='form-container' onSubmit={onSubmitHandler}>
                        <span className='search-submit-container'>
                            <input id='search-input' type='text' placeholder='search for a movie or tv show' name='query' value={formValues.query} onChange={handleFormChange} />
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

            const uri = endpoint + 'streams/' + props.type + '/' + props.tmdb_id;
            const requestConfig = {
                url: uri
            }

            const response = await axios(requestConfig);

            const data = response.data;
            
            const servicesToShow = [];


            if (data != null) {

                // check if streaming services returned are supported by our application
                Object.keys(data).forEach( serviceIn => {
                    // if supported, append an html element to our services list
                    if (Object.keys(supportedStreamingServices).includes(serviceIn)) {
                        servicesToShow.push(<StreamServiceIcon key={serviceIn} icon_url={supportedStreamingServices[serviceIn]} streamLink={data[serviceIn].us.link}/>);
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
        <span className='poster-container'>

            {/* Service Icons Info Layer */}
            <section className={`poster-service-icons-container ${showServicesWindow ? 'active' : ''}`}>
                <h5>{props.title}</h5>
                <h5 id='service-helper-text'>{serviceHelperText}</h5>
                <section className='poster-services-list'>

                    {
                        streamingServiceHtmlElements
                    }

                </section>
            </section>

            {/* Service Icons Info Button */}
            <span id='poster-service-activate-icon' className="fa-stack fa-lg"   onClick={fetchServicesAndToggleWindow}>
                <i id='service-icon-background' className="fas fa-circle service-icon fa-stack-2x"></i>
                <i className={`fa ${showServicesWindow ? 'fa-times-circle' : 'fa-info-circle'} service-icon fa-stack-1x`}/>
            </span>
            
            {/* Poster Image */}
            {
                props.image ? <img className={`poster-image ${showServicesWindow ? 'blur-poster' : ''}`} src={props.image}/> : <FallBackPosterBackground title={props.title}/>
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
            <a id='service-badge-link' href={props.streamLink} target='_blank'>
                <img className='poster-service-icon'  src={props.icon_url}></img>
            </a>
        </>
    )
}

